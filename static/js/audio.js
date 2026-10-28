// Advanced Web Audio API Synthesizer for Ofrenda
// Includes:
// 1. Acoustic guitar arpeggiation for "La Llorona" cassette playback
// 2. Real-time AnalyserNode for audio frequency waveform visualization
// 3. Sound effects: match-strike ignition, offering chime, and ambient night hum

class AltarAudio {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.gainNode = null;
    this.isAmbientPlaying = false;
    this.isCassettePlaying = false;
    this.ambientOscs = [];
    this.cassetteInterval = null;
    this.onCassetteStateChange = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Analyser Node for Visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sound effect: Match strike and candle flame ignition
  playMatchStrike() {
    this.ensureContext();
    const t = this.ctx.currentTime;

    // White noise buffer for friction / strike
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter for friction sizzle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.Q.setValueAtTime(3, t);

    // Warm resonant whoosh
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.35);

    oscGain.gain.setValueAtTime(0.08, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    noise.connect(filter);
    filter.connect(this.gainNode);
    osc.connect(oscGain);
    oscGain.connect(this.gainNode);

    noise.start(t);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Sound effect: Gentle spiritual chime when placing an offering
  playOfferingChime() {
    this.ensureContext();
    const t = this.ctx.currentTime;
    const freqs = [587.33, 880.0, 1174.66]; // D5, A5, D6 harmonic chime

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      g.gain.setValueAtTime(0.06 / (i + 1), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2 + i * 0.2);

      osc.connect(g);
      g.connect(this.gainNode);
      osc.start(t);
      osc.stop(t + 1.5);
    });
  }

  // Ambient candle hum
  toggleAmbient() {
    this.ensureContext();
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.playAmbient();
      return true;
    }
  }

  playAmbient() {
    this.ensureContext();
    const freqs = [146.83, 220.0, 293.66]; // D3, A3, D4
    this.ambientOscs = freqs.map((f, i) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + i * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      lfo.connect(oscGain.gain);
      lfo.start();

      oscGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();
      return { osc, lfo };
    });
    this.isAmbientPlaying = true;
  }

  stopAmbient() {
    this.ambientOscs.forEach(({ osc, lfo }) => {
      try {
        osc.stop();
        lfo.stop();
      } catch (e) {}
    });
    this.ambientOscs = [];
    this.isAmbientPlaying = false;
  }

  // Cassette playback: Synthesized acoustic Mexican guitar arpeggio of "La Llorona"
  toggleCassette() {
    this.ensureContext();
    if (this.isCassettePlaying) {
      this.stopCassette();
      return false;
    } else {
      this.playCassette();
      return true;
    }
  }

  playCassette() {
    this.ensureContext();
    this.isCassettePlaying = true;

    // "La Llorona" chord progression arpeggios (Dm, Gm, A7, Dm)
    // Notes: [D3, F3, A3, D4, C4, Bb3, A3, G3, F3, E3, D3...]
    const notes = [
      146.83, 174.61, 220.00, 293.66, 220.00, 174.61, // Dm
      196.00, 233.08, 293.66, 392.00, 293.66, 233.08, // Gm
      220.00, 277.18, 329.63, 440.00, 329.63, 277.18, // A7
      146.83, 220.00, 293.66, 349.23, 293.66, 220.00  // Dm
    ];

    let noteIndex = 0;
    this.cassetteInterval = setInterval(() => {
      if (!this.isCassettePlaying) return;
      const freq = notes[noteIndex % notes.length];
      this._pluckGuitarNote(freq);
      noteIndex++;
    }, 280);

    if (this.onCassetteStateChange) this.onCassetteStateChange(true);
  }

  stopCassette() {
    this.isCassettePlaying = false;
    if (this.cassetteInterval) {
      clearInterval(this.cassetteInterval);
      this.cassetteInterval = null;
    }
    if (this.onCassetteStateChange) this.onCassetteStateChange(false);
  }

  _pluckGuitarNote(freq) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Warm guitar low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(350, t + 0.6);

    // Acoustic pluck envelope
    g.gain.setValueAtTime(0.09, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.gainNode);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  // Get frequency byte data for animated waveform visualizer
  getFrequencyData(array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }
}

window.altarAudio = new AltarAudio();
