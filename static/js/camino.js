/**
 * camino.js - Camino de Cempasúchil: Interactive Sacred Petal Pathway & Spirit Footprints
 * In Mexican tradition, scattering golden cempasúchil petals guides the spirits (ánimas)
 * from Mictlán directly to the altar.
 * Features:
 * - Fluid petal scatter physics with 3D gradient shading & rotation
 * - Cursor pollen sparkle trails
 * - 1-Click "Sembrar Camino Sagrado" automated organic path generation
 * - "Invocar Huellas de las Ánimas" ethereal golden footsteps animation
 * - Zero external dependencies, pure HTML5 Canvas & Web Audio
 */

class CaminoEngine {
  constructor() {
    this.canvas = document.getElementById("camino-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.petals = [];
    this.pollen = [];
    this.footprints = [];
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this.petalCountEl = document.getElementById("camino-petal-count");
    this.blessingBanner = document.getElementById("camino-blessing");
    this.animatingSteps = false;

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 1100;
    this.canvas.height = rect.height || 180;
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.redraw();
    });

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const addPetalAt = (x, y) => {
      this.spawnPetal(x, y);
      if (Math.random() < 0.3 && window.soundFx) {
        window.soundFx.petalScatter();
      }
    };

    this.canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      const pos = getPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
      addPetalAt(pos.x, pos.y);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const pos = getPos(e);
      // Spawn tiny pollen on hover
      if (Math.random() < 0.25) {
        this.spawnPollen(pos.x, pos.y);
      }
      if (!this.isDragging) return;
      const dist = Math.hypot(pos.x - this.lastX, pos.y - this.lastY);
      if (dist > 14) {
        const steps = Math.min(5, Math.floor(dist / 14));
        for (let i = 1; i <= steps; i++) {
          const interpX = this.lastX + (pos.x - this.lastX) * (i / steps);
          const interpY = this.lastY + (pos.y - this.lastY) * (i / steps);
          addPetalAt(interpX + (Math.random() - 0.5) * 16, interpY + (Math.random() - 0.5) * 16);
        }
        this.lastX = pos.x;
        this.lastY = pos.y;
      }
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    // Touch support
    this.canvas.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      const pos = getPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
      addPetalAt(pos.x, pos.y);
    }, { passive: true });

    this.canvas.addEventListener("touchmove", (e) => {
      if (!this.isDragging) return;
      const pos = getPos(e);
      addPetalAt(pos.x, pos.y);
    }, { passive: true });

    this.canvas.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    // Control buttons
    const sowBtn = document.getElementById("btn-sow-camino");
    if (sowBtn) {
      sowBtn.addEventListener("click", () => this.sowSacredPath());
    }

    const spiritBtn = document.getElementById("btn-spirit-steps");
    if (spiritBtn) {
      spiritBtn.addEventListener("click", () => this.manifestSpiritSteps());
    }

    const clearBtn = document.getElementById("btn-clear-camino");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearPath());
    }
  }

  spawnPetal(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const length = 9 + Math.random() * 8;
    const width = 4.5 + Math.random() * 3.5;
    const colors = [
      { start: "#fbbf24", mid: "#f59e0b", end: "#d97706" }, // Golden marigold
      { start: "#fef08a", mid: "#facc15", end: "#ea580c" }, // Sunburst yellow
      { start: "#f97316", mid: "#ea580c", end: "#c2410c" }  // Deep saffron orange
    ];
    const palette = colors[Math.floor(Math.random() * colors.length)];

    this.petals.push({
      x,
      y,
      angle,
      length,
      width,
      palette,
      curl: (Math.random() - 0.5) * 0.3,
      alpha: 1.0,
      glow: Math.random() < 0.2
    });

    this.updateCounter();

    // Spawn 2 golden pollen grains
    this.spawnPollen(x, y);
    this.spawnPollen(x, y);
  }

  spawnPollen(x, y) {
    this.pollen.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 0.8 + 0.3),
      size: Math.random() * 2 + 1,
      alpha: 1.0,
      decay: Math.random() * 0.02 + 0.015
    });
  }

  sowSacredPath() {
    if (window.soundFx) window.soundFx.sacredChime();
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Generate an undulating S-curve path of petals from bottom edge toward center
    const count = 90;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = w * 0.15 + (w * 0.7) * t + Math.sin(t * Math.PI * 3) * 60;
      const y = h * 0.85 - (h * 0.7) * t + (Math.random() - 0.5) * 35;
      this.spawnPetal(x + (Math.random() - 0.5) * 40, y);
    }
  }

  async manifestSpiritSteps() {
    if (this.animatingSteps) return;
    this.animatingSteps = true;

    const spiritBtn = document.getElementById("btn-spirit-steps");
    if (spiritBtn) spiritBtn.disabled = true;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const numSteps = 7;

    for (let i = 0; i < numSteps; i++) {
      const t = i / (numSteps - 1);
      const isLeft = i % 2 === 0;
      const baseX = w * 0.18 + (w * 0.64) * t + Math.sin(t * Math.PI * 2.5) * 40;
      const baseY = h * 0.82 - (h * 0.65) * t;
      const offsetX = isLeft ? -16 : 16;

      this.footprints.push({
        x: baseX + offsetX,
        y: baseY,
        angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.2,
        isLeft,
        alpha: 0.0,
        maxAlpha: 0.85,
        fadeSpeed: 0.04
      });

      if (window.soundFx) window.soundFx.spiritStep();

      // Spawn puff of golden pollen
      for (let p = 0; p < 8; p++) {
        this.spawnPollen(baseX + offsetX, baseY);
      }

      await new Promise(r => setTimeout(r, 650));
    }

    // Grand finale: sacred chime & altar portrait glow
    if (window.soundFx) window.soundFx.sacredChime();
    const portrait = document.getElementById("ancestor-portrait");
    if (portrait) {
      portrait.classList.add("spirit-arrived-pulse");
      setTimeout(() => portrait.classList.remove("spirit-arrived-pulse"), 3500);
    }

    if (spiritBtn) spiritBtn.disabled = false;
    this.animatingSteps = false;
  }

  clearPath() {
    if (window.soundFx) window.soundFx.clickWood();
    this.petals = [];
    this.footprints = [];
    this.pollen = [];
    this.updateCounter();
  }

  updateCounter() {
    if (this.petalCountEl) {
      this.petalCountEl.textContent = this.petals.length;
    }
    if (this.blessingBanner) {
      if (this.petals.length >= 35) {
        this.blessingBanner.classList.remove("hidden");
      } else {
        this.blessingBanner.classList.add("hidden");
      }
    }
  }

  startLoop() {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw subtle earthen stone flagstone texture
    ctx.fillStyle = "rgba(18, 12, 9, 0.4)";
    ctx.fillRect(0, 0, w, h);

    // 2. Draw spirit footprints
    this.footprints.forEach(f => {
      if (f.alpha < f.maxAlpha) {
        f.alpha += f.fadeSpeed;
      }
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.globalAlpha = Math.min(1.0, f.alpha);

      // Golden spirit sole glow
      const glowGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
      glowGrad.addColorStop(0, "rgba(251, 191, 36, 0.65)");
      glowGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.3)");
      glowGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Footprint silhouette (soft golden imprint)
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.ellipse(0, 4, 7, 12, 0, 0, Math.PI * 2); // Heel & arch
      ctx.ellipse(0, -9, 8, 7, 0, 0, Math.PI * 2); // Ball of foot
      ctx.fill();

      ctx.restore();
    });

    // 3. Draw Cempasúchil petals
    this.petals.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Subtle shadow under petal
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.beginPath();
      ctx.ellipse(1.5, 2, p.width, p.length, p.curl, 0, Math.PI * 2);
      ctx.fill();

      // Petal body with rich marigold gradient
      const grad = ctx.createLinearGradient(0, -p.length, 0, p.length);
      grad.addColorStop(0, p.palette.start);
      grad.addColorStop(0.45, p.palette.mid);
      grad.addColorStop(1, p.palette.end);

      ctx.fillStyle = grad;
      ctx.beginPath();
      // Curved organic petal shape (pointed tip, rounded base)
      ctx.moveTo(0, -p.length);
      ctx.bezierCurveTo(p.width, -p.length * 0.4, p.width * 0.9, p.length * 0.5, 0, p.length);
      ctx.bezierCurveTo(-p.width * 0.9, p.length * 0.5, -p.width, -p.length * 0.4, 0, -p.length);
      ctx.closePath();
      ctx.fill();

      // Center vein
      ctx.strokeStyle = "rgba(217, 119, 6, 0.45)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -p.length * 0.7);
      ctx.lineTo(0, p.length * 0.6);
      ctx.stroke();

      if (p.glow) {
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 6;
      }

      ctx.restore();
    });

    // 4. Update and draw floating pollen grains
    for (let i = this.pollen.length - 1; i >= 0; i--) {
      const pol = this.pollen[i];
      pol.x += pol.vx;
      pol.y += pol.vy;
      pol.alpha -= pol.decay;

      if (pol.alpha <= 0) {
        this.pollen.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `rgba(254, 240, 138, ${pol.alpha})`;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(pol.x, pol.y, pol.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  redraw() {
    this.render();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.caminoEngine = new CaminoEngine();
});
