import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Ofrenda" in data["app"]

def test_get_altar():
    res = client.get("/api/altar")
    assert res.status_code == 200
    data = res.json()
    assert data["honoree_name"] == "Elena Ramirez Solis"
    assert len(data["candles"]) == 4
    assert len(data["offerings"]) >= 4

def test_toggle_candle():
    # Toggle north candle
    res = client.post("/api/altar/candles/candle_north/toggle")
    assert res.status_code == 200
    data = res.json()
    assert "candle_north" in data["id"]
    initial_state = data["is_lit"]
    
    # Toggle again
    res2 = client.post("/api/altar/candles/candle_north/toggle")
    assert res2.status_code == 200
    assert res2.json()["is_lit"] != initial_state

def test_list_and_add_memory():
    res = client.get("/api/memories")
    assert res.status_code == 200
    memories = res.json()
    assert len(memories) >= 4

    new_memory = {
        "id": "mem_test_01",
        "title": "Making Hot Chocolate on Cold Mornings",
        "category": "story",
        "year": "1995",
        "tags": ["chocolate", "morning", "warmth"],
        "recorded_by": "Test Suite",
        "content": "She would whisk the clay jug with the wooden molinillo until thick foam rose to the rim."
    }
    post_res = client.post("/api/memories", json=new_memory)
    assert post_res.status_code == 200
    assert post_res.json()["title"] == "Making Hot Chocolate on Cold Mornings"

def test_export_keepsake_html():
    res = client.get("/api/memories/export")
    assert res.status_code == 200
    assert "Libro de Recuerdos" in res.text
    assert "Elena Ramirez Solis" in res.text

def test_burn_sacred_letter():
    res = client.post("/api/chat/letter", json={
        "message": "Te extraño todos los días, Abuela. Gracias por enseñarme a tener paciencia.",
        "recipient_name": "Elena",
        "sender_name": "Nieta"
    })
    assert res.status_code == 200
    data = res.json()
    assert "blessing" in data
    assert "Elena" in data["blessing"]
    assert data["embers_released"] >= 12
    assert data["reverence_score"] == 1.0
