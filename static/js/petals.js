// Interactive Cempasúchil (Marigold) Petal Particle Canvas
(function() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const PETAL_COUNT = 38;
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
      this.speedY = Math.random() * 0.9 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = Math.random() * 0.45 + 0.25;
      this.oscillation = Math.random() * 100;
    }

    update() {
      this.y += this.speedY;
      this.oscillation += 0.02;
      this.x += this.speedX + Math.sin(this.oscillation) * 0.5;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;

      // Draw stylized marigold petal (tear/ellipse)
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
})();
