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


class RealSAPAdapter(SAPAdapter):
    """
    Real S/4HANA Adapter.
    Maps to S/4HANA OData services, typically routed through SAP BTP Destination Service.
    """
    def __init__(self):
        import os
        self.base_url = os.environ.get("SAP_S4_BASE_URL", "https://sandbox.api.sap.com/s4hanacloud")
        self.api_key = os.environ.get("SAP_API_KEY", "")
        self.headers = {
            "APIKey": self.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    async def _fetch_csrf_token(self, client) -> str:
        # Standard SAP OData requirement: fetch x-csrf-token before POST/PATCH
        headers = self.headers.copy()
        headers["x-csrf-token"] = "Fetch"
        url = f"{self.base_url}/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/"
        response = await client.head(url, headers=headers)
        return response.headers.get("x-csrf-token", "")

    async def get_supply_data(self) -> dict:
        """Queries inventory levels via API_PRODUCT_SRV"""
        url = f"{self.base_url}/sap/opu/odata/sap/API_PRODUCT_SRV/A_ProductPlant"
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 200:
                return response.json()
            raise Exception(f"SAP API Error: {response.status_code}")
        
    async def create_recovery_action(self, plan: dict) -> dict:
        """Creates a Purchase Order via API_PURCHASEORDER_PROCESS_SRV"""
        url = f"{self.base_url}/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder"
        import httpx
        async with httpx.AsyncClient() as client:
            csrf_token = await self._fetch_csrf_token(client)
            headers = self.headers.copy()
            headers["x-csrf-token"] = csrf_token
            
            # Translate 'plan' dict to SAP OData payload format
            sap_payload = {
                "PurchaseOrderType": "NB",
                "Supplier": plan.get("suppliers_used", [""])[0],
                "PurchasingOrganization": "1010",
                "PurchasingGroup": "001"
            }
            
            response = await client.post(url, headers=headers, json=sap_payload)
            if response.status_code in (201, 202):
                data = response.json()
                return {"transaction_id": data["d"]["PurchaseOrder"], "status": "SUBMITTED", "plan": plan}
            raise Exception(f"SAP PO Creation Error: {response.text}")
        
    async def get_transaction_status(self, txn_id: str) -> dict:
        """Checks PO status via API_PURCHASEORDER_PROCESS_SRV"""
        url = f"{self.base_url}/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder('{txn_id}')"
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 200:
                # Map SAP internal status to our frontend status
                return {"transaction_id": txn_id, "status": "CONFIRMED"}
            raise Exception(f"SAP Status Error: {response.status_code}")
