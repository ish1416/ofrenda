from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

class MemoryItem(BaseModel):
    id: str
    title: str
    category: str  # "recipe", "story", "saying", "song", "photo"
    content: str
    year: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    recorded_by: Optional[str] = "Family Member"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Offering(BaseModel):
    id: str
    name: str
    category: str  # "food", "flower", "incense", "memento", "candle"
    description: str
    placed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    icon: str = "🌼"

class CandleState(BaseModel):
    id: str
    name: str
    is_lit: bool = True
    lit_at: Optional[str] = None
    flame_intensity: float = 1.0  # 0.0 to 1.0

class ChatQuery(BaseModel):
    query: str
    stream: bool = False
    model_override: Optional[str] = None
    offline_mode: bool = False

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    model_used: str
    is_local: bool
    latency_ms: float
    estimated_tokens: int
    cost_usd: float
    reverence_score: float

class CalaveritaRequest(BaseModel):
    subject_name: str
    traits: List[str] = Field(default_factory=list)
    tone: str = "whimsical_reverent"  # traditional Día de los Muertos poetry style

class CalaveritaResponse(BaseModel):
    poem: str
    subject_name: str
    model_used: str
    stanzas_count: int

class AltarStatus(BaseModel):
    honoree_name: str
    birth_year: str
    departure_year: str
    candles: List[CandleState]
    offerings: List[Offering]
    memories_count: int
    total_homages: int

class LetterRequest(BaseModel):
    message: str
    recipient_name: Optional[str] = "Elena"
    sender_name: Optional[str] = "Familia"

class LetterResponse(BaseModel):
    blessing: str
    recipient_name: str
    embers_released: int
    model_used: str
    latency_ms: float
    reverence_score: float
