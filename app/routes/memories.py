from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from typing import List
from app.models import MemoryItem
from app.memory_store import memory_store

router = APIRouter(prefix="/api/memories", tags=["Memories"])

@router.get("", response_model=List[MemoryItem])
async def list_memories():
    """Retrieve all preserved family memories and oral histories."""
    return memory_store.get_all_memories()

@router.post("", response_model=MemoryItem)
async def create_memory(memory: MemoryItem):
    """Add a new memory, voice recording transcript, or ancestral recipe."""
    return memory_store.add_memory(memory)

@router.get("/export", response_class=HTMLResponse)
async def export_libro_de_recuerdos():
    """Generates an elegant, printable 'Libro de Recuerdos' family keepsake booklet."""
    memories = memory_store.get_all_memories()
    altar = memory_store.get_altar_status()
    
    html_items = ""
    for m in memories:
        html_items += f"""
        <div class="memory-card">
            <h3>{m.title} <span class="year">({m.year or 'Recuerdo'})</span></h3>
            <p class="category">Categoría: <strong>{m.category.upper()}</strong> | Registrado por: {m.recorded_by or 'Familia'}</p>
            <blockquote class="content">{m.content}</blockquote>
        </div>
        """

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Libro de Recuerdos: {altar.honoree_name}</title>
    <style>
        body {{
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #27272a;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #fdfbf7;
        }}
        .header {{
            text-align: center;
            border-bottom: 3px double #d97706;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        h1 {{
            color: #92400e;
            font-size: 2.4em;
            margin: 0;
            letter-spacing: 1px;
        }}
        .sub {{
            color: #b45309;
            font-style: italic;
            margin-top: 5px;
        }}
        .memory-card {{
            background: #ffffff;
            border: 1px solid #fde68a;
            border-left: 5px solid #d97706;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
            page-break-inside: avoid;
        }}
        h3 {{
            margin-top: 0;
            color: #78350f;
        }}
        .year {{
            font-size: 0.8em;
            color: #b45309;
            font-weight: normal;
        }}
        .category {{
            font-size: 0.85em;
            color: #71717a;
            margin-bottom: 12px;
        }}
        .content {{
            font-size: 1.05em;
            color: #3f3f46;
            margin: 0;
            font-style: italic;
        }}
        .footer {{
            text-align: center;
            margin-top: 50px;
            font-size: 0.9em;
            color: #a1a1aa;
            border-top: 1px solid #e4e4e7;
            padding-top: 20px;
        }}
        @media print {{
            body {{ background: #fff; margin: 0; padding: 10mm; }}
            .no-print {{ display: none; }}
        }}
    </style>
</head>
<body>
    <div class="no-print" style="text-align: right; margin-bottom: 20px;">
        <button onclick="window.print()" style="background:#d97706; color:white; border:none; padding:10px 18px; border-radius:4px; font-weight:bold; cursor:pointer;">
            🖨️ Imprimir / Guardar en PDF
        </button>
    </div>
    <div class="header">
        <h1>🌼 Libro de Recuerdos 🌼</h1>
        <p class="sub">En Memoria Eterna de {altar.honoree_name} ({altar.birth_year} – {altar.departure_year})</p>
        <p style="font-size: 0.9em; color:#78350f;">Ofrenda Digital Local & Bóveda de Historia Oral • Día de los Muertos</p>
    </div>
    <div class="memories-container">
        {html_items}
    </div>
    <div class="footer">
        <p><em>"No muere quien se va, sólo muere quien se olvida."</em></p>
        <p>Generado con Ofrenda & Google Gemma 4 • Archivo Privado Familiar 100% Sin Conexión</p>
    </div>
</body>
</html>
"""
    return html
