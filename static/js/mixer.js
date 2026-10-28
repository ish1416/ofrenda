// 6-Track Vintage Procedural Ambient Soundscape Console
// Generates 6 independent acoustic environments using mathematical Web Audio synthesis (zero MP3 files)
(function() {
  class SoundscapeMixer {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.analyser = null;
      this.isPlaying = false;

      // 6 Tracks
      this.tracks = {
        candles: { name: 'Velas & Chimenea', gain: 0.6, muted: false, node: null, gainNode: null },
        rain: { name: 'Lluvia de Coyoacán', gain: 0.4, muted: false, node: null, gainNode: null },
        guitar: { name: 'Guitarra de Paracho', gain: 0.5, muted: false, node: null, gainNode: null },
        wind: { name: 'Viento de Copal', gain: 0.35, muted: false, node: null, gainNode: null },
        bells: { name: 'Campanas de Santo Domingo', gain: 0.3, muted: false, node: null, gainNode: null },
        crickets: { name: 'Grillos de Oaxaca', gain: 0.25, muted: false, node: null, gainNode: null }
      };

      this.intervals = [];
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    togglePower() {
      this.ensureContext();
      this.isPlaying = !this.isPlaying;

      if (this.isPlaying) {
        this.startAllTracks();
      } else {
        this.stopAllTracks();
      }
      return this.isPlaying;
    }

    startAllTracks() {
      this.ensureContext();
      const t = this.ctx.currentTime;

      // 1. Candles (Paraffin crackle & warm breath)
      this.startCandleTrack();

      // 2. Autumn Rain (Voss pink noise lowpass)
      this.startRainTrack();

      // 3. Paracho Guitar (Periodic arpeggiated nylon plucks)
      this.startGuitarTrack();

      // 4. Copal Wind (LFO modulated bandpass)
      this.startWindTrack();

      // 5. Cathedral Bells (Inharmonic bell resonance)
      this.startBellsTrack();

      // 6. Oaxaca Crickets (High frequency modulated chirp bursts)
      this.startCricketsTrack();
    }

    stopAllTracks() {
      this.intervals.forEach(clearInterval);
      this.intervals = [];

      Object.keys(this.tracks).forEach(k => {
        const tr = this.tracks[k];
        if (tr.gainNode && this.ctx) {
          tr.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        }
      });
    }

    setTrackVolume(trackName, volume) {
      this.ensureContext();
      if (!this.tracks[trackName]) return;
      this.tracks[trackName].gain = parseFloat(volume);
      if (!this.tracks[trackName].muted && this.tracks[trackName].gainNode) {
        this.tracks[trackName].gainNode.gain.setValueAtTime(this.tracks[trackName].gain, this.ctx.currentTime);
      }
    }

    toggleMute(trackName) {
      if (!this.tracks[trackName]) return false;
      this.tracks[trackName].muted = !this.tracks[trackName].muted;
      const targetGain = this.tracks[trackName].muted ? 0 : this.tracks[trackName].gain;
      if (this.tracks[trackName].gainNode && this.ctx) {
        this.tracks[trackName].gainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      }
      return this.tracks[trackName].muted;
    }

    setMasterVolume(val) {
      this.ensureContext();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(parseFloat(val), this.ctx.currentTime);
      }
    }

    // 1. Track: Candles
    startCandleTrack() {
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.tracks.candles.muted ? 0 : this.tracks.candles.gain * 0.4, this.ctx.currentTime);
      g.connect(this.masterGain);
      this.tracks.candles.gainNode = g;

      // Background warm air hum
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, this.ctx.currentTime);
      osc.connect(g);
      osc.start();

      // Scheduled micro-crackle pops
      const crackleInt = setInterval(() => {
        if (!this.isPlaying || this.tracks.candles.muted) return;
        const popTime = this.ctx.currentTime;
        const oscP = this.ctx.createOscillator();
        const gP = this.ctx.createGain();
        oscP.type = 'triangle';
        oscP.frequency.setValueAtTime(Math.random() * 800 + 400, popTime);
        gP.gain.setValueAtTime(0.04 * this.tracks.candles.gain, popTime);
        gP.gain.exponentialRampToValueAtTime(0.0001, popTime + 0.05);
        oscP.connect(gP);
        gP.connect(this.masterGain);
        oscP.start(popTime);
        oscP.stop(popTime + 0.05);
      }, 350);
      this.intervals.push(crackleInt);
    }

    // 2. Track: Rain
    startRainTrack() {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, this.ctx.currentTime);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.tracks.rain.muted ? 0 : this.tracks.rain.gain * 0.6, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(g);
      g.connect(this.masterGain);
      noise.start();
      this.tracks.rain.gainNode = g;
    }

    // 3. Track: Guitar
    startGuitarTrack() {
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.tracks.guitar.muted ? 0 : this.tracks.guitar.gain * 0.5, this.ctx.currentTime);
      g.connect(this.masterGain);
      this.tracks.guitar.gainNode = g;

      const notes = [146.83, 174.61, 220.00, 293.66, 220.00, 174.61]; // Dm
      let step = 0;

      const guitarInt = setInterval(() => {
        if (!this.isPlaying || this.tracks.guitar.muted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[step % notes.length], now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(320, now + 0.6);

        noteGain.gain.setValueAtTime(0.08 * this.tracks.guitar.gain, now);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(g);

        osc.start(now);
        osc.stop(now + 0.6);

        step++;
      }, 550);
      this.intervals.push(guitarInt);
    }

    // 4. Track: Wind
    startWindTrack() {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      // LFO modulation for wind gusts
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.tracks.wind.muted ? 0 : this.tracks.wind.gain * 0.45, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(g);
      g.connect(this.masterGain);
      noise.start();
      this.tracks.wind.gainNode = g;
    }

    // 5. Track: Bells
    startBellsTrack() {
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.tracks.bells.muted ? 0 : this.tracks.bells.gain * 0.4, this.ctx.currentTime);
      g.connect(this.masterGain);
      this.tracks.bells.gainNode = g;

      const ringBell = () => {
        if (!this.isPlaying || this.tracks.bells.muted) return;
        const now = this.ctx.currentTime;
        const harmonics = [329.63, 659.25, 987.77, 1318.51]; // E4 church bell

        harmonics.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gH = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          gH.gain.setValueAtTime((0.08 / (idx + 1)) * this.tracks.bells.gain, now);
          gH.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

          osc.connect(gH);
          gH.connect(g);
          osc.start(now);
          osc.stop(now + 4.0);
        });
      };

      ringBell();
      const bellInt = setInterval(ringBell, 7000);
      this.intervals.push(bellInt);
    }

    // 6. Track: Crickets
    startCricketsTrack() {
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.tracks.crickets.muted ? 0 : this.tracks.crickets.gain * 0.35, this.ctx.currentTime);
      g.connect(this.masterGain);
      this.tracks.crickets.gainNode = g;

      const chirpInt = setInterval(() => {
        if (!this.isPlaying || this.tracks.crickets.muted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gC = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(4500, now);
        osc.frequency.setValueAtTime(4900, now + 0.04);

        gC.gain.setValueAtTime(0.03 * this.tracks.crickets.gain, now);
        gC.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(gC);
        gC.connect(g);
        osc.start(now);
        osc.stop(now + 0.12);
      }, 1200);
      this.intervals.push(chirpInt);
    }

    applyPreset(presetName) {
      if (presetName === 'vigil') {
        this.setTrackVolume('candles', 0.9);
        this.setTrackVolume('rain', 0.1);
        this.setTrackVolume('guitar', 0.3);
        this.setTrackVolume('wind', 0.8);
        this.setTrackVolume('bells', 0.4);
        this.setTrackVolume('crickets', 0.5);
      } else if (presetName === 'coyoacan_rain') {
        this.setTrackVolume('candles', 0.4);
        this.setTrackVolume('rain', 0.95);
        this.setTrackVolume('guitar', 0.85);
        this.setTrackVolume('wind', 0.3);
        this.setTrackVolume('bells', 0.2);
        this.setTrackVolume('crickets', 0.1);
      } else if (presetName === 'sacred_peace') {
        this.setTrackVolume('candles', 0.6);
        this.setTrackVolume('rain', 0.0);
        this.setTrackVolume('guitar', 0.4);
        this.setTrackVolume('wind', 0.3);
        this.setTrackVolume('bells', 0.8);
        this.setTrackVolume('crickets', 0.7);
      }
    }

    getVULevel() {
      if (!this.analyser) return 0;
      const data = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i];
      }
      return Math.min(1.0, (sum / data.length) / 120);
    }
  }

  window.soundscapeMixer = new SoundscapeMixer();
})();
