// Tactile Drag-and-Strike Wooden Matchstick Physics Engine
// Synthesizes sparks, realistic ignition friction, and dragging flame to ignite candles
(function() {
  class MatchEngine {
    constructor() {
      this.isDragging = false;
      this.isLit = false;
      this.matchX = 0;
      this.matchY = 0;
      this.lastX = 0;
      this.lastY = 0;
      this.burnTime = 0;
      this.burnDuration = 14000; // 14 seconds before burning down
      this.flameCanvas = null;
      this.flameCtx = null;
      this.sparks = [];
      this.matchEl = null;
      this.matchboxEl = null;
      this.frictionStripEl = null;

      this.init();
    }

    init() {
      // Create match overlay container
      const container = document.createElement('div');
      container.id = 'match-physics-container';
      container.style.position = 'fixed';
      container.style.inset = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '999';
      document.body.appendChild(container);

      // Create canvas for flame and sparks
      this.flameCanvas = document.createElement('canvas');
      this.flameCanvas.width = window.innerWidth;
      this.flameCanvas.height = window.innerHeight;
      this.flameCanvas.style.position = 'absolute';
      this.flameCanvas.style.top = '0';
      this.flameCanvas.style.left = '0';
      this.flameCanvas.style.pointerEvents = 'none';
      container.appendChild(this.flameCanvas);
      this.flameCtx = this.flameCanvas.getContext('2d');

      window.addEventListener('resize', () => {
        this.flameCanvas.width = window.innerWidth;
        this.flameCanvas.height = window.innerHeight;
      });

      // Create Match Element (follows cursor when active)
      this.matchEl = document.createElement('div');
      this.matchEl.id = 'active-matchstick';
      this.matchEl.className = 'matchstick-cursor';
      this.matchEl.style.display = 'none';
      container.appendChild(this.matchEl);

      // Listen for global mouse events
      window.addEventListener('mousemove', (e) => this.onMouseMove(e));
      window.addEventListener('mouseup', () => this.onMouseUp());

      this.animate();
    }

    bindMatchbox(matchboxEl, frictionStripEl) {
      this.matchboxEl = matchboxEl;
      this.frictionStripEl = frictionStripEl;

      if (!frictionStripEl) return;

      frictionStripEl.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.startDrag(e.clientX, e.clientY);
      });

      frictionStripEl.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          this.startDrag(t.clientX, t.clientY);
        }
      }, { passive: true });
    }

    startDrag(x, y) {
      this.isDragging = true;
      this.isLit = false;
      this.burnTime = 0;
      this.matchX = x;
      this.matchY = y;
      this.lastX = x;
      this.lastY = y;

      this.matchEl.style.display = 'block';
      this.matchEl.classList.remove('lit', 'spent');
      this.updateMatchPos(x, y);
    }

    onMouseMove(e) {
      if (!this.isDragging) return;

      const currentX = e.clientX;
      const currentY = e.clientY;
      const dx = currentX - this.lastX;
      const dy = currentY - this.lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      this.matchX = currentX;
      this.matchY = currentY;
      this.updateMatchPos(currentX, currentY);

      // Check if rubbing against friction strip
      if (!this.isLit && this.frictionStripEl) {
        const rect = this.frictionStripEl.getBoundingClientRect();
        const onStrip = (
          currentX >= rect.left && currentX <= rect.right &&
          currentY >= rect.top && currentY <= rect.bottom
        );

        if (onStrip) {
          // Emit friction sparks
          this.emitSparks(currentX, currentY, Math.min(speed, 8));

          // If struck with enough velocity (> 9px/frame), IGNITE!
          if (speed > 8) {
            this.ignite();
          }
        }
      }

      // If lit, check collision with unlit candles
      if (this.isLit) {
        this.checkCandleCollisions(currentX, currentY);
      }

      this.lastX = currentX;
      this.lastY = currentY;
    }

    onMouseUp() {
      if (!this.isDragging) return;
      this.isDragging = false;

      // If dropped while lit, let it burn out gently
      if (this.isLit) {
        setTimeout(() => {
          this.extinguish();
        }, 3000);
      } else {
        this.matchEl.style.display = 'none';
      }
    }

    ignite() {
      if (this.isLit) return;
      this.isLit = true;
      this.burnTime = Date.now();
      this.matchEl.classList.add('lit');

      // Play authentic match strike audio
      if (window.altarAudio) {
        window.altarAudio.playMatchStrike();
      }

      // Big initial ignition spark burst
      this.emitSparks(this.matchX, this.matchY - 25, 25);
    }

    extinguish() {
      this.isLit = false;
      this.matchEl.classList.remove('lit');
      this.matchEl.classList.add('spent');

      // Smoke puff on burn out
      this.emitSmoke(this.matchX, this.matchY - 20, 15);

      setTimeout(() => {
        this.matchEl.style.display = 'none';
      }, 1000);
    }

    updateMatchPos(x, y) {
      this.matchEl.style.transform = `translate(${x - 8}px, ${y - 45}px) rotate(22deg)`;
    }

    emitSparks(x, y, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        this.sparks.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          color: Math.random() > 0.3 ? '#f59e0b' : '#fef08a',
          size: Math.random() * 2.5 + 1.2,
          life: 1.0,
          decay: Math.random() * 0.04 + 0.03,
          isSmoke: false
        });
      }
    }

    emitSmoke(x, y, count) {
      for (let i = 0; i < count; i++) {
        this.sparks.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.5 + 0.5),
          color: 'rgba(214, 211, 209, 0.6)',
          size: Math.random() * 8 + 4,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.015,
          isSmoke: true
        });
      }
    }

    checkCandleCollisions(x, y) {
      const candles = document.querySelectorAll('.candle-unit.unlit');
      candles.forEach(c => {
        const rect = c.getBoundingClientRect();
        // Flame tip target zone (top 35px of candle)
        const inZone = (
          x >= rect.left - 10 && x <= rect.right + 10 &&
          y >= rect.top - 20 && y <= rect.top + 45
        );
        if (inZone) {
          c.click(); // Trigger native toggle / light action
          this.emitSparks(x, y, 14);
        }
      });
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      this.flameCtx.clearRect(0, 0, this.flameCanvas.width, this.flameCanvas.height);

      // Animate active flame if lit
      if (this.isLit && this.isDragging) {
        this.drawFlame(this.matchX, this.matchY - 32);

        // Auto extinguish when burn duration reached
        if (Date.now() - this.burnTime > this.burnDuration) {
          this.extinguish();
        }
      }

      // Update and draw sparks / smoke
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        if (s.isSmoke) {
          s.size += 0.2;
          s.vx += Math.sin(s.y * 0.05) * 0.05;
        }

        if (s.life <= 0) {
          this.sparks.splice(i, 1);
          continue;
        }

        this.flameCtx.save();
        if (s.isSmoke) {
          this.flameCtx.fillStyle = `rgba(214, 211, 209, ${s.life * 0.35})`;
          this.flameCtx.beginPath();
          this.flameCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          this.flameCtx.fill();
        } else {
          this.flameCtx.fillStyle = s.color;
          this.flameCtx.globalAlpha = s.life;
          this.flameCtx.shadowColor = '#f59e0b';
          this.flameCtx.shadowBlur = 6;
          this.flameCtx.beginPath();
          this.flameCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          this.flameCtx.fill();
        }
        this.flameCtx.restore();
      }
    }

    drawFlame(x, y) {
      const t = Date.now() * 0.006;
      const wobble = Math.sin(t) * 2;
      const heightWobble = Math.cos(t * 1.5) * 3;

      this.flameCtx.save();
      // Outer amber aura
      const grad = this.flameCtx.createRadialGradient(x, y, 2, x, y, 26);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.7)');
      grad.addColorStop(0.7, 'rgba(234, 88, 12, 0.4)');
      grad.addColorStop(1, 'rgba(234, 88, 12, 0)');

      this.flameCtx.fillStyle = grad;
      this.flameCtx.beginPath();
      this.flameCtx.arc(x, y, 26, 0, Math.PI * 2);
      this.flameCtx.fill();

      // Flame tear-drop body
      this.flameCtx.fillStyle = '#fef08a';
      this.flameCtx.beginPath();
      this.flameCtx.moveTo(x - 5, y + 6);
      this.flameCtx.quadraticCurveTo(x - 8 + wobble, y - 8, x + wobble * 0.8, y - 22 + heightWobble);
      this.flameCtx.quadraticCurveTo(x + 8 + wobble, y - 8, x + 5, y + 6);
      this.flameCtx.closePath();
      this.flameCtx.fill();

      // Blue flame root
      this.flameCtx.fillStyle = 'rgba(56, 189, 248, 0.75)';
      this.flameCtx.beginPath();
      this.flameCtx.arc(x, y + 5, 4, 0, Math.PI * 2);
      this.flameCtx.fill();

      this.flameCtx.restore();
    }
  }

  window.matchEngine = new MatchEngine();
})();
