// Ambient Altar Soundscape (Web Audio API Synthesizer - Zero External Audio Dependencies)
class AltarAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
  }

  toggle() {
    this.init();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  play() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Warm chord: D minor / Mexican folk acoustic warmth (D3: 146.83, F3: 174.61, A3: 220, D4: 293.66)
    const freqs = [146.83, 174.61, 220.0, 293.66];
    this.oscillators = freqs.map((f, i) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      // Subtle slow pulsing tremolo (reminiscent of flickering candle air)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.25 + i * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      lfo.connect(oscGain.gain);
      lfo.start();

      oscGain.gain.setValueAtTime(0.04 / freqs.length, this.ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();

      return { osc, lfo };
    });

    this.isPlaying = true;
  }

  stop() {
    this.oscillators.forEach(({ osc, lfo }) => {
      try {
        osc.stop();
        lfo.stop();
      } catch (e) {}
    });
    this.oscillators = [];
    this.isPlaying = false;
  }
}

window.altarAudio = new AltarAudio();
