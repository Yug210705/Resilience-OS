from abc import ABC, abstractmethod
import asyncio
import random
import structlog
import uuid

logger = structlog.get_logger()

class SAPAdapter(ABC):
    @abstractmethod
    async def get_supply_data(self) -> dict: pass
    
    @abstractmethod
    async def create_recovery_action(self, plan: dict) -> dict: pass
    
    @abstractmethod
    async def get_transaction_status(self, txn_id: str) -> dict: pass


class MockSAPAdapter(SAPAdapter):
    async def get_supply_data(self, material_id: str = "MAT-12") -> dict:
        logger.info("[MOCK SAP — simulating OData fetch]", action="get_supply_data", material_id=material_id)
        await asyncio.sleep(1.2)
        return {
            "material_id": material_id,
            "shortage_quantity": 5000,
            "existing_inventory": 100,
            "suppliers": [
                {"id": "SUP-A", "capacity": 10000, "unit_cost": 210.0, "lead_time_days": 8.0, "risk_score": 0.31},
                {"id": "SUP-B", "capacity": 6000, "unit_cost": 140.0, "lead_time_days": 3.0, "risk_score": 0.14},
                {"id": "SUP-C", "capacity": 8000, "unit_cost": 90.0, "lead_time_days": 5.0, "risk_score": 0.22}
            ],
            "affected_orders": [
                {"id": "ORD-001", "revenue_at_risk": 2000000.0, "sla_penalty": 150000.0},
                {"id": "ORD-002", "revenue_at_risk": 1800000.0, "sla_penalty": 100000.0}
            ]
        }
        
    async def create_recovery_action(self, plan: dict) -> dict:
        logger.info("[MOCK SAP — replace with OData/BTP call]", action="create_recovery_action")
        # simulate realistic async delay (1.2-2s)
        await asyncio.sleep(random.uniform(1.2, 2.0))
        txn_id = f"45{random.randint(1000000, 9999999)}"
        return {"transaction_id": txn_id, "status": "READY_FOR_APPROVAL", "plan": plan}
        
    async def get_transaction_status(self, txn_id: str) -> dict:
        logger.info("[MOCK SAP — replace with OData/BTP call]", action="get_transaction_status")
        await asyncio.sleep(0.5)
        # Progresses from READY_FOR_APPROVAL -> CONFIRMED
        return {"transaction_id": txn_id, "status": "CONFIRMED"}


