import os
os.environ["SAP_HANA_URL"] = "hana://DBADMIN:Bharat%40123@b71cfa55-67a0-4d8a-9147-f584ff6f4ab4.hna0.prod-us10.hanacloud.ondemand.com:443?encrypt=true&validateCertificate=false"

from app.core.database import Base, engine
from sqlalchemy import inspect, text

try:
    print("Dropping all tables in HANA...")
    with engine.begin() as conn:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print("Existing tables:", tables)
        
        for table in tables:
            print(f"Dropping table {table}...")
            # Drop without quotes so HANA uppercases it!
            conn.execute(text(f'DROP TABLE {table}'))
            
    print("All tables dropped successfully!")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Exception: {e}")
