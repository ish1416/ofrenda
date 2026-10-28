// Interactive Copal Smoke & Spiritual Embers Particle Simulation
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'smoke-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2';
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 1.2s ease-in-out';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const PARTICLE_COUNT = 55;

  class SmokeParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = width * 0.5 + (Math.random() - 0.5) * 160;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 24 + 15;
      this.speedY = -(Math.random() * 0.8 + 0.4);
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.growth = Math.random() * 0.12 + 0.05;
      this.opacity = Math.random() * 0.25 + 0.1;
      this.maxOpacity = this.opacity;
      this.isEmber = Math.random() > 0.65;
      this.emberColor = Math.random() > 0.5 ? '#f59e0b' : '#ea580c';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.4;
      this.size += this.growth;

      // Fade out as it ascends
      if (this.y < height * 0.3) {
        this.opacity -= 0.003;
      }

      if (this.y < -50 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      if (this.isEmber) {
        ctx.fillStyle = this.emberColor;
        ctx.globalAlpha = this.opacity * 2;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.min(this.size * 0.15, 3.5), 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Copal smoke puff
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(240, 230, 215, ${this.opacity})`);
        grad.addColorStop(0.5, `rgba(200, 190, 175, ${this.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(150, 140, 130, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new SmokeParticle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(loop);
  }

  loop();

  window.toggleSeanceSmoke = function(active) {
    canvas.style.opacity = active ? '1' : '0';
  };
})();
