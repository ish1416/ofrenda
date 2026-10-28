import os
import json
from typing import List, Optional
from app.models import MemoryItem, Offering, CandleState, AltarStatus
from app.config import settings

INITIAL_MEMORIES = [
    {
        "id": "mem_01",
        "title": "Abuela Elena's Oaxacan Mole Negro Secret",
        "category": "recipe",
        "year": "1964",
        "tags": ["mole", "recipe", "oaxaca", "chocolate"],
        "recorded_by": "Maria (Granddaughter)",
        "content": (
            "Never rush the chiles. You toast the chilhuacle negro, mulato, and pasilla until they turn ash-dark, "
            "then quench them in cool spring water. The secret Abuela whispered was two disks of stone-ground "
            "Mexican cinnamon chocolate added right at the very end with a roasted plantain mashed to thicken the pan. "
            "She would always say: 'El mole huele a fiesta cuando el corazón está tranquilo' (Mole smells like a fiesta when your heart is peaceful)."
        )
    },
    {
        "id": "mem_02",
        "title": "Arriving in Coyoacán with Two Suitcases",
        "category": "story",
        "year": "1958",
        "tags": ["coyoacan", "migration", "family", "history"],
        "recorded_by": "Elena herself (Audio cassette transcription)",
        "content": (
            "We stepped off the second-class bus in Mexico City with two cardboard suitcases tied with twine and little Roberto "
            "wrapped tight against my chest in a rebozo. Rain was pouring over the cobblestones near Plaza Hidalgo. "
            "We had fifteen pesos left, so we bought a paper cone of roasted chestnuts to share under the awning of the church. "
            "I wasn't afraid because the city felt full of tomorrow."
        )
    },
    {
        "id": "mem_03",
        "title": "The Rule of the Kitchen Table",
        "category": "saying",
        "year": "1982",
        "tags": ["wisdom", "kitchen", "peace"],
        "recorded_by": "Carlos (Son)",
        "content": (
            "Whenever Carlos or his brothers argued about politics or money, Abuela would set a basket of warm corn tortillas "
            "and a pinch of sea salt in the dead center of the table. She would tap her knuckles against the wood and announce: "
            "'Nadie levanta la voz donde hay pan calientito. Coman primero, perdónense después.' (Nobody raises their voice where warm bread is served. Eat first, forgive after.)"
        )
    },
    {
        "id": "mem_04",
        "title": "Singing 'La Llorona' under the Jacaranda",
        "category": "song",
        "year": "1975",
        "tags": ["song", "music", "lallorona", "celebration"],
        "recorded_by": "Rosa (Sister)",
        "content": (
            "Every spring when the purple jacaranda blossoms covered the courtyard patio, Elena would tune her wooden Paracho guitar. "
            "Her singing voice wasn't polished for radio—it was smoky and deep. She sang: 'No sé qué tienen las flores, Llorona, las flores del camposanto...' "
            "and she taught all the neighborhood children that flowers on graves aren't for sadness; they are beacons so the wandering spirits can find their way back home."
        )
    }
]

INITIAL_OFFERINGS = [
    {
        "id": "off_01",
        "name": "Pan de Muerto Tradicional",
        "category": "food",
        "description": "Sweet orange blossom bread dusted with sugar, topped with crossbone dough signifying the four cardinal directions.",
        "icon": "🍞"
    },
    {
        "id": "off_02",
        "name": "Flores de Cempasúchil",
        "category": "flower",
        "description": "Golden twenty-petaled marigolds whose pungent perfume guides Elena's spirit through the veil.",
        "icon": "🌼"
    },
    {
        "id": "off_03",
        "name": "Copal Incense Burner",
        "category": "incense",
        "description": "Aromatic resin smoke that cleanses the space of sorrow and sanctifies the home.",
        "icon": "💨"
    },
    {
        "id": "off_04",
        "name": "Vaso de Agua y Sal",
        "category": "memento",
        "description": "Pure well water to quench the soul's long journey thirst, with sea salt to preserve purity.",
        "icon": "🍶"
    }
]

