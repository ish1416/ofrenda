import os
import time
import logging
from typing import Dict, Any, Optional
import sentry_sdk
from app.config import settings

logger = logging.getLogger("ofrenda.sentry")

def init_sentry():
    if settings.sentry_dsn:
        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            environment=os.getenv("ENVIRONMENT", "production"),
            release=f"ofrenda@{settings.app_version}",
            send_default_pii=False,
        )
        logger.info("Sentry Agent Tracing initialized.")
    else:
        logger.info("Sentry DSN not provided; running in local mock tracing mode.")

class AgentTracer:
    """Instruments LLM interactions with standard gen_ai spans for Sentry."""
    
    @staticmethod
    def trace_inference(
        query: str,
        response_text: str,
        model_name: str,
        is_local: bool,
        duration_ms: float,
        prompt_tokens: int,
        completion_tokens: int,
        guardrail_passed: bool = True
    ) -> Dict[str, Any]:
        # Cost estimation: Local Ollama Gemma costs $0.000. Cloud costs approx $0.18/M in, $0.50/M out
        if is_local:
            cost_usd = 0.000000
        else:
            cost_usd = (prompt_tokens * 0.00000018) + (completion_tokens * 0.00000050)

        trace_data = {
            "gen_ai.system": "gemma",
            "gen_ai.model": model_name,
            "gen_ai.is_local": is_local,
            "gen_ai.duration_ms": duration_ms,
            "gen_ai.usage.prompt_tokens": prompt_tokens,
            "gen_ai.usage.completion_tokens": completion_tokens,
            "gen_ai.usage.total_tokens": prompt_tokens + completion_tokens,
            "gen_ai.usage.cost_usd": cost_usd,
            "gen_ai.guardrail.reverence_passed": guardrail_passed,
        }

        # Send to Sentry if active
        if settings.sentry_dsn:
            with sentry_sdk.start_transaction(op="gen_ai.inference", name=f"Gemma Query: {model_name}") as tx:
                for k, v in trace_data.items():
                    tx.set_tag(k, str(v))
                tx.set_data("prompt_summary", query[:80] + "...")
                tx.set_data("completion_tokens", completion_tokens)
                tx.set_data("cost_usd", cost_usd)

        return trace_data

agent_tracer = AgentTracer()
