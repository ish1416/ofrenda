from fastapi import APIRouter
from app.models import (
    ChatQuery, ChatResponse,
    CalaveritaRequest, CalaveritaResponse,
    LetterRequest, LetterResponse
)
from app.gemma_engine import gemma_engine

router = APIRouter(prefix="/api/chat", tags=["Gemma Chronicler"])

@router.post("/query", response_model=ChatResponse)
async def query_chronicler(query_data: ChatQuery):
    """Query Gemma to consult preserved family memories with authentic reverence."""
    result = await gemma_engine.query_memory(
        user_query=query_data.query,
        force_offline=query_data.offline_mode
    )
    return ChatResponse(**result)

@router.post("/calaverita", response_model=CalaveritaResponse)
async def generate_calaverita(req: CalaveritaRequest):
    """Generate a celebratory traditional Calaverita Literaria for Día de los Muertos."""
    poem, stanzas = await gemma_engine.generate_calaverita(
        subject=req.subject_name,
        traits=req.traits
    )
    return CalaveritaResponse(
        poem=poem,
        subject_name=req.subject_name,
        model_used=gemma_engine.model_name,
        stanzas_count=stanzas
    )

@router.post("/letter", response_model=LetterResponse)
async def burn_sacred_letter(req: LetterRequest):
    """Burn a memory letter to the ancestors, returning a poetic blessing."""
    blessing, duration_ms = await gemma_engine.generate_letter_blessing(
        message=req.message,
        recipient=req.recipient_name or "Elena",
        sender=req.sender_name or "Familia"
    )
    embers = max(12, int(len(req.message) / 4))
    return LetterResponse(
        blessing=blessing,
        recipient_name=req.recipient_name or "Elena",
        embers_released=embers,
        model_used=gemma_engine.model_name,
        latency_ms=duration_ms,
        reverence_score=1.0
    )
