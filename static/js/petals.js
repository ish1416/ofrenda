// Interactive Cempasúchil (Marigold) Petal Particle Canvas with Cursor Fluid Physics
(function() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Click to burst petals
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
      const p = new Petal();
      p.x = e.clientX + (Math.random() - 0.5) * 20;
      p.y = e.clientY + (Math.random() - 0.5) * 20;
      p.speedX = (Math.random() - 0.5) * 4;
      p.speedY = -Math.random() * 3 - 1; // initial upward pop
      petals.push(p);
    }
  });

  const PETAL_COUNT = 45;
  const petals = [];

  const COLORS = [
    '#f59e0b', // Marigold gold
    '#ea580c', // Deep cempasúchil orange
    '#fbbf24', // Candle amber
    '#d97706', // Warm ochre
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.9 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = Math.random() * 0.5 + 0.3;
      this.oscillation = Math.random() * 100;
    }

    update() {
      this.y += this.speedY;
      this.oscillation += 0.02;
      this.x += this.speedX + Math.sin(this.oscillation) * 0.5;
      this.rotation += this.rotSpeed;

      // Cursor air currents repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        const force = (110 - dist) / 110;
        this.x += (dx / dist) * force * 4.5;
        this.y += (dy / dist) * force * 3;
        this.rotation += 0.08;
      }

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        if (petals.length > PETAL_COUNT) {
          const idx = petals.indexOf(this);
          if (idx !== -1) petals.splice(idx, 1);
        } else {
          this.reset();
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;

      // Draw stylized marigold petal
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let p of petals) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(loop);
  }

  loop();

  window.burstPetalsAt = function(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const p = new Petal();
      p.x = x + (Math.random() - 0.5) * 30;
      p.y = y + (Math.random() - 0.5) * 30;
      p.speedX = (Math.random() - 0.5) * 5;
      p.speedY = -Math.random() * 4 - 1.5;
      petals.push(p);
    }
  };
})();
