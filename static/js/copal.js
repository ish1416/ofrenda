/**
 * copal.js - Interactive Copal Incense Smoke Physics
 * Simulates aromatic copal resin smoke rising from a traditional clay sahumerio.
 * Allows users to fan the smoke with mouse gestures to purify the ancestors' portraits.
 */
class CopalSmokeEngine {
  constructor() {
    this.canvas = document.getElementById("copal-smoke-canvas");
    this.burner = document.getElementById("sahumerio-burner");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.maxParticles = 65;
    this.mouseX = -100;
    this.mouseY = -100;
    this.prevMouseX = -100;
    this.prevMouseY = -100;
    this.mouseVelX = 0;
    this.mouseVelY = 0;
    this.animId = null;

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
    this.canvas.width = rect.width || 320;
    this.canvas.height = rect.height || 260;
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;

      if (this.prevMouseX > 0) {
        this.mouseVelX = curX - this.prevMouseX;
        this.mouseVelY = curY - this.prevMouseY;
      }
      this.mouseX = curX;
      this.mouseY = curY;
      this.prevMouseX = curX;
      this.prevMouseY = curY;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouseX = -100;
      this.mouseY = -100;
      this.mouseVelX = 0;
      this.mouseVelY = 0;
    });

    if (this.burner) {
      this.burner.addEventListener("click", () => this.burstSmoke());
    }
  }

  burstSmoke() {
    if (window.soundFx) window.soundFx.copalPuff();

    // Spawn 25 energetic smoke puffs
    for (let i = 0; i < 25; i++) {
      this.spawnParticle(true);
    }

    // Sacred purification aura feedback
    const toast = document.getElementById("purification-toast");
    if (toast) {
      toast.classList.remove("hidden");
      toast.classList.add("fade-in");
      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3500);
    }
  }

  spawnParticle(isBurst = false) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const originX = w / 2;
    const originY = h - 35; // emerging from burner top

    this.particles.push({
      x: originX + (Math.random() - 0.5) * 16,
      y: originY + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * (isBurst ? 1.6 : 0.6),
      vy: isBurst ? -(Math.random() * 2.5 + 1.2) : -(Math.random() * 1.2 + 0.6),
      size: Math.random() * 12 + 8,
      maxSize: Math.random() * 45 + 30,
      opacity: Math.random() * 0.4 + 0.3,
      life: 0,
      maxLife: Math.random() * 120 + 80,
      curlSpeed: (Math.random() - 0.5) * 0.05
    });
  }

  startLoop() {
    const update = () => {
      this.render();
      this.animId = requestAnimationFrame(update);
    };
    this.animId = requestAnimationFrame(update);
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.clearRect(0, 0, w, h);

    // Continuous soft emission
    if (this.particles.length < this.maxParticles && Math.random() < 0.6) {
      this.spawnParticle(false);
    }

    // Update and draw each smoke particle
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;

      // Natural upward buoyancy + swirling curl
      p.vy -= 0.008;
      p.vx += Math.sin(p.life * 0.04) * 0.06 + p.curlSpeed;

      // Mouse fanning reaction
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 70) {
        const force = (1 - dist / 70) * 1.8;
        p.vx += (this.mouseVelX * 0.08 + (dx / dist) * 1.2) * force;
        p.vy += (this.mouseVelY * 0.08 + (dy / dist) * 1.2) * force;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Grow and fade
      const progress = p.life / p.maxLife;
      const curSize = p.size + (p.maxSize - p.size) * progress;
      const curOpacity = p.opacity * (1 - progress);

      if (progress >= 1 || p.y < -50) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw smoke puff
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, curSize);
      grad.addColorStop(0, `rgba(226, 232, 240, ${curOpacity * 0.7})`);
      grad.addColorStop(0.5, `rgba(203, 213, 225, ${curOpacity * 0.35})`);
      grad.addColorStop(1, "rgba(203, 213, 225, 0)");

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, curSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.copalEngine = new CopalSmokeEngine();
});
