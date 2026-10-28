/**
 * loteria.js - Lotería de los Recuerdos (Interactive Ancestral Card Deck)
 * Traditional Mexican folk memory cards with 3D flip physics, procedural sound,
 * and AI oracle consultation powered by air-gapped Gemma.
 */
const LOTERIA_CARDS = [
  {
    id: "calavera",
    number: "01",
    name: "La Calavera",
    subtitle: "El Espejo de la Muerte Dulce",
    icon: "💀",
    color: "#ec4899",
    verse: "Al pasar por el panteón, no me llores con pesar; come pan y toma mole, que venimos a cantar.",
    reflection: "Abuela Elena decía que la calavera no es terror, sino un recordatorio de que la vida es una fiesta breve y hermosa.",
    prompt: "Abuela Elena, he sacado la carta de La Calavera en la lotería. ¿Qué consejo tienes para mí sobre la muerte y sobre vivir sin miedo?"
  },
  {
    id: "cempasuchil",
    number: "02",
    name: "El Cempasúchil",
    subtitle: "La Flor de Veinte Pétalos",
    icon: "🌼",
    color: "#f59e0b",
    verse: "Flor dorada de otoño ardiente, que con tu aroma a sol maduro guías el paso de la gente.",
    reflection: "Los pétalos forman el camino dorado que cruza el Mictlán hasta nuestra mesa.",
    prompt: "Abuela Elena, he sacado la carta del Cempasúchil. ¿Cómo me recuerdas en este camino y qué luz me dejas para seguir?"
  },
  {
    id: "pan_de_muerto",
    number: "03",
    name: "El Pan de Muerto",
    subtitle: "La Ofrenda de la Fraternidad",
    icon: "🍞",
    color: "#d97706",
    verse: "Azúcar fina y azahar, huesos de masa en la cruz; comer con los que se fueron bajo el candil de la luz.",
    reflection: "Huesitos de harina cruzados hacia los cuatro puntos cardinales del universo.",
    prompt: "Abuela Elena, saqué El Pan de Muerto. ¿Qué significa para ti partir el pan con la familia que aún está viva y con los ausentes?"
  },
  {
    id: "guitarra",
    number: "04",
    name: "La Guitarra",
    subtitle: "El Eco de Paracho",
    icon: "🎸",
    color: "#8b5cf6",
    verse: "Cuerdas de cedro y jacaranda, rasgueadas en noche serena; si no cantas La Llorona, el corazón se envenena.",
    reflection: "Su guitarra Paracho de 1975, afinada en noches lluviosas en el patio empedrado de Coyoacán.",
    prompt: "Abuela Elena, saqué La Guitarra. ¿Qué canción te alivia el alma cuando la noche es larga?"
  },
  {
    id: "corazon",
    number: "05",
    name: "El Corazón",
    subtitle: "El Vínculo Eterno",
    icon: "❤️",
    color: "#ef4444",
    verse: "No te aflijas por la ausencia ni por la distancia fría; quien se lleva el corazón vive en la memoria mía.",
    reflection: "El único puente indestructible entre los dos lados del velo es el amor incondicional.",
    prompt: "Abuela Elena, saqué El Corazón. A veces me duele extrañarte tanto, ¿cómo transformo este dolor en amor?"
  },
  {
    id: "copal",
    number: "06",
    name: "El Copal",
    subtitle: "El Humo Sagrado",
    icon: "💨",
    color: "#06b6d4",
    verse: "Sube el humo en espirales, blanco incienso de la sierra; limpia penas y dolores, une el cielo con la tierra.",
    reflection: "Resina de árbol sagrado de Oaxaca que purifica los cuartos y consagra los recuerdos.",
    prompt: "Abuela Elena, saqué El Copal Blanco. ¿Cómo puedo limpiar mis preocupaciones y encontrar paz interior?"
  },
  {
    id: "luna",
    number: "07",
    name: "La Luna",
    subtitle: "La Compañera de Medianoche",
    icon: "🌙",
    color: "#38bdf8",
    verse: "Rueda de plata en el cielo, alumbra al ánima errante; no hay oscuridad completa si tu lumbre va delante.",
    reflection: "Bajo esta luna llena de noviembre, el velo entre mundos se vuelve fino como papel de seda.",
    prompt: "Abuela Elena, saqué La Luna. ¿Nos miras desde allá? ¿Cómo se siente el otro lado del cielo?"
  },
  {
    id: "metate",
    number: "08",
    name: "El Metate",
    subtitle: "La Raíz Ancestral",
    icon: "🥣",
    color: "#10b981",
    verse: "Piedra volcánica dura, mano que muele sin queja; el sabor de los abuelos en el metate se añeja.",
    reflection: "Heredado de su bisabuela en 1910. En él se molieron las pepitas y chiles para el mole de todas las bodas y despedidas.",
    prompt: "Abuela Elena, saqué El Metate. ¿Cuál es el verdadero secreto de tus recetas y de mantener las tradiciones vivas?"
  }
];

