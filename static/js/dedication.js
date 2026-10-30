/**
 * dedication.js - Sovereign Family Altar Personalization
 * "Our ancestors do not belong to an API. Grief is not a SaaS metric."
 * Allows any family in the world to re-dedicate this altar to their own departed loved one,
 * swapping the portrait, biography, and life quote with 100% local persistence.
 * Zero bytes sent to any cloud server.
 */

class AltarDedicationEngine {
  constructor() {
    this.modal = document.getElementById("dedication-modal");
    this.openBtn = document.getElementById("btn-open-dedication-modal");
    this.closeBtn = document.getElementById("close-dedication-modal-btn");
    this.form = document.getElementById("dedication-form");
    this.resetBtn = document.getElementById("btn-reset-dedication");

    // Elements on page to update
    this.portraitImg = document.getElementById("ancestor-portrait");
    this.captionEl = document.querySelector(".portrait-caption");
    this.datesEl = document.querySelector(".portrait-dates");
    this.heroQuoteEl = document.querySelector(".hero-quote");
    this.heroAttrEl = document.querySelector(".hero-attribution");

    this.defaultAncestor = {
      name: "Elena Ramirez Solis",
      dates: "1938 – 2021 • Oaxaca & Coyoacán",
      quote: '"Our ancestors do not belong to an API. Grief is not a SaaS metric. We remember our loved ones not through corporate clouds, but through the warmth of memory and the eternal light of open innovation."',
      photoUrl: "/assets/abuela_portrait.jpg"
    };

    this.init();
  }

  init() {
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSave(e));
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.resetToDefault());
    }

    // Photo file preview
    const fileInput = document.getElementById("dedication-photo-file");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            this.previewPhotoUrl = evt.target.result;
            const previewImg = document.getElementById("dedication-photo-preview");
            if (previewImg) previewImg.src = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Load any saved family dedication from localStorage
    this.loadSavedDedication();
  }

  open() {
    if (!this.modal) return;
    if (window.soundFx) window.soundFx.cardFlip();

    const saved = this.getSavedData();
    const cur = saved || this.defaultAncestor;

    const nameInput = document.getElementById("dedication-name");
    const datesInput = document.getElementById("dedication-dates");
    const quoteInput = document.getElementById("dedication-quote");
    const previewImg = document.getElementById("dedication-photo-preview");

    if (nameInput) nameInput.value = cur.name;
    if (datesInput) datesInput.value = cur.dates;
    if (quoteInput) quoteInput.value = cur.quote;
    if (previewImg) previewImg.src = cur.photoUrl;

    this.modal.classList.add("open");
  }

  close() {
    if (this.modal) this.modal.classList.remove("open");
  }

  handleSave(e) {
    e.preventDefault();
    const name = document.getElementById("dedication-name").value.trim();
    const dates = document.getElementById("dedication-dates").value.trim();
    const quote = document.getElementById("dedication-quote").value.trim();
    const photoUrl = this.previewPhotoUrl || (document.getElementById("dedication-photo-preview") ? document.getElementById("dedication-photo-preview").src : this.defaultAncestor.photoUrl);

    if (!name) return;

    const data = { name, dates, quote, photoUrl };
    localStorage.setItem("ofrenda_family_dedication", JSON.stringify(data));

    this.applyDedication(data);
    this.close();

    if (window.soundFx) window.soundFx.sacredChime();

    // Show celebration banner
    const banner = document.getElementById("sacred-quadrant-banner");
    if (banner) {
      banner.style.display = "flex";
      const bannerText = document.getElementById("quadrant-banner-text");
      if (bannerText) {
        bannerText.innerHTML = `<strong>Altar Consagrado:</strong> El altar ahora honra la memoria de <em>${name}</em>. Su luz arde en el sagrado fuego de la familia.`;
      }
    }
  }

  resetToDefault() {
    localStorage.removeItem("ofrenda_family_dedication");
    this.applyDedication(this.defaultAncestor);
    this.close();
    if (window.soundFx) window.soundFx.clickWood();
  }

  getSavedData() {
    try {
      const raw = localStorage.getItem("ofrenda_family_dedication");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  loadSavedDedication() {
    const saved = this.getSavedData();
    if (saved) {
      this.applyDedication(saved);
    }
  }

  applyDedication(data) {
    if (this.captionEl) this.captionEl.textContent = data.name;
    if (this.datesEl) this.datesEl.textContent = data.dates;
    if (this.portraitImg && data.photoUrl) this.portraitImg.src = data.photoUrl;

    if (this.heroQuoteEl && data.quote) {
      this.heroQuoteEl.textContent = data.quote.startsWith('"') ? data.quote : `"${data.quote}"`;
    }

    if (this.heroAttrEl) {
      this.heroAttrEl.innerHTML = `— In loving honor of <strong>${data.name}</strong> (${data.dates}) • Click candles to light`;
    }

    // Set globally for Chronicler chat context
    window.currentHonoredAncestor = data.name;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.altarDedicationEngine = new AltarDedicationEngine();
});
