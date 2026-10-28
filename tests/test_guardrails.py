import pytest
from app.gemma_engine import gemma_engine

@pytest.mark.asyncio
async def test_reverence_query_mole():
    res = await gemma_engine.query_memory("What was Abuela's secret to the mole recipe?")
    assert "mole" in res["answer"].lower()
    assert "chocolate" in res["answer"].lower() or "chilhuacle" in res["answer"].lower()
    assert res["reverence_score"] >= 0.95
    assert "Gemma" in res["model_used"]

@pytest.mark.asyncio
async def test_reverence_guardrail_filters_ads():
    passed, score = gemma_engine._check_reverence_guardrail("Honoring her memory with respect", [])
    assert passed is True
    assert score >= 0.95

    failed, bad_score = gemma_engine._check_reverence_guardrail("Buy now with discount code 50OFF!", [])
    assert failed is False
    assert bad_score == 0.0

@pytest.mark.asyncio
async def test_calaverita_generation():
    poem, stanzas = await gemma_engine.generate_calaverita("Elena", ["el mole", "la guitarra"])
    assert "Catrina" in poem or "Muerte" in poem or "Elena" in poem
    assert stanzas >= 2
