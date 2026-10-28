/**
 * vigil.js - "Vigilia Sagrada" (Cinematic Night Vigil Mode)
 * Recreates the atmosphere of a midnight candlelit cemetery in Janitzio or Oaxaca.
 * Features dynamic volumetric lantern lighting that smoothly tracks the user's cursor,
 * ambient candle light cutouts, and nocturnal soundscapes.
 */
class VigilMode {
  constructor() {
    this.active = false;
    this.canvas = null;
    this.ctx = null;
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;
    this.animId = null;

    this.init();
  }

  init() {
    this.toggleBtn = document.getElementById("vigil-toggle-btn");
    if (!this.toggleBtn) return;

    this.createCanvas();
    this.bindEvents();
  }

  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "vigil-lighting-canvas";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100vw";
    this.canvas.style.height = "100vh";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "990";
    this.canvas.style.opacity = "0";
    this.canvas.style.transition = "opacity 0.8s ease-in-out";
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());

    window.addEventListener("mousemove", (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });

    this.toggleBtn.addEventListener("click", () => {
      this.toggle();
    });
  }

  toggle() {
    this.active = !this.active;
    if (window.soundFx) window.soundFx.sacredChime();

    if (this.active) {
      document.body.classList.add("vigil-mode-active");
      this.canvas.style.opacity = "1";
      this.toggleBtn.innerHTML = `<span>☀️ Salir de Vigilia</span>`;
      this.toggleBtn.classList.add("active");

      // Auto-trigger mixer to Vigil preset if mixer exists
      if (window.soundMixer && !window.soundMixer.isPlaying) {
        window.soundMixer.start();
        window.soundMixer.applyPreset("vigil");
      }

      this.startLoop();
    } else {
      document.body.classList.remove("vigil-mode-active");
      this.canvas.style.opacity = "0";
      this.toggleBtn.innerHTML = `<span>🕯️ Entrar en Vigilia (Noche)</span>`;
      this.toggleBtn.classList.remove("active");

      this.stopLoop();
    }
  }

  startLoop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const render = () => {
      if (!this.active) return;
      this.draw();
      this.animId = requestAnimationFrame(render);
    };
    this.animId = requestAnimationFrame(render);
  }

  stopLoop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Smooth cursor interpolation (lerp)
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.15;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.15;

    // Clear and fill with midnight darkness
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = "rgba(4, 2, 8, 0.94)";
    this.ctx.fillRect(0, 0, w, h);

    // Punch out lights with destination-out
    this.ctx.globalCompositeOperation = "destination-out";

    // 1. Lantern spotlight following cursor
    const flicker = 1.0 + Math.sin(Date.now() * 0.008) * 0.05 + (Math.random() - 0.5) * 0.03;
    const lanternRadius = 260 * flicker;
    const lanternGrad = this.ctx.createRadialGradient(
      this.mouseX, this.mouseY, 15,
      this.mouseX, this.mouseY, lanternRadius
    );
    lanternGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
    lanternGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.75)");
    lanternGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    this.ctx.fillStyle = lanternGrad;
    this.ctx.beginPath();
    this.ctx.arc(this.mouseX, this.mouseY, lanternRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Light cutouts for candles currently on screen
    const candles = document.querySelectorAll(".candle-unit:not(.unlit)");
    candles.forEach((candle) => {
      const rect = candle.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= h && rect.right >= 0 && rect.left <= w) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + 30; // candle flame tip
        const candleFlicker = 1.0 + Math.sin(Date.now() * 0.012 + cx) * 0.08;
        const cRadius = 140 * candleFlicker;

        const cGrad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, cRadius);
        cGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
        cGrad.addColorStop(0.6, "rgba(0, 0, 0, 0.6)");
        cGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        this.ctx.fillStyle = cGrad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, cRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // 3. Add warm golden ambient aura back with source-over
    this.ctx.globalCompositeOperation = "source-over";
    const warmGrad = this.ctx.createRadialGradient(
      this.mouseX, this.mouseY, 0,
      this.mouseX, this.mouseY, lanternRadius * 0.7
    );
    warmGrad.addColorStop(0, "rgba(245, 158, 11, 0.12)");
    warmGrad.addColorStop(0.8, "rgba(217, 119, 6, 0.04)");
    warmGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    this.ctx.fillStyle = warmGrad;
    this.ctx.beginPath();
    this.ctx.arc(this.mouseX, this.mouseY, lanternRadius * 0.7, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.vigilMode = new VigilMode();
});
