// Ofrenda: Living Digital Altar & Oral History Vault Controller
document.addEventListener('DOMContentLoaded', () => {
  let isOfflineMode = false;
  let isSeanceActive = false;
  let selectedIcingColor = '#f59e0b';
  let hadAllCandlesLit = false;

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
  const seanceToggleBtn = document.getElementById('seance-toggle-btn');
  const exportBtn = document.getElementById('export-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const openModalBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const offeringForm = document.getElementById('offering-form');
  const calaveritaBtn = document.getElementById('calaverita-btn');
  const sacredQuadrantBanner = document.getElementById('sacred-quadrant-banner');

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

  // Radio Fantasma Elements
  const radioSlider = document.getElementById('radio-tuner-slider');
  const radioFreqLabel = document.getElementById('radio-freq-label');
  const radioFreqDesc = document.getElementById('radio-freq-desc');
  const radioListenBtn = document.getElementById('radio-listen-btn');
  const radioStatusText = document.getElementById('radio-status-text');

  // Sugar Skull Elements
  const skullNameInput = document.getElementById('skull-name-input');
  const skullNameDisplay = document.getElementById('skull-name-display');
  const blessSkullBtn = document.getElementById('bless-skull-btn');
  const icingButtons = document.querySelectorAll('.icing-btn');

  // Letter Burning Ritual Elements
  const sacredLetterInput = document.getElementById('sacred-letter-input');
  const letterSenderName = document.getElementById('letter-sender-name');
  const letterRecipientName = document.getElementById('letter-recipient-name');
  const burnLetterBtn = document.getElementById('burn-letter-btn');
  const letterParchmentArea = document.getElementById('letter-parchment-area');

  // Radio Historical Frequencies
  const RADIO_STATIONS = [
    { freq: 540, year: '1938', title: 'Valle de Oaxaca', desc: 'Elena niña aprende a moler maíz en metate mientras su abuela canta un arrullo mixteco.', quote: 'El arrullo mixteco en el valle de Oaxaca, 1938. El comal de barro ya huele a maíz tierno.' },
    { freq: 700, year: '1958', title: 'Llegada a Coyoacán', desc: 'Los frenos del autobús de segunda clase en Plaza Hidalgo con Roberto en el rebozo y 15 pesos.', quote: 'Octubre de 1958. Llegamos a la Ciudad de México con dos maletas de cartón amarradas con mecate. No teníamos miedo; la ciudad olía a castañas asadas.' },
    { freq: 950, year: '1966', title: 'Plaza de Santo Domingo', desc: 'La banda municipal tocando "Dios Nunca Muere" mientras perfecciona su Mole Negro con dos tablillas de chocolate.', quote: '1966: Para el Mole Negro, tostar los chiles chilhuacle al comal hasta quedar negros como el tizón, y apagar con agua fría de pozo.' },
    { freq: 1200, year: '1975', title: 'Bajo las Jacarandas', desc: 'Sintonizando "La Llorona" en su guitarra Paracho y las risas de sus hermanas grabadas en casete.', quote: 'Primavera de 1975 en Coyoacán. Elena afina su guitarra Paracho para cantar La Llorona: Ay de mí, Llorona, Llorona de azul celeste...' },
    { freq: 1400, year: '1982', title: 'La Mesa de la Cocina', desc: '"Nadie levanta la voz donde hay pan calientito. Coman primero, perdónense después."', quote: 'Regla de la casa en 1982: Nadie levanta la voz donde hay pan calientito. Coman primero, perdónense después.' },
    { freq: 1600, year: '2026', title: 'Frecuencia del Umbral (Gemma)', desc: 'Transmisión del espíritu: "Los muertos no mueren mientras su nombre se pronuncie con amor."', quote: 'Frecuencia de las Ánimas: Los muertos solo mueren cuando se les olvida. Mientras tú me recuerdes con alegría, aquí estaré a tu lado.' }
  ];

  // Initialize Altar
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

  // 1. Séance Mode (Thin the Veil)
  if (seanceToggleBtn) {
    seanceToggleBtn.addEventListener('click', () => {
      isSeanceActive = !isSeanceActive;
      document.body.classList.toggle('seance-mode', isSeanceActive);
      seanceToggleBtn.classList.toggle('active', isSeanceActive);

      if (window.toggleSeanceSmoke) {
        window.toggleSeanceSmoke(isSeanceActive);
      }

      if (isSeanceActive) {
        seanceToggleBtn.innerHTML = '🔮 Veil Thinned (Séance Active)';
        window.altarAudio.playOfferingChime();
        if (!window.altarAudio.isAmbientPlaying) {
          window.altarAudio.toggleAmbient();
          audioToggleBtn.innerHTML = '🔊 Ambient Sound: On';
          audioToggleBtn.classList.add('active');
        }
      } else {
        seanceToggleBtn.innerHTML = '🔮 Thin the Veil (Séance Mode)';
      }
    });
  }

  // 2. Radio Fantasma Tuning & Speech
  if (radioSlider) {
    radioSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      window.altarAudio.playRadioTuning(val);

      // Find closest station
      let closest = RADIO_STATIONS[0];
      let minDiff = 9999;
      RADIO_STATIONS.forEach(s => {
        const diff = Math.abs(s.freq - val);
        if (diff < minDiff) {
          minDiff = diff;
          closest = s;
        }
      });

      if (minDiff < 70) {
        radioFreqLabel.textContent = `${closest.freq} kHz (${closest.year}) - ${closest.title}`;
        radioFreqDesc.textContent = closest.desc;
        if (radioStatusText) radioStatusText.textContent = '● Frecuencia Sintonizada';
      } else {
        radioFreqLabel.textContent = `${val} kHz`;
        radioFreqDesc.textContent = 'Estática de radio analógica... Gira el sintonizador hacia 540, 700, 950, 1200, 1400 o 1600 kHz.';
        if (radioStatusText) radioStatusText.textContent = '';
      }
    });
  }

  if (radioListenBtn) {
    radioListenBtn.addEventListener('click', () => {
      const val = parseInt(radioSlider.value, 10);
      let closest = RADIO_STATIONS[0];
      let minDiff = 9999;
      RADIO_STATIONS.forEach(s => {
        const diff = Math.abs(s.freq - val);
        if (diff < minDiff) {
          minDiff = diff;
          closest = s;
        }
      });

      if (radioStatusText) radioStatusText.textContent = `Transfiriendo audio ${closest.freq} kHz...`;
      window.altarAudio.speakVintageRadio(closest.quote);
      setTimeout(() => {
        if (radioStatusText) radioStatusText.textContent = '● En el aire';
      }, 500);
    });
  }

  // 3. Sugar Skull Artisan Studio
  if (skullNameInput && skullNameDisplay) {
    skullNameInput.addEventListener('input', (e) => {
      const text = e.target.value.trim().toUpperCase() || 'ELENA';
      skullNameDisplay.textContent = text;
    });
  }

  icingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      icingButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedIcingColor = btn.getAttribute('data-color') || '#f59e0b';

      if (skullNameDisplay) {
        skullNameDisplay.style.boxShadow = `0 0 12px ${selectedIcingColor}`;
        skullNameDisplay.style.borderColor = selectedIcingColor;
      }
    });
  });

  if (blessSkullBtn) {
    blessSkullBtn.addEventListener('click', async (e) => {
      const name = (skullNameInput.value.trim().toUpperCase()) || 'ELENA';
      window.altarAudio.playOfferingChime();

      if (window.burstPetalsAt) {
        const rect = blessSkullBtn.getBoundingClientRect();
        window.burstPetalsAt(rect.left + rect.width / 2, rect.top, 20);
      }

      blessSkullBtn.disabled = true;
      blessSkullBtn.textContent = '✨ Bendiciendo...';

      try {
        await fetch('/api/altar/offerings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: 'skull_' + Date.now(),
            name: `Calavera de Azúcar: ${name}`,
            category: 'memento',
            description: `Calavera artesanal bendecida en azúcar real con glaseado real y el nombre de ${name}.`,
            icon: '💀'
          })
        });
        loadAltar();
      } catch (err) {
        console.error('Failed to place sugar skull:', err);
      } finally {
        setTimeout(() => {
          blessSkullBtn.disabled = false;
          blessSkullBtn.textContent = '✨ Bendecir y Colocar en Altar';
        }, 1200);
      }
    });
  }

  // 4. Sacred Letter Burning Ritual
  if (burnLetterBtn) {
    burnLetterBtn.addEventListener('click', async (e) => {
      const message = sacredLetterInput.value.trim();
      if (!message) {
        sacredLetterInput.focus();
        return;
      }

      const sender = letterSenderName.value.trim() || 'Tu Familia';
      const recipient = letterRecipientName.value.trim() || 'Elena';

      burnLetterBtn.disabled = true;
      burnLetterBtn.textContent = '🔥 Quemando en el altar...';

      // 1. Trigger flame audio and paper incinerate animation
      window.altarAudio.playLetterBurn();
      if (letterParchmentArea) {
        letterParchmentArea.classList.add('burning');
      }

      if (window.burstPetalsAt) {
        const rect = burnLetterBtn.getBoundingClientRect();
        window.burstPetalsAt(rect.left + rect.width / 2, rect.top, 28);
      }

      // Display in Gemma Chat Console
      appendUserMessage(`✉️ Carta entregada al fuego sagrado para ${recipient}:\n"${message}"`);
      appendGemmaThinking();

      try {
        const res = await fetch('/api/chat/letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message,
            recipient_name: recipient,
            sender_name: sender
          })
        });

        removeGemmaThinking();

        if (res.ok) {
          const data = await res.json();
          appendGemmaMessage(`
            <strong style="color: #fbbf24;">🕊️ Bendición de las Ánimas (Respuesta de ${data.recipient_name}):</strong><br><br>
            <div style="font-style: italic; line-height: 1.6; border-left: 2px solid #f59e0b; padding-left: 12px; margin-bottom: 8px;">
              ${data.blessing.replace(/\n\n/g, '<br><br>')}
            </div>
            <div class="trace-info">
              <span>✨ ${data.embers_released} chispas doradas ascendieron al cielo</span>
              <span>🛡️ Reverencia: 100% • Sentry Traced (${data.latency_ms} ms)</span>
            </div>
          `, data.blessing);
        } else {
          appendGemmaMessage('El fuego consumió la carta, pero la conexión espiritual tuvo una breve interrupción.');
        }
      } catch (err) {
        removeGemmaThinking();
        appendGemmaMessage('Tus palabras han sido entregadas al cielo en el humo sagrado del copal.');
      } finally {
        setTimeout(() => {
          if (letterParchmentArea) letterParchmentArea.classList.remove('burning');
          sacredLetterInput.value = '';
          burnLetterBtn.disabled = false;
          burnLetterBtn.innerHTML = '🔥 Entregar al Fuego Sagrado';
        }, 1300);
      }
    });
  }

  // 5. 3D Flip Card Toggle
  if (recipeFlipCard) {
    recipeFlipCard.addEventListener('click', () => {
      recipeFlipCard.classList.toggle('flipped');
    });
  }

  // 6. Timeline Nodes
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

  // 7. Cassette Playback Toggle
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

  // 8. Real-Time Waveform Visualizer
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

  // 9. Mode toggle (Cloud vs Air-Gapped Local)
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

  // 10. Audio ambient toggle
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

  // 11. Export Keepsake PDF
  exportBtn.addEventListener('click', () => {
    window.open('/api/memories/export', '_blank');
  });

  // 12. Modal open/close
  openModalBtn.addEventListener('click', () => modalBackdrop.classList.add('open'));
  closeModalBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
  });

  // 13. New offering form submit
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

  // 14. Chat submit
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

  // 15. Load Altar Status
  async function loadAltar() {
    try {
      const res = await fetch('/api/altar');
      if (!res.ok) return;
      const data = await res.json();

      // Check Cardinal Quadrant status
      const allLit = data.candles && data.candles.length === 4 && data.candles.every(c => c.is_lit);
      if (sacredQuadrantBanner) {
        if (allLit) {
          sacredQuadrantBanner.style.display = 'flex';
          if (!hadAllCandlesLit) {
            window.altarAudio.playSacredChord();
            hadAllCandlesLit = true;
          }
        } else {
          sacredQuadrantBanner.style.display = 'none';
          hadAllCandlesLit = false;
        }
      }

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

  // 16. Load Memories
  async function loadMemories() {
    try {
      const res = await fetch('/api/memories');
      if (!res.ok) return;
      const list = await res.json();

      memoriesContainer.innerHTML = '';
      list.forEach(m => {
        const item = document.createElement('div');
        item.className = 'memory-item';
        item.style.cursor = 'pointer';
        item.title = 'Click to consult Gemma about this memory';
        item.innerHTML = `
          <div class="memory-meta">
            <span class="memory-title">${m.title}</span>
            <span class="memory-year">${m.year || 'Recuerdo'}</span>
          </div>
          <div class="memory-body">${m.content}</div>
          <div class="memory-author">Registrado por: ${m.recorded_by || 'Familia'} • [${m.category.toUpperCase()}]</div>
        `;
        item.addEventListener('click', () => {
          handleUserQuery(`Cuéntame más sobre: "${m.title}" (${m.year || ''})`);
        });
        memoriesContainer.appendChild(item);
      });
    } catch (e) {
      console.error('Memories load failed:', e);
    }
  }

  // 17. Query Gemma Chronicler
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

    // Speech Synthesis read aloud button
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

  // ==========================================================
  // FLAGSHIP 1: CERILLOS LA CENTRAL MATCHBOX BINDING
  // ==========================================================
  const cerillosMatchbox = document.getElementById('cerillos-matchbox');
  const matchboxFrictionStrip = document.getElementById('matchbox-friction-strip');
  if (window.matchEngine && cerillosMatchbox && matchboxFrictionStrip) {
    window.matchEngine.bindMatchbox(cerillosMatchbox, matchboxFrictionStrip);
  }

  // ==========================================================
  // FLAGSHIP 2: CRT SPIRIT OSCILLOSCOPE
  // ==========================================================
  let spiritOsc = null;
  if (window.SpiritOscilloscope && document.getElementById('spirit-oscilloscope')) {
    spiritOsc = new window.SpiritOscilloscope('spirit-oscilloscope');

    document.querySelectorAll('.osc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.osc-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        spiritOsc.setMode(btn.getAttribute('data-mode'));
      });
    });

    const oscTimeKnob = document.getElementById('osc-time-knob');
    if (oscTimeKnob) {
      oscTimeKnob.addEventListener('input', (e) => {
        spiritOsc.setTimeDiv(e.target.value);
      });
    }
  }

  // ==========================================================
  // FLAGSHIP 3: 6-TRACK AMBIENT SOUNDSCAPE MIXER
  // ==========================================================
  const mixerPowerBtn = document.getElementById('mixer-power-btn');
  if (window.soundscapeMixer && mixerPowerBtn) {
    mixerPowerBtn.addEventListener('click', () => {
      const isPlaying = window.soundscapeMixer.togglePower();
      mixerPowerBtn.textContent = isPlaying ? '⏹ Apagar Consola' : '⚡ Encender Consola';
      mixerPowerBtn.style.background = isPlaying ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'linear-gradient(135deg, #10b981, #059669)';
    });

    // Track Faders & Mutes
    document.querySelectorAll('.mixer-channel-strip').forEach(strip => {
      const trackName = strip.getAttribute('data-track');
      const fader = strip.querySelector('.track-fader');
      const muteBtn = strip.querySelector('.channel-btn-mute');

      if (fader) {
        fader.addEventListener('input', (e) => {
          window.soundscapeMixer.setTrackVolume(trackName, e.target.value);
        });
      }
      if (muteBtn) {
        muteBtn.addEventListener('click', () => {
          const isMuted = window.soundscapeMixer.toggleMute(trackName);
          muteBtn.classList.toggle('muted', isMuted);
          muteBtn.textContent = isMuted ? 'UNMUTE' : 'Mute';
        });
      }
    });

    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        window.soundscapeMixer.applyPreset(preset);
        if (!window.soundscapeMixer.isPlaying) {
          mixerPowerBtn.click();
        }
      });
    });

    // Real-Time VU Meter Needle / Bar Loop
    setInterval(() => {
      if (window.soundscapeMixer && window.soundscapeMixer.isPlaying) {
        const vu = window.soundscapeMixer.getVULevel();
        document.querySelectorAll('.vu-meter-fill').forEach(fill => {
          fill.style.width = `${Math.min(100, Math.max(8, vu * 100 * (0.8 + Math.random() * 0.4)))}%`;
        });
      }
    }, 120);
  }

  // ==========================================================
  // FLAGSHIP 4: SUGAR SKULL SYMMETRY PAINTER
  // ==========================================================
  let skullPainter = null;
  if (window.SkullPainter && document.getElementById('skull-paint-canvas')) {
    skullPainter = new window.SkullPainter('skull-paint-canvas');

    document.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        skullPainter.setColor(btn.getAttribute('data-color'));
      });
    });

    document.querySelectorAll('.brush-btn[data-brush]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.brush-btn[data-brush]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        skullPainter.setBrushType(btn.getAttribute('data-brush'));
      });
    });

    const symBtn = document.getElementById('painter-sym-btn');
    if (symBtn) {
      symBtn.addEventListener('click', () => {
        const isSym = skullPainter.toggleSymmetry();
        symBtn.textContent = isSym ? '✨ Simetría: ON' : '✨ Simetría: OFF';
      });
    }

    const clearBtn = document.getElementById('painter-clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => skullPainter.clear());

    const exportBtnPng = document.getElementById('painter-export-btn');
    if (exportBtnPng) {
      exportBtnPng.addEventListener('click', () => {
        const dataUrl = skullPainter.exportPNG();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'calaverita_de_azucar_elena.png';
        a.click();
      });
    }

    const altarPlaceBtn = document.getElementById('painter-altar-btn');
    if (altarPlaceBtn) {
      altarPlaceBtn.addEventListener('click', async () => {
        altarPlaceBtn.disabled = true;
        altarPlaceBtn.textContent = 'Colocando en Altar...';
        if (window.altarAudio) window.altarAudio.playOfferingChime();

        try {
          await fetch('/api/altar/offerings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: 'painted_skull_' + Date.now(),
              name: 'Calaverita Pintada a Mano',
              category: 'memento',
              description: 'Calavera artesanal pintada en el taller con motivos simétricos de cempasúchil.',
              icon: '🎨'
            })
          });
          loadAltar();
        } catch (e) {
          console.error('Failed to place painted skull:', e);
        } finally {
          setTimeout(() => {
            altarPlaceBtn.disabled = false;
            altarPlaceBtn.textContent = '✨ Colocar en Altar';
          }, 1200);
        }
      });
    }
  }

  // ==========================================================
  // FLAGSHIP 5: 3D CELESTIAL CONSTELLATION OF SOULS
  // ==========================================================
  let celestialConstellation = null;
  if (window.CelestialConstellation && document.getElementById('constellation-canvas')) {
    celestialConstellation = new window.CelestialConstellation('constellation-canvas');
  }

  const addSoulBtn = document.getElementById('add-soul-btn');
  const soulModalBackdrop = document.getElementById('soul-modal-backdrop');
  const closeSoulModalBtn = document.getElementById('close-soul-modal-btn');
  const soulForm = document.getElementById('soul-form');

  if (addSoulBtn && soulModalBackdrop) {
    addSoulBtn.addEventListener('click', () => soulModalBackdrop.classList.add('open'));
    closeSoulModalBtn.addEventListener('click', () => soulModalBackdrop.classList.remove('open'));
    soulModalBackdrop.addEventListener('click', (e) => {
      if (e.target === soulModalBackdrop) soulModalBackdrop.classList.remove('open');
    });

    soulForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('soul-name').value.trim();
      const years = document.getElementById('soul-years').value.trim();
      const quote = document.getElementById('soul-quote').value.trim();

      if (!name) return;

      if (celestialConstellation) {
        celestialConstellation.addStar(name, years, quote, '#f59e0b');
      }
      if (window.altarAudio) window.altarAudio.playSacredChord();

      soulModalBackdrop.classList.remove('open');
      soulForm.reset();
    });
  }
});
