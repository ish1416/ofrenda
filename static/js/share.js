/**
 * share.js - High-Resolution Altar Poster Generator & Virality Engine
 * Generates an exquisite commemorative Día de los Muertos poster on HTML5 Canvas
 * combining the user's painted calavera, lit candles, ancestor tribute, and 
 * provides 1-click social sharing to Twitter/X, LinkedIn, and DEV.
 */
class AltarShareEngine {
  constructor() {
    this.modal = document.getElementById("share-poster-modal");
    this.openBtn = document.getElementById("btn-open-share-modal");
    this.canvas = document.getElementById("share-poster-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.downloadBtn = document.getElementById("btn-download-poster");
    this.shareTwitterBtn = document.getElementById("btn-share-twitter");
    this.shareLinkedInBtn = document.getElementById("btn-share-linkedin");
    this.copyLinkBtn = document.getElementById("btn-copy-share-link");

    this.init();
  }

  init() {
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    }

    const closeBtn = document.getElementById("share-modal-close");
    if (closeBtn && this.modal) {
      closeBtn.addEventListener("click", () => this.modal.classList.remove("open"));
    }

    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.modal.classList.remove("open");
      });
    }

    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.downloadPNG());
    }

    if (this.shareTwitterBtn) {
      this.shareTwitterBtn.addEventListener("click", () => this.shareTwitter());
    }

    if (this.shareLinkedInBtn) {
      this.shareLinkedInBtn.addEventListener("click", () => this.shareLinkedIn());
    }

    if (this.copyLinkBtn) {
      this.copyLinkBtn.addEventListener("click", () => this.copyLink());
    }
  }

  open() {
    if (!this.modal || !this.canvas || !this.ctx) return;
    if (window.soundFx) window.soundFx.sacredChime();

    this.modal.classList.add("open");
    this.renderPoster();
  }

  renderPoster() {
    const w = 1200;
    const h = 800;
    this.canvas.width = w;
    this.canvas.height = h;

    const ctx = this.ctx;

    // Background: Deep obsidian velvet gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, "#0c0a09");
    bgGrad.addColorStop(0.5, "#180c05");
    bgGrad.addColorStop(1, "#09090b");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative golden filigree border
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, w - 84, h - 84);

    // Corner decorative rosettes
    const drawRosette = (x, y) => {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.stroke();
    };

    drawRosette(30, 30);
    drawRosette(w - 30, 30);
    drawRosette(30, h - 30);
    drawRosette(w - 30, h - 30);

    // Header Title
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("OFRENDA • DÍA DE LOS MUERTOS", w / 2, 105);

    ctx.fillStyle = "#fde047";
    ctx.font = "600 18px Inter, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("ALTAR COMUNITARIO DIGITAL & BÓVEDA DE HISTORIA ORAL CON GEMMA 2", w / 2, 140);

    // Horizontal divider
    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 165);
    ctx.lineTo(w - 150, 165);
    ctx.stroke();

    // Center Left: Sugar Skull or Elena Portrait
    const skullCanvas = document.getElementById("skull-paint-canvas");
    if (skullCanvas) {
      // Draw decorated calavera with decorative golden frame
      ctx.save();
      ctx.fillStyle = "#1c1917";
      ctx.shadowColor = "rgba(245, 158, 11, 0.5)";
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.roundRect(140, 210, 340, 340, 20);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.drawImage(skullCanvas, 140, 210, 340, 340);

      ctx.fillStyle = "#fef08a";
      ctx.font = "italic 16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Calaverita de Azúcar consagrada en el altar", 310, 580);
    }

    // Center Right: Sacred Legacy Text
    ctx.textAlign = "left";
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 26px 'Playfair Display', Georgia, serif";
    ctx.fillText("En Memoria Eterna de Elena Ramírez Solís", 540, 250);

    ctx.fillStyle = "#d6d3d1";
    ctx.font = "500 17px Inter, sans-serif";
    ctx.fillText("1938 – 2021 • Oaxaca & Coyoacán, México", 540, 285);

    // Epitaph / Wisdom Quote
    ctx.fillStyle = "#fef08a";
    ctx.font = "italic 20px 'Playfair Display', Georgia, serif";
    const quoteLines = [
      '"Nadie muere mientras su nombre sea pronunciado en la mesa,',
      'mientras el mole conserve su canela y sus semillas tostadas,',
      'y mientras las canciones de cuna sigan arrullando a los hijos."'
    ];
    quoteLines.forEach((line, i) => {
      ctx.fillText(line, 540, 345 + i * 32);
    });

    // Offerings & Candles Status
    const litCount = document.querySelectorAll(".candle-unit:not(.unlit)").length;
    ctx.fillStyle = "#fbbf24";
    ctx.font = "600 18px Inter, sans-serif";
    ctx.fillText(`🕯️ ${litCount} Veladoras Sagradas Encendidas para Guiar el Camino`, 540, 480);
    ctx.fillText(`🍞 Pan de Muerto, Cempasúchil & Resina de Copal Ofrendados`, 540, 512);
    ctx.fillText(`📼 Cinta de Cassette TDK C-60 (1975): 'Canciones y Coyoacán' Preservada`, 540, 544);

    // Footer Hacktoberfest & Open-Source Badge
    ctx.fillStyle = "rgba(24, 24, 27, 0.9)";
    ctx.beginPath();
    ctx.roundRect(80, 670, w - 160, 70, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 17px Inter, sans-serif";
    ctx.fillText("✨ HACKTOBERFEST 2026: GHOST IN THE MACHINE • DEV CHALLENGE", w / 2, 700);

    ctx.fillStyle = "#a1a1aa";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("100% Offline Air-Gapped Open-Source AI • Google Gemma 2 2B Instruct • https://github.com/ish1416/ofrenda", w / 2, 724);
  }

  downloadPNG() {
    if (!this.canvas) return;
    const link = document.createElement("a");
    link.download = `Ofrenda_Digital_Elena_2026.png`;
    link.href = this.canvas.toDataURL("image/png");
    link.click();
    if (window.soundFx) window.soundFx.sacredChime();
  }

  shareTwitter() {
    const text = encodeURIComponent(
      "He consagrado un recuerdo sagrado en Ofrenda: Altar Digital & Bóveda de Historia Oral impulsado por Gemma 2 open-source AI de forma 100% local y air-gapped para #Hacktoberfest2026 💀🕯️🌼\n\nNuestros ancestros no pertenecen a una API en la nube.\n\nCódigo abierto: https://github.com/ish1416/ofrenda"
    );
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
  }

  shareLinkedIn() {
    const url = encodeURIComponent("https://github.com/ish1416/ofrenda");
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, "_blank");
  }

  copyLink() {
    const text = "https://github.com/ish1416/ofrenda";
    navigator.clipboard.writeText(text).then(() => {
      if (this.copyLinkBtn) {
        const orig = this.copyLinkBtn.textContent;
        this.copyLinkBtn.textContent = "✓ ¡Enlace Copiado!";
        setTimeout(() => {
          this.copyLinkBtn.textContent = orig;
        }, 2500);
      }
      if (window.soundFx) window.soundFx.sacredChime();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.altarShareEngine = new AltarShareEngine();
});