class BTPDestinationAdapter(SAPAdapter):
    """
    Real S/4HANA Adapter using SAP BTP Destination Service.
    Authenticates via XSUAA (OAuth2 client credentials) and routes OData calls through BTP.
    """
    def __init__(self):
        import os
        # SAP BTP Credentials
        self.btp_client_id = os.environ.get("SAP_BTP_CLIENT_ID", "mock-client-id")
        self.btp_client_secret = os.environ.get("SAP_BTP_CLIENT_SECRET", "mock-secret")
        self.btp_token_url = os.environ.get("SAP_BTP_TOKEN_URL", "https://mock.authentication.us10.hana.ondemand.com/oauth/token")
        self.destination_url = os.environ.get("SAP_DESTINATION_URL", "https://sandbox.api.sap.com/s4hanacloud")
        
        # In a real environment, we'd fetch the XSUAA token here.
        # We will use the Sandbox API key for hackathon purposes if BTP isn't fully configured.
        self.api_key = os.environ.get("SAP_API_KEY", "")
        self._access_token = None
        
    async def _get_access_token(self, client) -> str:
        """Fetches OAuth2 token from SAP BTP XSUAA"""
        if self._access_token:
            return self._access_token
            
        logger.info("Authenticating with SAP BTP XSUAA...", url=self.btp_token_url)
        # Real OAuth2 client_credentials flow for SAP BTP
        response = await client.post(
            self.btp_token_url,
            data={
                "grant_type": "client_credentials",
                "client_id": self.btp_client_id,
                "client_secret": self.btp_client_secret
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code != 200:
            logger.error("BTP Authentication failed", status=response.status_code, error=response.text)
            if self.api_key:
                # API Sandbox fallback path when real BTP is unavailable but Sandbox API key is provided
                logger.warning("Falling back to SAP API Hub sandbox key")
                return ""
            raise Exception(f"BTP Authentication failed: {response.text}")
            
        data = response.json()
        self._access_token = data.get("access_token")
        return self._access_token

    def _get_headers(self) -> dict:
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if self.api_key:
            headers["APIKey"] = self.api_key
        return headers

    async def _fetch_csrf_token(self, client, headers) -> str:
        fetch_headers = headers.copy()
        fetch_headers["x-csrf-token"] = "Fetch"
        url = f"{self.destination_url}/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/"
        response = await client.head(url, headers=fetch_headers)
        return response.headers.get("x-csrf-token", "")

    async def get_supply_data(self, material_id: str = "MAT-12") -> dict:
        """Queries inventory levels via API_PRODUCT_SRV through BTP"""
        sap_material = "TG11"
        url = f"{self.destination_url}/sap/opu/odata/sap/API_PRODUCT_SRV/A_ProductPlant(Product='{sap_material}',Plant='1010')"
        
        import httpx
        async with httpx.AsyncClient() as client:
            token = await self._get_access_token(client)
            headers = self._get_headers()
            if token and "sandbox.api.sap.com" not in self.destination_url:
                headers["Authorization"] = f"Bearer {token}"
            
            logger.info("Calling SAP S/4HANA via BTP Destination...", url=url)
            response = await client.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                real_inventory = 100
                try:
                    if "d" in data and "SafetyStockQuantity" in data["d"]:
                        val = float(data["d"]["SafetyStockQuantity"])
                        if val > 0: real_inventory = int(val)
                except Exception:
                    pass
                
                return {
                    "material_id": material_id,
                    "shortage_quantity": 5000,
                    "existing_inventory": real_inventory,
                    "suppliers": [
                        {"id": "SUP-A", "capacity": 10000, "unit_cost": 210.0, "lead_time_days": 8.0, "risk_score": 0.31},
                        {"id": "SUP-B", "capacity": 6000, "unit_cost": 140.0, "lead_time_days": 3.0, "risk_score": 0.14},
                        {"id": "SUP-C", "capacity": 8000, "unit_cost": 90.0, "lead_time_days": 5.0, "risk_score": 0.22}
                    ],
                    "affected_orders": [
                        {"id": "ORD-001", "revenue_at_risk": 2000000.0, "sla_penalty": 150000.0},
                        {"id": "ORD-002", "revenue_at_risk": 1800000.0, "sla_penalty": 100000.0}
                    ]
                }
            
            logger.error("SAP API Error", status=response.status_code, text=response.text)
            raise Exception(f"SAP API Error: {response.status_code}")
        
    async def create_recovery_action(self, plan: dict) -> dict:
        """Executes a BAPI call via S/4HANA OData API to create a Purchase Order"""
        url = f"{self.destination_url}/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder"
        import httpx
        async with httpx.AsyncClient() as client:
            token = await self._get_access_token(client)
            headers = self._get_headers()
            if token and "sandbox.api.sap.com" not in self.destination_url:
                headers["Authorization"] = f"Bearer {token}"
            
            csrf_token = await self._fetch_csrf_token(client, headers)
            headers["x-csrf-token"] = csrf_token
            
            # S/4HANA BAPI Wrapper payload for Purchase Order creation
            sap_payload = {
                "PurchaseOrderType": "NB",
                "Supplier": "10300001",
                "PurchasingOrganization": "1010",
                "PurchasingGroup": "001",
                "CompanyCode": "1010"
            }
            
            logger.info("Executing SAP BAPI via BTP Destination...", url=url)
            response = await client.post(url, headers=headers, json=sap_payload)
            if response.status_code in (201, 202):
                data = response.json()
                return {"transaction_id": data["d"]["PurchaseOrder"], "status": "SUBMITTED", "plan": plan}
            
            logger.error(f"SAP PO Creation failed. Error: {response.text}")
            raise Exception(f"SAP PO Creation failed: {response.status_code} - {response.text}")
        
    async def get_transaction_status(self, txn_id: str) -> dict:
        url = f"{self.destination_url}/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder('{txn_id}')"
        import httpx
        async with httpx.AsyncClient() as client:
            token = await self._get_access_token(client)
            headers = self._get_headers()
            if token and "sandbox.api.sap.com" not in self.destination_url:
                headers["Authorization"] = f"Bearer {token}"
            
            response = await client.get(url, headers=headers)
            if response.status_code == 200:
                return {"transaction_id": txn_id, "status": "CONFIRMED"}
            raise Exception(f"SAP Status Error: {response.status_code}")

class CAPAdapter(SAPAdapter):
    """
    Adapter for local SAP CAP (Cloud Application Programming) service.
    Used to showcase real OData V4 POST/write capabilities on a Fiori Elements portal.
    """
    def __init__(self):
        self.base_url = "http://localhost:4004/odata/v4/catalog"
        
    async def get_supply_data(self, material_id: str = "MAT-12") -> dict:
        return {
            "material_id": material_id,
            "shortage_quantity": 5000,
            "existing_inventory": 100,
            "suppliers": [
                {"id": "SUP-A", "capacity": 10000, "unit_cost": 210.0, "lead_time_days": 8.0, "risk_score": 0.31},
                {"id": "SUP-B", "capacity": 6000, "unit_cost": 140.0, "lead_time_days": 3.0, "risk_score": 0.14},
                {"id": "SUP-C", "capacity": 8000, "unit_cost": 90.0, "lead_time_days": 5.0, "risk_score": 0.22}
            ],
            "affected_orders": [
                {"id": "ORD-001", "revenue_at_risk": 2000000.0, "sla_penalty": 150000.0},
                {"id": "ORD-002", "revenue_at_risk": 1800000.0, "sla_penalty": 100000.0}
            ]
        }
        
    async def create_recovery_action(self, plan: dict) -> dict:
        import httpx
        import uuid
        import datetime
        
        async with httpx.AsyncClient() as client:
            post_url = f"{self.base_url}/PurchaseOrders"
            
            payload = {
                "ID": str(uuid.uuid4()),
                "SupplierID": plan.get("new_supplier", "UNKNOWN"),
                "MaterialID": plan.get("material_id", "MAT-12"),
                "Quantity": plan.get("allocated_quantity", 5000),
                "TotalCost": float(plan.get("total_cost", 0)),
                "Status": "Approved",
                "CreatedAt": datetime.datetime.utcnow().isoformat() + "Z"
            }
            
            logger.info("Executing SAP CAP POST to create Purchase Order...", url=post_url)
            post_resp = await client.post(post_url, json=payload, timeout=10)
            
            if post_resp.status_code in (201, 202, 200):
                data = post_resp.json()
                logger.info(f"Successfully created SAP CAP Purchase Order {data['ID']}!")
                return {"transaction_id": data['ID'], "status": "SUBMITTED", "plan": plan}
                
            raise Exception(f"SAP CAP Order Creation failed: {post_resp.status_code} - {post_resp.text}")

    async def get_transaction_status(self, txn_id: str) -> dict:
        return {"transaction_id": txn_id, "status": "CONFIRMED"}
