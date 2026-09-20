from app.core.database import Base, engine
try:
    print("Trying to create all tables...")
    Base.metadata.create_all(bind=engine)
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Exception: {e}")