INITIAL_CANDLES = [
    {"id": "candle_north", "name": "Vela del Norte (Hope)", "is_lit": True, "flame_intensity": 1.0},
    {"id": "candle_east", "name": "Vela del Este (Dawn & Memory)", "is_lit": True, "flame_intensity": 1.0},
    {"id": "candle_south", "name": "Vela del Sur (Warmth & Gratitude)", "is_lit": True, "flame_intensity": 1.0},
    {"id": "candle_west", "name": "Vela del Oeste (Peace & Rest)", "is_lit": True, "flame_intensity": 1.0}
]

class MemoryStore:
    def __init__(self):
        os.makedirs(settings.data_dir, exist_ok=True)
        self.memories_file = os.path.join(settings.data_dir, "memories.json")
        self.offerings_file = os.path.join(settings.data_dir, "offerings.json")
        self.candles_file = os.path.join(settings.data_dir, "candles.json")
        self._load_or_init()

    def _load_or_init(self):
        # Load or initialize memories
        if not os.path.exists(self.memories_file):
            self.memories = [MemoryItem(**m) for m in INITIAL_MEMORIES]
            self._save_memories()
        else:
            try:
                with open(self.memories_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.memories = [MemoryItem(**m) for m in data]
            except Exception:
                self.memories = [MemoryItem(**m) for m in INITIAL_MEMORIES]

        # Load or initialize offerings
        if not os.path.exists(self.offerings_file):
            self.offerings = [Offering(**o) for o in INITIAL_OFFERINGS]
            self._save_offerings()
        else:
            try:
                with open(self.offerings_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.offerings = [Offering(**o) for o in data]
            except Exception:
                self.offerings = [Offering(**o) for o in INITIAL_OFFERINGS]

        # Load or initialize candles
        if not os.path.exists(self.candles_file):
            self.candles = [CandleState(**c) for c in INITIAL_CANDLES]
            self._save_candles()
        else:
            try:
                with open(self.candles_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.candles = [CandleState(**c) for c in data]
            except Exception:
                self.candles = [CandleState(**c) for c in INITIAL_CANDLES]

    def _save_memories(self):
        with open(self.memories_file, "w", encoding="utf-8") as f:
            json.dump([m.model_dump() for m in self.memories], f, indent=2, ensure_ascii=False)

    def _save_offerings(self):
        with open(self.offerings_file, "w", encoding="utf-8") as f:
            json.dump([o.model_dump() for o in self.offerings], f, indent=2, ensure_ascii=False)

    def _save_candles(self):
        with open(self.candles_file, "w", encoding="utf-8") as f:
            json.dump([c.model_dump() for c in self.candles], f, indent=2, ensure_ascii=False)

    def get_all_memories(self) -> List[MemoryItem]:
        return self.memories

    def add_memory(self, memory: MemoryItem) -> MemoryItem:
        self.memories.append(memory)
        self._save_memories()
        return memory

    def search_memories(self, query: str) -> List[MemoryItem]:
        q = query.lower()
        results = []
        for m in self.memories:
            if q in m.title.lower() or q in m.content.lower() or any(q in t.lower() for t in m.tags):
                results.append(m)
        return results if results else self.memories[:3]

    def get_all_offerings(self) -> List[Offering]:
        return self.offerings

    def add_offering(self, offering: Offering) -> Offering:
        self.offerings.append(offering)
        self._save_offerings()
        return offering

    def get_candles(self) -> List[CandleState]:
        return self.candles

    def toggle_candle(self, candle_id: str) -> Optional[CandleState]:
        for c in self.candles:
            if c.id == candle_id:
                c.is_lit = not c.is_lit
                self._save_candles()
                return c
        return None

    def get_altar_status(self) -> AltarStatus:
        return AltarStatus(
            honoree_name="Elena Ramirez Solis",
            birth_year="1938",
            departure_year="2021",
            candles=self.candles,
            offerings=self.offerings,
            memories_count=len(self.memories),
            total_homages=len(self.offerings) + sum(1 for c in self.candles if c.is_lit)
        )

memory_store = MemoryStore()
