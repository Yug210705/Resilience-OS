from app.core.database import engine
from sqlalchemy import inspect
try:
    inspector = inspect(engine)
    print("Tables:", inspector.get_table_names())
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Exception: {e}")
