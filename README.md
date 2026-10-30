# 🌼 Ofrenda: Living Digital Altar & Oral History Vault
> **Honoring Ancestral Memory with Air-Gapped Open-Weight AI (Google Gemma 2)**  
> *Winner-Caliber Submission for the Hacktoberfest Open-Source AI Challenge: Week 4 — Ghost in the Machine*  
> Permissive MIT License • 100% Offline Capable • Privacy-Preserving • Zero Audio Sample Dependencies

![Ofrenda Altar](static/assets/hero_altar.jpg)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Google Gemma 2](https://img.shields.io/badge/AI%20Model-Google%20Gemma%202%20(2B%20%2F%209B)-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/gemma)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests Passing](https://img.shields.io/badge/Tests-9%20Passed-success.svg)](tests/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-ofrenda--living--altar.onrender.com-46E3B7.svg?logo=render&logoColor=white)](https://ofrenda-living-altar.onrender.com)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ish1416/ofrenda)
[![DEV Challenge](https://img.shields.io/badge/DEV-Hacktoberfest%20Week%204-black.svg?logo=devdotto&logoColor=white)](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)

---

## 💡 The Philosophy: Why Grief is Not a SaaS Product

Every year during **Día de los Muertos (November 1–2)**, families gather across Latin America to build *ofrendas*—traditional multi-tiered altars honoring deceased loved ones with candlelight, cempasúchil (marigolds), copal incense, and favorite meals.

Recently, closed commercial "AI memorial" apps have emerged, charging $20/month subscriptions to create chatbot avatars of departed family members. These proprietary services require uploading private family letters, photos, and voice notes to closed corporate clouds, where they are ingested for model training and held hostage behind recurring paywalls. If a startup goes bankrupt or your credit card expires, your loved one's digital presence is deleted.

**Our dead do not belong to an API. Grief is not a SaaS metric.**

**Ofrenda** is an open-source, air-gapped living digital altar, 3D celestial cosmos, and oral history memory vault built around **Google's open-weight Gemma model**. It runs on your own machine with the Wi-Fi disconnected and the lights off. Private family letters, sacred recipes, and audio recordings never touch a corporate server.

---

## 🏛️ System Architecture

```plaintext
                                ┌───────────────────────────────────────┐
                                │          TIER 1: EL CIELO             │
                                │   - Antique Portrait & 4 Candles      │
                                │   - Cerillos La Central Match Physics │
                                │   - 3D Celestial Cosmos of Souls      │
                                │   - Interactive Sahumerio de Copal    │
                                └───────────────────┬───────────────────┘
                                                    │
                     ┌──────────────────────────────┴──────────────────────────────┐
                     │                                                             │
      ┌──────────────┴──────────────┐                               ┌──────────────┴──────────────┐
      │      TIER 2: LA TIERRA      │                               │     TIER 3: LA MEMORIA      │
      │ - 3D Recipe Card (Flip)     │                               │ - Sacred Letter Burning     │
      │ - 1975 Cassette Player      │                               │ - Gemma Chronicler Console  │
      │ - Radio Fantasma Shortwave  │                               │ - 3D Lotería de Recuerdos   │
      │ - P31 Phosphor Oscilloscope │                               │ - Calaveritas Literarias    │
      │ - Sugar Skull Symmetry Canvas│                              │ - Libro de Recuerdos (PDF)  │
      │ - 6-Track Acoustic Console  │                               │ - High-Res Altar Share Poster│
      └─────────────────────────────┘                               └─────────────────────────────┘
```

---

## 🌟 The 12 Flagship Interactive Systems

1. **Tactile Drag-and-Strike Match Physics (`static/js/match.js`)**:
   - Realistic friction-based match ignition against a vintage box of *Cerillos La Central*.
   - Dynamic spark particle generation based on cursor drag velocity.
   - Dynamic flame trail responding to drag movement and colliding with unlit beeswax candles.

2. **Camino de Cempasúchil & Footprints of the Ánimas (`static/js/camino.js`)**:
   - Drag or click to scatter glowing marigold petals with dynamic 3D gradient shading, organic rotation, and golden pollen dust.
   - 1-Click *Sembrar Camino Sagrado* sows a dense, fragrant pathway guiding wandering spirits.
   - *Invocar Huellas de las Ánimas* animates ethereal glowing golden footsteps pacing up the pathway, culminating in an ancestral portrait bloom and sacred chimes.

3. **Sovereign Family Altar Personalization (`static/js/dedication.js`)**:
   - Re-dedicate the altar to any departed ancestor (parent, grandparent, loved one) with custom photo upload, dates, and life quotes.
   - 100% sovereign browser-local persistence (`localStorage`) — zero bytes sent to external cloud servers.
   - Dynamically adapts the Gemma Chronicler context to converse about your personal family history.

4. **3D Celestial Constellation of Souls (`static/js/constellation.js`)**:
   - Mathematical 3D-to-2D spherical coordinate projection (`r, θ, φ`) rendered at 60 FPS on canvas.
   - Full mouse drag orbit rotation, depth sorting, and hover tooltips for ancestor stars.
   - Live modal to enshrine custom family souls into the eternal star field.

5. **Interactive Copal Sahumerio (`static/js/copal.js`)**:
   - Pre-Hispanic clay incense burner emitting fluid particle smoke.
   - Mouse fanning physics: cursor velocity swirls and disperses the smoke plumes.
   - One-click sacred purification blessing over Elena's portrait.

6. **CRT Phosphor Oscilloscope (`static/js/oscilloscope.js`)**:
   - P31 green phosphor CRT oscilloscope with realistic phosphor decay persistence and scanline raster.
   - 3 interactive visualizer modes: `Lissajous`, `Waveform`, and `Spectrum`.

7. **Sugar Skull Symmetry Painter (`static/js/painter.js`)**:
   - Craniofacial sugar skull canvas with bilateral horizontal symmetry (`symX = cx + (cx - x)`).
   - 6 traditional palettes (Cempasúchil, Bougainvillea, Jade, Turquoise, Violet, Obsidian) and 3 brush dynamics.
   - 1-click export and consecrated placement directly on the living altar.

8. **6-Track Procedural Acoustic Soundscape Console (`static/js/mixer.js`)**:
   - 100% Web Audio mathematical sound synthesis with zero external MP3 samples.
   - Channels: *Velas & Fuego, Lluvia Tejas, Paracho Acústica, Viento Copal, Campanas Catedral, Grillos Oaxaca*.
   - Vertical faders, mute toggles, live VU meter, and presets (*Vigilia*, *Lluvia Coyoacán*, *Paz Sagrada*).

9. **Radio Fantasma: Shortwave Spirit Transceiver**:
   - Analog vacuum-tube radio dial tuning frequencies from 1938 to 2026.
   - Real-time bandpass filtering and synthesized heterodyne static dissolving into Elena's memories.

10. **✉️ Quemar Carta a las Ánimas (Sacred Memory Ritual)**:
    - Type an unsaid letter to departed loved ones and deliver it to the holy fire.
    - Amber paper incineration animation with rising embers and procedural flame crackle.
    - Gemma receives the words and composes an intimate maternal ancestral blessing.

11. **🃏 Lotería de los Recuerdos (`static/js/loteria.js`)**:
    - 8 authentic Mexican folk cards with 3D flip physics and procedural card whoosh audio.
    - **Gemma Oracle Consultation**: Click *Pedir Consejo a Abuela Elena* for poetic guidance.

12. **🕯️ Vigilia Sagrada: Noche de Muertos (`static/js/vigil.js`)**:
    - Dims the screen into midnight darkness with an interactive volumetric lantern spotlight following the cursor.
    - Real-time radial illumination punch-outs revealing candle halos and the ancestor portrait.

13. **✨ High-Resolution Altar Poster Generator (`static/js/share.js`)**:
    - Renders a 1200x800 golden baroque commemorative poster combining your painted calavera, lit candles, and tribute.
    - 1-click PNG download and instant social sharing to Twitter/X, LinkedIn, and DEV.

14. **Procedural Micro-Sound FX Engine (`static/js/audio_fx.js`)**:
    - Tactile procedural audio for wooden clicks, card flips, sacred chimes, dial ticks, petal rustles, and spirit footsteps.

---

## 🚀 Quick Start (Local Setup)

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/ish1416/ofrenda.git
cd ofrenda

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. (Optional) Run with Local Ollama Gemma
To run 100% air-gapped without internet access:
```bash
# Pull and run Google Gemma locally
ollama run gemma2:9b
```

### 3. Start the Server
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your browser.

---

## 🧪 Running Automated Tests

Ofrenda includes a complete pytest suite verifying API endpoints, candle state toggles, memory persistence, reverence guardrails, and letter blessings:

```bash
./venv/bin/pytest -v
```

Output:
```plaintext
tests/test_api.py::test_health_check PASSED                              [ 11%]
tests/test_api.py::test_get_altar PASSED                                 [ 22%]
tests/test_api.py::test_toggle_candle PASSED                             [ 33%]
tests/test_api.py::test_list_and_add_memory PASSED                       [ 44%]
tests/test_api.py::test_export_keepsake_html PASSED                      [ 55%]
tests/test_api.py::test_burn_sacred_letter PASSED                        [ 66%]
tests/test_guardrails.py::test_reverence_query_mole PASSED               [ 77%]
tests/test_guardrails.py::test_reverence_guardrail_filters_ads PASSED    [ 88%]
tests/test_guardrails.py::test_calaverita_generation PASSED              [100%]

========================= 9 passed in 0.46s =========================
```

---

## 📄 License

This project is open-source under the permissive [MIT License](LICENSE).
In loving memory of Elena Ramirez Solis (1938–2021).
*Nadie muere mientras se le recuerde con amor.* 🌼🕯️💀
