from fastapi import APIRouter, HTTPException
from typing import List
from app.models import AltarStatus, CandleState, Offering
from app.memory_store import memory_store

router = APIRouter(prefix="/api/altar", tags=["Altar"])

@router.get("", response_model=AltarStatus)
async def get_altar():
    """Retrieve current altar status including lit candles and active offerings."""
    return memory_store.get_altar_status()

@router.post("/candles/{candle_id}/toggle", response_model=CandleState)
async def toggle_candle(candle_id: str):
    """Light or extinguish an altar candle."""
    candle = memory_store.toggle_candle(candle_id)
    if not candle:
        raise HTTPException(status_code=404, detail="Candle not found on altar")
    return candle

@router.post("/offerings", response_model=Offering)
async def add_offering(offering: Offering):
    """Place a new offering on the altar."""
    return memory_store.add_offering(offering)

@router.get("/candles", response_model=List[CandleState])
async def list_candles():
    """List all four cardinal altar candles."""
    return memory_store.get_candles()
