// Ofrenda Frontend State & Controller
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

  // Load initial data
  loadAltar();
  loadMemories();

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
    const playing = window.altarAudio.toggle();
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
        `);
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

      // Render Candles
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
        div.addEventListener('click', () => toggleCandle(c.id));
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

  // Toggle candle
  async function toggleCandle(candleId) {
    try {
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
        const sourcesText = data.sources.length ? `Fuentes: ${data.sources.join(', ')}` : 'Memoria familiar';
        const costText = data.is_local ? '$0.000 (Air-Gapped Local)' : `$${data.cost_usd.toFixed(6)}`;

        appendGemmaMessage(`
          ${data.answer}
          <div class="trace-info">
            <span>⏱️ ${data.latency_ms} ms • 🔤 ${data.estimated_tokens} tokens • 💰 ${costText}</span>
            <span>🛡️ Reverencia: ${(data.reverence_score * 100).toFixed(0)}% • Sentry Traced</span>
          </div>
        `);
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

  function appendGemmaMessage(html) {
    const div = document.createElement('div');
    div.className = 'chat-bubble gemma';
    div.innerHTML = html;
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
