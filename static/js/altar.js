// Ofrenda Frontend State & Enhanced Controller
document.addEventListener('DOMContentLoaded', () => {
  let isOfflineMode = false;

  // DOM Elements
  const candlesContainer = document.getElementById('candles-row');
  const offeringsContainer = document.getElementById('offerings-grid');
  const memoriesContainer = document.getElementById('memories-list');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatForm = document.getElementById('chat-form');
  const modelBadgeText = document.getElementById('model-badge-text');
  const modeToggleBtn = document.getElementById('mode-toggle-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const exportBtn = document.getElementById('export-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const openModalBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const offeringForm = document.getElementById('offering-form');
  const calaveritaBtn = document.getElementById('calaverita-btn');

  // Cassette & Visualizer Elements
  const cassettePlayBtn = document.getElementById('cassette-play-btn');
  const cassettePlayIcon = document.getElementById('cassette-play-icon');
  const cassettePlayText = document.getElementById('cassette-play-text');
  const reelLeft = document.getElementById('reel-left');
  const reelRight = document.getElementById('reel-right');
  const waveformCanvas = document.getElementById('waveform-canvas');
  const cassetteTime = document.getElementById('cassette-time');

  // Flip Card Element
  const recipeFlipCard = document.getElementById('recipe-flip-card');

  // Timeline Elements
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const timelineStoryDisplay = document.getElementById('timeline-story-display');

  // Papel Picado Garland
  const papelGarland = document.getElementById('papel-garland');

  // Load initial data
  loadAltar();
  loadMemories();
  initVisualizer();

  // Mouse Parallax on Papel Picado
  window.addEventListener('mousemove', (e) => {
    if (!papelGarland) return;
    const normX = (e.clientX / window.innerWidth - 0.5) * 8;
    const flags = papelGarland.querySelectorAll('.papel-flag');
    flags.forEach((f, idx) => {
      const factor = (idx % 3 + 1) * 0.3;
      f.style.transform = `rotate(${normX * factor}deg)`;
    });
  });

  // 3D Flip Card Toggle
  if (recipeFlipCard) {
    recipeFlipCard.addEventListener('click', () => {
      recipeFlipCard.classList.toggle('flipped');
    });
  }

  // Timeline Nodes
  timelineNodes.forEach(node => {
    node.addEventListener('click', () => {
      timelineNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      const story = node.getAttribute('data-story');
      const year = node.getAttribute('data-year');
      if (timelineStoryDisplay) {
        timelineStoryDisplay.innerHTML = `<strong>${year}:</strong> "${story}"`;
      }
    });
  });

  // Cassette Playback Toggle
  if (cassettePlayBtn) {
    cassettePlayBtn.addEventListener('click', () => {
      const isPlaying = window.altarAudio.toggleCassette();
      updateCassetteUI(isPlaying);
    });

    window.altarAudio.onCassetteStateChange = (isPlaying) => {
      updateCassetteUI(isPlaying);
    };
  }

  function updateCassetteUI(isPlaying) {
    if (isPlaying) {
      cassettePlayIcon.textContent = '⏸';
      cassettePlayText.textContent = 'Pause Cassette';
      reelLeft.classList.add('spinning');
      reelRight.classList.add('spinning');
      cassetteTime.textContent = '01:14 / 03:45';
    } else {
      cassettePlayIcon.textContent = '▶';
      cassettePlayText.textContent = 'Play Cassette';
      reelLeft.classList.remove('spinning');
      reelRight.classList.remove('spinning');
    }
  }

  // Real-Time Waveform Visualizer
  function initVisualizer() {
    if (!waveformCanvas) return;
    const ctx = waveformCanvas.getContext('2d');
    const freqData = new Uint8Array(32);

    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

      if (window.altarAudio.isCassettePlaying) {
        window.altarAudio.getFrequencyData(freqData);
      } else {
        // Flatline or subtle resting hum
        for (let i = 0; i < freqData.length; i++) {
          freqData[i] = Math.max(0, freqData[i] - 4);
        }
      }

      const barWidth = (waveformCanvas.width / freqData.length) * 0.75;
      const gap = (waveformCanvas.width / freqData.length) * 0.25;

      for (let i = 0; i < freqData.length; i++) {
        const val = freqData[i] || 4;
        const barHeight = (val / 255) * waveformCanvas.height * 0.9;
        const x = i * (barWidth + gap);
        const y = waveformCanvas.height - barHeight;

        // Gradient from marigold to candle flame
        const grad = ctx.createLinearGradient(0, y, 0, waveformCanvas.height);
        grad.addColorStop(0, '#fef3c7');
        grad.addColorStop(0.5, '#f59e0b');
        grad.addColorStop(1, '#ea580c');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }
    draw();
  }

  // Mode toggle (Cloud vs Air-Gapped Local)
  modeToggleBtn.addEventListener('click', () => {
    isOfflineMode = !isOfflineMode;
    if (isOfflineMode) {
      modeToggleBtn.innerHTML = '💻 Air-Gapped Local (Ollama)';
      modeToggleBtn.classList.add('active');
      modelBadgeText.textContent = 'Gemma 4 / Gemma 2 (Local Ollama • 100% Offline)';
    } else {
      modeToggleBtn.innerHTML = '☁️ Cloud Demo (Render)';
      modeToggleBtn.classList.remove('active');
      modelBadgeText.textContent = 'Google Gemma (Cloud Demo + Sentry Traced)';
    }
  });

  // Audio ambient toggle
  audioToggleBtn.addEventListener('click', () => {
    const playing = window.altarAudio.toggleAmbient();
    if (playing) {
      audioToggleBtn.innerHTML = '🔊 Ambient Sound: On';
      audioToggleBtn.classList.add('active');
    } else {
      audioToggleBtn.innerHTML = '🔈 Ambient Sound: Off';
      audioToggleBtn.classList.remove('active');
    }
  });

  // Export Keepsake PDF
  exportBtn.addEventListener('click', () => {
    window.open('/api/memories/export', '_blank');
  });

  // Modal open/close
  openModalBtn.addEventListener('click', () => modalBackdrop.classList.add('open'));
  closeModalBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
  });

  // New offering form submit
  offeringForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('offering-name').value.trim();
    const category = document.getElementById('offering-cat').value;
    const description = document.getElementById('offering-desc').value.trim();
    const icon = document.getElementById('offering-icon').value.trim() || '🌼';

    if (!name || !description) return;

    try {
      const res = await fetch('/api/altar/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'off_' + Date.now(),
          name,
          category,
          description,
          icon
        })
      });
      if (res.ok) {
        window.altarAudio.playOfferingChime();
        modalBackdrop.classList.remove('open');
        offeringForm.reset();
        loadAltar();
      }
    } catch (err) {
      console.error('Failed to place offering:', err);
    }
  });

  // Chat submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    chatInput.value = '';
    handleUserQuery(query);
  });

  // Suggested prompt chips
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) handleUserQuery(prompt);
    });
  });

  // Calaverita generator button
  calaveritaBtn.addEventListener('click', async () => {
    appendUserMessage('Compon una Calaverita Literaria tradicional para Elena.');
    appendGemmaThinking();
    try {
      const res = await fetch('/api/chat/calaverita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_name: 'Elena Ramirez Solis',
          traits: ['su mole negro', 'su guitarra de Paracho', 'su risa en la cocina']
        })
      });
      removeGemmaThinking();
      if (res.ok) {
        const data = await res.json();
        appendGemmaMessage(`
          <strong>🌼 Calaverita Literaria para Elena:</strong><br><br>
          <pre style="font-family: inherit; white-space: pre-wrap; margin:0;">${data.poem}</pre>
          <div class="trace-info">
            <span>Poema tradicional • ${data.stanzas_count} estrofas</span>
            <span>Versos octosílabos para Día de los Muertos</span>
          </div>
        `, data.poem);
      }
    } catch (err) {
      removeGemmaThinking();
      appendGemmaMessage('Lo siento, la inspiración poética se interrumpió temporalmente.');
    }
  });

  // Load Altar Status
  async function loadAltar() {
    try {
      const res = await fetch('/api/altar');
      if (!res.ok) return;
      const data = await res.json();

      // Render Candles with Match Strike & Light Bloom
      candlesContainer.innerHTML = '';
      data.candles.forEach(c => {
        const div = document.createElement('div');
        div.className = `candle-unit ${c.is_lit ? '' : 'unlit'}`;
        div.innerHTML = `
          <div class="candle-flame"></div>
          <div class="candle-body"></div>
          <div class="candle-label">${c.name}</div>
        `;
        div.title = `Click to ${c.is_lit ? 'extinguish' : 'light'} this candle`;
        div.addEventListener('click', () => toggleCandle(c.id, div));
        candlesContainer.appendChild(div);
      });

      // Render Offerings
      offeringsContainer.innerHTML = '';
      data.offerings.forEach(o => {
        const card = document.createElement('div');
        card.className = 'offering-card';
        card.innerHTML = `
          <div class="offering-icon">${o.icon}</div>
          <div class="offering-content">
            <h4>${o.name}</h4>
            <p>${o.description}</p>
          </div>
        `;
        offeringsContainer.appendChild(card);
      });

      // Update homages count
      const homageCountEl = document.getElementById('homage-count');
      if (homageCountEl) homageCountEl.textContent = data.total_homages;

    } catch (e) {
      console.error('Altar load failed:', e);
    }
  }

  // Toggle candle with match sound & bloom effect
  async function toggleCandle(candleId, candleEl) {
    try {
      window.altarAudio.playMatchStrike();

      // Trigger bloom effect
      const bloom = document.createElement('div');
      bloom.className = 'candle-bloom-ring';
      candleEl.appendChild(bloom);
      setTimeout(() => bloom.remove(), 750);

      const res = await fetch(`/api/altar/candles/${candleId}/toggle`, { method: 'POST' });
      if (res.ok) loadAltar();
    } catch (e) {
      console.error('Toggle candle failed:', e);
    }
  }

  // Load Memories
  async function loadMemories() {
    try {
      const res = await fetch('/api/memories');
      if (!res.ok) return;
      const list = await res.json();

      memoriesContainer.innerHTML = '';
      list.forEach(m => {
        const item = document.createElement('div');
        item.className = 'memory-item';
        item.innerHTML = `
          <div class="memory-meta">
            <span class="memory-title">${m.title}</span>
            <span class="memory-year">${m.year || 'Recuerdo'}</span>
          </div>
          <div class="memory-body">${m.content}</div>
          <div class="memory-author">Registrado por: ${m.recorded_by || 'Familia'} • [${m.category.toUpperCase()}]</div>
        `;
        memoriesContainer.appendChild(item);
      });
    } catch (e) {
      console.error('Memories load failed:', e);
    }
  }

  // Query Gemma Chronicler
  async function handleUserQuery(query) {
    appendUserMessage(query);
    appendGemmaThinking();

    try {
      const res = await fetch('/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          offline_mode: isOfflineMode
        })
      });

      removeGemmaThinking();

      if (res.ok) {
        const data = await res.json();
        const costText = data.is_local ? '$0.000 (Air-Gapped Local)' : `$${data.cost_usd.toFixed(6)}`;

        appendGemmaMessage(`
          ${data.answer}
          <div class="trace-info">
            <span>⏱️ ${data.latency_ms} ms • 🔤 ${data.estimated_tokens} tokens • 💰 ${costText}</span>
            <span>🛡️ Reverencia: ${(data.reverence_score * 100).toFixed(0)}% • Sentry Traced</span>
          </div>
        `, data.answer);
      } else {
        appendGemmaMessage('No pudimos consultar el archivo en este momento.');
      }
    } catch (e) {
      removeGemmaThinking();
      appendGemmaMessage('Error conectando con el motor de memoria.');
    }
  }

  function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-bubble user';
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendGemmaMessage(html, textToSpeak) {
    const div = document.createElement('div');
    div.className = 'chat-bubble gemma';
    div.innerHTML = html;

    // Optional Speech Synthesis read aloud button
    if (textToSpeak && ('speechSynthesis' in window)) {
      const speakBtn = document.createElement('button');
      speakBtn.className = 'btn-speak';
      speakBtn.innerHTML = '🔊 Read Aloud';
      speakBtn.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/<[^>]*>?/gm, ''));
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      });
      div.appendChild(speakBtn);
    }

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendGemmaThinking() {
    const div = document.createElement('div');
    div.id = 'thinking-indicator';
    div.className = 'chat-bubble gemma';
    div.style.fontStyle = 'italic';
    div.style.opacity = '0.7';
    div.textContent = 'Consultando los recuerdos familiares en el archivo...';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeGemmaThinking() {
    const ind = document.getElementById('thinking-indicator');
    if (ind) ind.remove();
  }
});