class LoteriaEngine {
  constructor() {
    this.container = document.getElementById("loteria-grid");
    this.modal = document.getElementById("loteria-modal");
    this.activeCard = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderCards();
    this.bindEvents();
  }

  renderCards() {
    this.container.innerHTML = LOTERIA_CARDS.map(card => `
      <div class="loteria-card" data-id="${card.id}" role="button" tabindex="0" title="Voltear carta de ${card.name}">
        <div class="loteria-inner">
          <div class="loteria-front" style="--card-theme: ${card.color};">
            <span class="loteria-num">${card.number}</span>
            <div class="loteria-icon">${card.icon}</div>
            <div class="loteria-title">${card.name}</div>
            <div class="loteria-sub">${card.subtitle}</div>
          </div>
          <div class="loteria-back">
            <span class="loteria-back-pattern">✦ ✦ ✦</span>
            <span style="font-size: 0.72rem; color: #fbbf24; font-weight: bold; letter-spacing: 1px;">OFRENDA</span>
            <span style="font-size: 0.65rem; color: #a1a1aa;">Lotería de Recuerdos</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  bindEvents() {
    this.container.addEventListener("click", (e) => {
      const cardEl = e.target.closest(".loteria-card");
      if (!cardEl) return;
      const cardId = cardEl.getAttribute("data-id");
      this.selectCard(cardId);
    });

    const drawRandomBtn = document.getElementById("btn-draw-loteria");
    if (drawRandomBtn) {
      drawRandomBtn.addEventListener("click", () => {
        const rand = LOTERIA_CARDS[Math.floor(Math.random() * LOTERIA_CARDS.length)];
        this.selectCard(rand.id);
      });
    }

    const consultBtn = document.getElementById("loteria-consult-oracle");
    if (consultBtn) {
      consultBtn.addEventListener("click", () => {
        if (!this.activeCard) return;
        this.consultOracle(this.activeCard);
      });
    }

    const closeBtn = document.getElementById("loteria-modal-close");
    if (closeBtn && this.modal) {
      closeBtn.addEventListener("click", () => {
        this.modal.classList.remove("open");
      });
    }

    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.modal.classList.remove("open");
      });
    }
  }

  selectCard(cardId) {
    const card = LOTERIA_CARDS.find(c => c.id === cardId);
    if (!card) return;
    this.activeCard = card;

    if (window.soundFx) {
      window.soundFx.cardFlip();
    }

    // Populate modal
    const iconEl = document.getElementById("loteria-modal-icon");
    const numEl = document.getElementById("loteria-modal-num");
    const titleEl = document.getElementById("loteria-modal-title");
    const subEl = document.getElementById("loteria-modal-sub");
    const verseEl = document.getElementById("loteria-modal-verse");
    const refEl = document.getElementById("loteria-modal-reflection");
    const responseBox = document.getElementById("loteria-oracle-response");

    if (iconEl) iconEl.textContent = card.icon;
    if (numEl) numEl.textContent = `#${card.number}`;
    if (titleEl) {
      titleEl.textContent = card.name;
      titleEl.style.color = card.color;
    }
    if (subEl) subEl.textContent = card.subtitle;
    if (verseEl) verseEl.textContent = `"${card.verse}"`;
    if (refEl) refEl.textContent = card.reflection;
    if (responseBox) {
      responseBox.textContent = "";
      responseBox.classList.add("hidden");
    }

    if (this.modal) {
      this.modal.classList.add("open");
    }
  }

  async consultOracle(card) {
    const btn = document.getElementById("loteria-consult-oracle");
    const responseBox = document.getElementById("loteria-oracle-response");
    if (!btn || !responseBox) return;

    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Consultando el espíritu de Elena...</span>`;
    responseBox.classList.remove("hidden");
    responseBox.innerHTML = `<em>El humo del copal se agita... Elena contempla la carta de ${card.name}...</em>`;

    try {
      const res = await fetch("/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: card.prompt, offline_mode: false })
      });
      const data = await res.json();
      const reply = data.response || data.reply || "El amor que sembramos en la tierra nunca muere.";
      responseBox.innerHTML = `
        <div style="font-family: var(--font-serif); font-size: 0.96rem; color: #fef08a; line-height: 1.6; border-left: 3px solid ${card.color}; padding-left: 12px; margin-top: 8px;">
          <strong>Abuela Elena susurra:</strong><br>
          "${reply}"
        </div>
      `;
      if (window.soundFx) window.soundFx.sacredChime();
    } catch (err) {
      responseBox.innerHTML = `<span style="color: #fca5a5;">No se pudo conectar con el oráculo. (${err.message})</span>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span>🔮 Pedir Consejo a Abuela Elena</span>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.loteriaEngine = new LoteriaEngine();
});
