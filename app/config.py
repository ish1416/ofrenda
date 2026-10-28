import os
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "Ofrenda: Living Digital Altar & Oral History Vault"
    app_version: str = "1.0.0"
    ollama_host: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    gemma_model: str = os.getenv("GEMMA_MODEL", "gemma2:9b")
    sentry_dsn: str = os.getenv("SENTRY_DSN", "")
    demo_mode: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
    data_dir: str = os.getenv("DATA_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "data"))
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

settings = Settings()
