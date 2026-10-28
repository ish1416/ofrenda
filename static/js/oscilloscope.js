// CRT Phosphor Oscilloscope & Lissajous Spirit Voice Visualizer
// Simulates an authentic 1950s vacuum-tube P31 green phosphor oscilloscope with persistence decay
(function() {
  class SpiritOscilloscope {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width = 360;
      this.height = this.canvas.height = 220;

      this.mode = 'lissajous'; // 'waveform', 'lissajous', 'spectrum'
      this.timeDiv = 1.0;
      this.intensity = 1.0;
      this.phase = 0;
      this.analyser = null;
      this.timeData = new Uint8Array(128);
      this.freqData = new Uint8Array(64);
      this.isSpiritActive = true;

      this.init();
    }

    init() {
      this.loop();
    }

    setMode(newMode) {
      this.mode = newMode;
    }

    setTimeDiv(val) {
      this.timeDiv = parseFloat(val);
    }

    setIntensity(val) {
      this.intensity = parseFloat(val);
    }

    triggerSpiritBurst() {
      this.isSpiritActive = true;
      this.intensity = 1.6;
      setTimeout(() => {
        this.intensity = 1.0;
      }, 2500);
    }

    loop() {
      requestAnimationFrame(() => this.loop());

      // 1. Phosphor persistence decay (fade out old trace with green phosphor trail)
      this.ctx.fillStyle = 'rgba(6, 20, 10, 0.22)';
      this.ctx.fillRect(0, 0, this.width, this.height);

      // 2. Draw CRT graticule grid (oscilloscope reticle)
      this.drawGraticule();

      // 3. Get audio data or synthesize spirit resonance
      if (window.altarAudio && window.altarAudio.analyser) {
        window.altarAudio.analyser.getByteTimeDomainData(this.timeData);
        window.altarAudio.analyser.getByteFrequencyData(this.freqData);
      }

      // Check if real sound is playing
      let hasSound = false;
      for (let i = 0; i < this.timeData.length; i++) {
        if (Math.abs(this.timeData[i] - 128) > 4) {
          hasSound = true;
          break;
        }
      }

      this.phase += 0.04 * this.timeDiv;

      // 4. Render trace based on mode
      this.ctx.save();
      this.ctx.strokeStyle = `rgba(74, 222, 128, ${0.85 * this.intensity})`;
      this.ctx.shadowColor = '#22c55e';
      this.ctx.shadowBlur = 8 * this.intensity;
      this.ctx.lineWidth = 2.0;

      if (this.mode === 'lissajous') {
        this.drawLissajous(hasSound);
      } else if (this.mode === 'spectrum') {
        this.drawSpectrum(hasSound);
      } else {
        this.drawWaveform(hasSound);
      }

      this.ctx.restore();

      // 5. Draw CRT scanlines and glass reflection
      this.drawCRTOverlay();
    }

    drawGraticule() {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(34, 197, 94, 0.12)';
      this.ctx.lineWidth = 1;

      // Grid subdivisions: 8x6 blocks
      const stepX = this.width / 10;
      const stepY = this.height / 8;

      this.ctx.beginPath();
      for (let x = stepX; x < this.width; x += stepX) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
      }
      for (let y = stepY; y < this.height; y += stepY) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
      }
      this.ctx.stroke();

      // Center crosshairs with tick marks
      this.ctx.strokeStyle = 'rgba(34, 197, 94, 0.28)';
      this.ctx.beginPath();
      this.ctx.moveTo(this.width / 2, 0);
      this.ctx.lineTo(this.width / 2, this.height);
      this.ctx.moveTo(0, this.height / 2);
      this.ctx.lineTo(this.width, this.height / 2);
      this.ctx.stroke();

      this.ctx.restore();
    }

    drawLissajous(hasSound) {
      const cx = this.width / 2;
      const cy = this.height / 2;
      const rx = (this.width * 0.36);
      const ry = (this.height * 0.38);

      const f1 = 2;
      const f2 = 3;
      const points = 180;

      this.ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const t = (i / points) * Math.PI * 2;
        let audioPerturb = 0;
        if (hasSound) {
          const idx = Math.floor((i / points) * (this.timeData.length - 1));
          audioPerturb = (this.timeData[idx] - 128) * 0.45;
        } else {
          // Resting spiritual breathing pulse
          audioPerturb = Math.sin(t * 5 + this.phase * 2) * 4;
        }

        const x = cx + (rx + audioPerturb) * Math.sin(f1 * t + this.phase);
        const y = cy + (ry + audioPerturb) * Math.sin(f2 * t);

        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }

    drawWaveform(hasSound) {
      this.ctx.beginPath();
      const sliceWidth = this.width / this.timeData.length;
      let x = 0;

      for (let i = 0; i < this.timeData.length; i++) {
        let v;
        if (hasSound) {
          v = (this.timeData[i] / 128.0) - 1.0;
        } else {
          v = Math.sin((i * 0.15 * this.timeDiv) + this.phase) * 0.25 +
              Math.sin((i * 0.05) + this.phase * 0.5) * 0.1;
        }

        const y = (this.height / 2) + v * (this.height * 0.42);

        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);

        x += sliceWidth;
      }
      this.ctx.stroke();
    }

    drawSpectrum(hasSound) {
      const barCount = 32;
      const barWidth = (this.width / barCount) * 0.75;
      const gap = (this.width / barCount) * 0.25;

      for (let i = 0; i < barCount; i++) {
        let val;
        if (hasSound) {
          val = this.freqData[i] || 4;
        } else {
          val = (Math.sin(i * 0.3 + this.phase) * 0.5 + 0.5) * 80 + 10;
        }

        const h = (val / 255) * this.height * 0.75;
        const x = i * (barWidth + gap) + 10;
        const y = this.height - h - 14;

        this.ctx.fillStyle = `rgba(74, 222, 128, ${0.85 * this.intensity})`;
        this.ctx.fillRect(x, y, barWidth, h);

        // Peak phosphor dot
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fillRect(x, y - 2, barWidth, 2);
      }
    }

    drawCRTOverlay() {
      // Horizontal scanlines
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      for (let y = 0; y < this.height; y += 3) {
        this.ctx.fillRect(0, y, this.width, 1);
      }

      // Vignette / screen curvature shadow
      const grad = this.ctx.createRadialGradient(
        this.width / 2, this.height / 2, this.width * 0.35,
        this.width / 2, this.height / 2, this.width * 0.55
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.65)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.restore();
    }
  }

  window.SpiritOscilloscope = SpiritOscilloscope;
})();
