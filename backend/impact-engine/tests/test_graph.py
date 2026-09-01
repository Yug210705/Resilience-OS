from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_graph():
    r = client.get("/api/supply-chain/graph")
    assert r.status_code == 200
    data = r.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) > 0
