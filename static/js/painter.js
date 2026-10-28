// Interactive Sugar Skull (Calavera) Symmetry Painter Studio
// Features horizontal symmetry mirroring, artisanal Día de los Muertos palettes, flower stamps, and PNG export
(function() {
  class SkullPainter {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width = 320;
      this.height = this.canvas.height = 360;

      this.isDrawing = false;
      this.currentColor = '#f59e0b';
      this.brushSize = 4;
      this.brushType = 'line'; // 'line', 'petals', 'dots'
      this.isSymmetric = true;
      this.lastX = 0;
      this.lastY = 0;

      this.init();
    }

    init() {
      this.drawBaseSkull();

      // Mouse events
      this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
      this.canvas.addEventListener('mousemove', (e) => this.draw(e));
      window.addEventListener('mouseup', () => this.stopDraw());

      // Touch events for mobile
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          const rect = this.canvas.getBoundingClientRect();
          this.startDraw({ clientX: t.clientX, clientY: t.clientY });
        }
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          this.draw({ clientX: t.clientX, clientY: t.clientY });
        }
      }, { passive: true });

      this.canvas.addEventListener('touchend', () => this.stopDraw());
    }

    drawBaseSkull() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      const cx = this.width / 2;
      const cy = this.height / 2 - 10;

      // Base porcelain sugar skull shape
      this.ctx.save();
      this.ctx.fillStyle = '#fafaf9';
      this.ctx.shadowColor = 'rgba(245, 158, 11, 0.2)';
      this.ctx.shadowBlur = 15;

      this.ctx.beginPath();
      // Cranium
      this.ctx.arc(cx, cy - 20, 80, 0, Math.PI * 2);
      this.ctx.fill();

      // Jaw
      this.ctx.beginPath();
      this.ctx.roundRect(cx - 50, cy + 30, 100, 65, [0, 0, 24, 24]);
      this.ctx.fill();

      // Cheekbones contour join
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy + 20, 75, 45, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Eye sockets
      this.ctx.fillStyle = '#1c1917';
      this.ctx.shadowBlur = 0;

      // Left eye
      this.ctx.beginPath();
      this.ctx.ellipse(cx - 32, cy - 10, 22, 26, -0.1, 0, Math.PI * 2);
      this.ctx.fill();

      // Right eye
      this.ctx.beginPath();
      this.ctx.ellipse(cx + 32, cy - 10, 22, 26, 0.1, 0, Math.PI * 2);
      this.ctx.fill();

      // Heart-shaped nasal cavity
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy + 22);
      this.ctx.bezierCurveTo(cx - 10, cy + 12, cx - 12, cy + 32, cx, cy + 40);
      this.ctx.bezierCurveTo(cx + 12, cy + 32, cx + 10, cy + 12, cx, cy + 22);
      this.ctx.fill();

      // Teeth grid
      this.ctx.strokeStyle = '#44403c';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(cx - 36, cy + 68);
      this.ctx.lineTo(cx + 36, cy + 68);
      this.ctx.stroke();

      for (let tx = -28; tx <= 28; tx += 14) {
        this.ctx.beginPath();
        this.ctx.moveTo(cx + tx, cy + 56);
        this.ctx.lineTo(cx + tx, cy + 80);
        this.ctx.stroke();
      }

      this.ctx.restore();
    }

    getPos(e) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }

    startDraw(e) {
      this.isDrawing = true;
      const pos = this.getPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
      this.renderPoint(pos.x, pos.y);
    }

    draw(e) {
      if (!this.isDrawing) return;
      const pos = this.getPos(e);

      this.renderStroke(this.lastX, this.lastY, pos.x, pos.y);
      this.lastX = pos.x;
      this.lastY = pos.y;
    }

    stopDraw() {
      this.isDrawing = false;
    }

    renderStroke(x1, y1, x2, y2) {
      this.drawSingleStroke(x1, y1, x2, y2);
      if (this.isSymmetric) {
        const cx = this.width / 2;
        const symX1 = cx + (cx - x1);
        const symX2 = cx + (cx - x2);
        this.drawSingleStroke(symX1, y1, symX2, y2);
      }
    }

    drawSingleStroke(x1, y1, x2, y2) {
      this.ctx.save();
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.fillStyle = this.currentColor;
      this.ctx.lineWidth = this.brushSize;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.shadowColor = this.currentColor;
      this.ctx.shadowBlur = 4;

      if (this.brushType === 'line') {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      } else if (this.brushType === 'dots') {
        this.ctx.beginPath();
        this.ctx.arc(x2, y2, this.brushSize * 1.2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (this.brushType === 'petals') {
        this.drawFlowerStamp(x2, y2, this.brushSize * 2.5);
      }
      this.ctx.restore();
    }

    renderPoint(x, y) {
      this.renderStroke(x, y, x, y);
    }

    drawFlowerStamp(x, y, radius) {
      const petals = 6;
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        const px = x + Math.cos(angle) * radius * 0.7;
        const py = y + Math.sin(angle) * radius * 0.7;
        this.ctx.beginPath();
        this.ctx.arc(px, py, radius * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
      }
      // Flower center
      this.ctx.fillStyle = '#fef08a';
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    setColor(colorHex) {
      this.currentColor = colorHex;
    }

    setBrushSize(size) {
      this.brushSize = parseInt(size, 10);
    }

    setBrushType(type) {
      this.brushType = type;
    }

    toggleSymmetry() {
      this.isSymmetric = !this.isSymmetric;
      return this.isSymmetric;
    }

    clear() {
      this.drawBaseSkull();
    }

    exportPNG() {
      return this.canvas.toDataURL('image/png');
    }
  }

  window.SkullPainter = SkullPainter;
})();
