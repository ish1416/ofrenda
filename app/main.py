import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.sentry_tracer import init_sentry
from app.routes import altar, memories, chat

# Initialize Sentry Agent Tracing
init_sentry()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Offline-First Living Digital Altar and Oral History Vault with Google Gemma"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(altar.router)
app.include_router(memories.router)
app.include_router(chat.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "gemma_model": settings.gemma_model,
        "ollama_host": settings.ollama_host
    }

# Mount static frontend
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
