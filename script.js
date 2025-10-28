const App = {
  cacheDom() {
    this.dom = {
      countdown: document.getElementById('countdown'),
      stockCount: document.getElementById('stock-count'),
      stockBar: document.getElementById('stock-bar'),
      liveCounter: document.getElementById('live-counter'),
      thumbnails: Array.from(document.querySelectorAll('.thumb')),
      mainImage: document.getElementById('main-image'),
      mainDesktopSource: document.querySelector('[data-role="main-desktop"]'),
      mainMobileSource: document.querySelector('[data-role="main-mobile"]'),
      colorButtons: Array.from(document.querySelectorAll('[data-group="color"]')),
      sizeButtons: Array.from(document.querySelectorAll('[data-group="size"]')),
      summaryColor: Array.from(document.querySelectorAll('[data-role="summary-color"]')),
      summarySize: Array.from(document.querySelectorAll('[data-role="summary-size"]')),
      inputColor: Array.from(document.querySelectorAll('[data-role="input-color"]')),
      inputSize: Array.from(document.querySelectorAll('[data-role="input-size"]')),
      quickOrder: document.getElementById('quick-order'),
      orderForm: document.getElementById('order-form'),
      toast: document.getElementById('toast'),
      sizeGuideTrigger: document.getElementById('size-guide-trigger'),
      sizeGuide: document.getElementById('size-guide'),
      sizeGuideClose: document.getElementById('close-size-guide'),
      accordions: Array.from(document.querySelectorAll('.accordion__trigger')),
      navbar: document.getElementById('navbar'),
      navCta: document.getElementById('nav-cta'),
      footerCta: document.getElementById('footer-cta'),
      mobileCta: document.getElementById('mobile-cta'),
      mobileBar: document.getElementById('mobile-bar'),
      beforeAfterRange: document.getElementById('before-after-range'),
      afterOverlay: document.getElementById('after-overlay'),
      beforeAfterDivider: document.getElementById('before-after-divider'),
    };
  },

  init() {
    this.cacheDom();
    this.initCountdown();
    this.initStock();
    this.initLiveCounter();
    this.initThumbnails();
    this.initSelectors();
    this.initForms();
    this.initSizeGuide();
    this.initAccordions();
    this.initNavigation();
    this.initMobileBar();
    this.initBeforeAfter();
  },

  showToast(message) {
    const toast = this.dom.toast;
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('is-visible');
    window.clearTimeout(this.toastTimeout);
    this.toastTimeout = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => {
        toast.hidden = true;
      }, 180);
    }, 3200);
  },

  initCountdown() {
    const el = this.dom.countdown;
    if (!el) return;
    const duration = 15 * 60 * 1000;
    const tick = (start) => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(duration - elapsed, 0);
      const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
      el.textContent = `${minutes}:${seconds}`;
      if (remaining > 0) {
        requestAnimationFrame(() => tick(start));
      } else {
        this.showToast('La oferta se renovó por tiempo limitado. ¡Aprovecha ahora!');
        requestAnimationFrame(() => tick(Date.now()));
      }
    };
    tick(Date.now());
  },

  initStock() {
    const { stockCount, stockBar } = this.dom;
    if (!stockCount || !stockBar) return;
    const stock = Math.floor(Math.random() * 9) + 14; // 14 - 22
    stockCount.textContent = stock;
    const ratio = Math.min(stock / 24, 1);
    stockBar.style.setProperty('--stock-level', ratio.toFixed(2));
  },

  initLiveCounter() {
    const el = this.dom.liveCounter;
    if (!el) return;
    let current = Number(el.textContent) || Math.floor(Math.random() * 10) + 30;
    const clamp = (value) => Math.min(Math.max(value, 18), 58);
    window.setInterval(() => {
      const variation = Math.floor(Math.random() * 5) - 2;
      current = clamp(current + variation);
      el.textContent = current;
    }, 6000 + Math.random() * 4000);
  },

  initThumbnails() {
    const { thumbnails, mainImage, mainDesktopSource, mainMobileSource } = this.dom;
    if (!thumbnails.length || !mainImage) return;
    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach((btn) => btn.classList.remove('is-active'));
        thumb.classList.add('is-active');
        const src = thumb.dataset.image;
        const desktop = thumb.dataset.desktop || thumb.dataset.hires || src;
        const mobile = thumb.dataset.mobile || src;
        const alt = thumb.dataset.alt;
        if (src) {
          mainImage.src = src;
          if (alt) {
            mainImage.alt = alt;
          }
          if (mainDesktopSource && desktop) {
            mainDesktopSource.srcset = desktop;
          }
          if (mainMobileSource && mobile) {
            mainMobileSource.srcset = mobile;
          }
        }
      });
    });
  },

  updateColor(value) {
    this.dom.summaryColor.forEach((node) => {
      node.textContent = value;
    });
    this.dom.inputColor.forEach((node) => {
      node.value = value;
    });
  },

  updateSize(value) {
    this.dom.summarySize.forEach((node) => {
      node.textContent = value;
    });
    this.dom.inputSize.forEach((node) => {
      node.value = value;
    });
  },

  initSelectors() {
    const { colorButtons, sizeButtons } = this.dom;
    if (colorButtons.length) {
      colorButtons.forEach((button) => {
        button.addEventListener('click', () => {
          colorButtons.forEach((btn) => btn.classList.remove('is-active'));
          button.classList.add('is-active');
          this.updateColor(button.dataset.value);
        });
      });
    }

    if (sizeButtons.length) {
      sizeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          sizeButtons.forEach((btn) => btn.classList.remove('is-active'));
          button.classList.add('is-active');
          this.updateSize(button.dataset.value);
        });
      });
    }
  },

  initForms() {
    const handleSubmit = (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const name = formData.get('nombre') || 'Tu pedido';
      const color = formData.get('color');
      const size = formData.get('talla');
      this.showToast(`¡${name} ha sido reservado! Color ${color}, talla ${size}. Te contactaremos enseguida.`);
      form.reset();
      const selectedColor = this.dom.colorButtons.find((btn) => btn.classList.contains('is-active'));
      const selectedSize = this.dom.sizeButtons.find((btn) => btn.classList.contains('is-active'));
      this.updateColor(selectedColor ? selectedColor.dataset.value : 'Canela');
      this.updateSize(selectedSize ? selectedSize.dataset.value : 'S');
    };

    if (this.dom.quickOrder) this.dom.quickOrder.addEventListener('submit', handleSubmit);
    if (this.dom.orderForm) this.dom.orderForm.addEventListener('submit', handleSubmit);
  },

  initSizeGuide() {
    const { sizeGuide, sizeGuideTrigger, sizeGuideClose } = this.dom;
    if (!sizeGuide || !sizeGuideTrigger || !sizeGuideClose) return;
    const toggle = (show) => {
      sizeGuide.hidden = !show;
    };
    sizeGuideTrigger.addEventListener('click', () => toggle(true));
    sizeGuideClose.addEventListener('click', () => toggle(false));
    sizeGuide.addEventListener('click', (event) => {
      if (event.target === sizeGuide) toggle(false);
    });
  },

  initAccordions() {
    this.dom.accordions.forEach((trigger) => {
      const content = trigger.nextElementSibling;
      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
        if (!expanded) {
          content.style.maxHeight = `${content.scrollHeight}px`;
        } else {
          content.style.maxHeight = '0px';
        }
      });
    });
  },

  initNavigation() {
    const { navbar, navCta, footerCta, mobileCta } = this.dom;
    const scrollToOrder = () => {
      const section = document.getElementById('pedido');
      section?.scrollIntoView({ behavior: 'smooth' });
    };

    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          navbar.classList.add('is-compact');
        } else {
          navbar.classList.remove('is-compact');
        }
      });
    }

    navCta?.addEventListener('click', scrollToOrder);
    footerCta?.addEventListener('click', scrollToOrder);
    mobileCta?.addEventListener('click', scrollToOrder);
  },

  initMobileBar() {
    const bar = this.dom.mobileBar;
    if (!bar) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 320 && current > lastScroll) {
        bar.classList.add('is-visible');
      } else if (current < 220) {
        bar.classList.remove('is-visible');
      }
      lastScroll = current;
    });
  },

  initBeforeAfter() {
    const { beforeAfterRange, afterOverlay, beforeAfterDivider } = this.dom;
    if (!beforeAfterRange || !afterOverlay || !beforeAfterDivider) return;
    const setPosition = (value) => {
      afterOverlay.style.setProperty('--position', `${value}%`);
      beforeAfterDivider.style.setProperty('--divider-position', `${value}%`);
    };
    setPosition(beforeAfterRange.value);
    beforeAfterRange.addEventListener('input', (event) => {
      setPosition(event.target.value);
    });
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
