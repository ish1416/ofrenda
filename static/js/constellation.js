// 3D Celestial Constellation of Souls (El Cielo de las Ánimas)
// 3D perspective particle sphere where departed souls shine as eternal golden stars
(function() {
  class CelestialConstellation {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width = 640;
      this.height = this.canvas.height = 340;

      this.rotX = 0.2;
      this.rotY = 0;
      this.targetRotX = 0.2;
      this.targetRotY = 0;
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
      this.fov = 300;
      this.hoveredStar = null;

      // Seed Ancestor Stars
      this.stars = [
        { name: 'Elena Ramirez Solis', years: '1938–2021', quote: 'Nadie levanta la voz donde hay pan calientito.', color: '#fbbf24', size: 6.5, theta: 0.2, phi: 0.4, r: 160, isElena: true },
        { name: 'Roberto Ramirez', years: '1957–2018', quote: 'Llegamos a Coyoacán en el autobús de segunda clase.', color: '#f59e0b', size: 4.5, theta: 0.8, phi: 0.7, r: 155 },
        { name: 'Carmen Solis de Oaxaca', years: '1912–1984', quote: 'Guardiana del metate y el mole negro ancestral.', color: '#ec4899', size: 4.8, theta: -0.6, phi: 0.3, r: 165 },
        { name: 'Manuel M. Ponce', years: '1882–1948', quote: 'Compositor de las canciones que tocaba en su guitarra.', color: '#38bdf8', size: 4.2, theta: 1.4, phi: -0.5, r: 150 },
        { name: 'José Guadalupe Posada', years: '1852–1913', quote: 'Creador inmortal de La Catrina y los grabados.', color: '#c084fc', size: 4.8, theta: -1.2, phi: -0.4, r: 160 },
        { name: 'Frida Kahlo', years: '1907–1954', quote: 'Vecina de Coyoacán, colores vivos contra la muerte.', color: '#10b981', size: 4.6, theta: 2.1, phi: 0.2, r: 158 },
        { name: 'Sor Juana Inés', years: '1648–1695', quote: 'Hombres necios que acusáis a la mujer sin razón.', color: '#f8fafc', size: 4.5, theta: -2.3, phi: 0.6, r: 162 }
      ];

      // Generate 75 background cosmos stars
      for (let i = 0; i < 75; i++) {
        this.stars.push({
          name: '',
          years: '',
          quote: '',
          color: Math.random() > 0.5 ? '#fef08a' : '#fed7aa',
          size: Math.random() * 2 + 1,
          theta: Math.random() * Math.PI * 2,
          phi: (Math.random() - 0.5) * Math.PI,
          r: Math.random() * 60 + 130,
          isBg: true
        });
      }

      this.init();
    }

    init() {
      // Mouse drag rotation
      this.canvas.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      });

      window.addEventListener('mousemove', (e) => {
        if (this.isDragging) {
          const dx = e.clientX - this.lastMouseX;
          const dy = e.clientY - this.lastMouseY;
          this.targetRotY += dx * 0.006;
          this.targetRotX += dy * 0.006;
          this.lastMouseX = e.clientX;
          this.lastMouseY = e.clientY;
        } else {
          this.checkHover(e);
        }
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      this.loop();
    }

    addStar(name, years, quote, color = '#fbbf24') {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * (Math.PI * 0.8);
      this.stars.unshift({
        name,
        years,
        quote,
        color,
        size: 5.5,
        theta,
        phi,
        r: 160,
        isNew: true,
        birthTime: Date.now()
      });
    }

    checkHover(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (this.width / rect.width);
      const my = (e.clientY - rect.top) * (this.height / rect.height);

      let found = null;
      for (let s of this.stars) {
        if (!s.name) continue;
        if (s.projX !== undefined && s.projY !== undefined && s.projZ > 0) {
          const d = Math.hypot(mx - s.projX, my - s.projY);
          if (d < 16) {
            found = s;
            break;
          }
        }
      }
      this.hoveredStar = found;
    }

    loop() {
      requestAnimationFrame(() => this.loop());

      // Auto gentle cosmic rotation when not dragging
      if (!this.isDragging) {
        this.targetRotY += 0.002;
      }

      // Smooth damping
      this.rotX += (this.targetRotX - this.rotX) * 0.1;
      this.rotY += (this.targetRotY - this.rotY) * 0.1;

      this.render();
    }

    render() {
      const cx = this.width / 2;
      const cy = this.height / 2;
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Deep celestial nebula gradient
      const bgGrad = this.ctx.createRadialGradient(cx, cy, 30, cx, cy, this.width * 0.6);
      bgGrad.addColorStop(0, 'rgba(30, 20, 45, 0.5)');
      bgGrad.addColorStop(0.5, 'rgba(15, 10, 25, 0.8)');
      bgGrad.addColorStop(1, 'rgba(5, 3, 8, 0.95)');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Project 3D points
      for (let s of this.stars) {
        // Spherical to 3D Cartesian
        const x0 = s.r * Math.cos(s.phi) * Math.sin(s.theta);
        const y0 = s.r * Math.sin(s.phi);
        const z0 = s.r * Math.cos(s.phi) * Math.cos(s.theta);

        // Rotate Y
        const cosY = Math.cos(this.rotY);
        const sinY = Math.sin(this.rotY);
        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;

        // Rotate X
        const cosX = Math.cos(this.rotX);
        const sinX = Math.sin(this.rotX);
        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        // 3D Perspective Projection
        const scale = this.fov / (this.fov + z2 + 200);
        s.projX = cx + x1 * scale;
        s.projY = cy + y2 * scale;
        s.projZ = z2;
        s.projScale = scale;
      }

      // Sort by Z for proper depth sorting
      const sorted = [...this.stars].sort((a, b) => b.projZ - a.projZ);

      // Draw constellation lines between named stars
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
      this.ctx.lineWidth = 1;
      const namedStars = sorted.filter(s => s.name);
      for (let i = 0; i < namedStars.length; i++) {
        for (let j = i + 1; j < namedStars.length; j++) {
          const s1 = namedStars[i];
          const s2 = namedStars[j];
          const dist = Math.hypot(s1.projX - s2.projX, s1.projY - s2.projY);
          if (dist < 140 && s1.projZ > -50 && s2.projZ > -50) {
            this.ctx.beginPath();
            this.ctx.moveTo(s1.projX, s1.projY);
            this.ctx.lineTo(s2.projX, s2.projY);
            this.ctx.stroke();
          }
        }
      }
      this.ctx.restore();

      // Render stars
      const t = Date.now() * 0.003;
      for (let s of sorted) {
        if (s.projScale <= 0) continue;

        const pulse = Math.sin(t + s.theta * 3) * 0.3 + 1.0;
        const radius = s.size * s.projScale * (s.isElena ? 1.4 : pulse);
        const alpha = Math.min(1.0, Math.max(0.2, (s.projZ + 200) / 360));

        this.ctx.save();
        this.ctx.fillStyle = s.color;
        this.ctx.globalAlpha = alpha;

        if (s.name) {
          this.ctx.shadowColor = s.color;
          this.ctx.shadowBlur = 12 * s.projScale;
        }

        this.ctx.beginPath();
        this.ctx.arc(s.projX, s.projY, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Aura ring around Elena or hovered star
        if (s.isElena || s === this.hoveredStar) {
          this.ctx.strokeStyle = '#fef08a';
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.arc(s.projX, s.projY, radius + 4, 0, Math.PI * 2);
          this.ctx.stroke();
        }

        this.ctx.restore();
      }

      // Render Hover Tooltip Card
      if (this.hoveredStar) {
        this.drawTooltip(this.hoveredStar);
      }
    }

    drawTooltip(s) {
      const boxW = 220;
      const boxH = 70;
      let tx = s.projX + 15;
      let ty = s.projY - 35;

      if (tx + boxW > this.width) tx = s.projX - boxW - 15;
      if (ty < 10) ty = 10;

      this.ctx.save();
      // Glass box
      this.ctx.fillStyle = 'rgba(20, 14, 26, 0.9)';
      this.ctx.strokeStyle = s.color;
      this.ctx.lineWidth = 1.5;
      this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
      this.ctx.shadowBlur = 12;

      this.ctx.beginPath();
      this.ctx.roundRect(tx, ty, boxW, boxH, 8);
      this.ctx.fill();
      this.ctx.stroke();

      // Tooltip Text
      this.ctx.fillStyle = '#fef3c7';
      this.ctx.font = 'bold 11px Cinzel Decorative, serif';
      this.ctx.fillText(s.name, tx + 12, ty + 20);

      this.ctx.fillStyle = '#f59e0b';
      this.ctx.font = '9px Outfit, sans-serif';
      this.ctx.fillText(s.years, tx + 12, ty + 34);

      this.ctx.fillStyle = '#d6d3d1';
      this.ctx.font = 'italic 9px Outfit, sans-serif';
      this.ctx.fillText(`"${s.quote.slice(0, 36)}..."`, tx + 12, ty + 52);

      this.ctx.restore();
    }
  }

  window.CelestialConstellation = CelestialConstellation;
})();
