import os
os.environ["DATABASE_URL"] = "hana://DBADMIN:Bharat%40123@b71cfa55-67a0-4d8a-9147-f584ff6f4ab4.hna0.prod-us10.hanacloud.ondemand.com:443?encrypt=true&validateCertificate=false"

from app.core.database import Base, engine
import app.db.models  # IMPORT MODELS!
from sqlalchemy import inspect

try:
    print("Trying to create all tables in HANA for monolith...")
    Base.metadata.create_all(bind=engine)
    print("Success!")
    
    # Verify tables actually exist in HANA!
    inspector = inspect(engine)
    print("Tables in HANA:", inspector.get_table_names())
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Exception: {e}")
