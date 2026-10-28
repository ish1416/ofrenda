from fastapi import APIRouter
from app.models import ChatQuery, ChatResponse, CalaveritaRequest, CalaveritaResponse
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
