import os
import time

os.environ["SAP_HANA_URL"] = "hana://DBADMIN:Bharat%40123@b71cfa55-67a0-4d8a-9147-f584ff6f4ab4.hna0.prod-us10.hanacloud.ondemand.com:443?encrypt=true&validateCertificate=false"

from app.core.database import engine
from sqlalchemy import text

print("Waiting for HANA DB to start...", flush=True)
while True:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("HANA DB is UP AND RUNNING!", flush=True)
        break
    except Exception as e:
        print(f"Still waiting... {e}", flush=True)
        time.sleep(10)
