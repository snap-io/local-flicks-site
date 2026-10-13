// LocalFlix site: mobile menu toggle and spam-resistant email reveal.
// No tracking, no third-party code.
(function () {
  // ── Mobile menu ─────────────────────────────────────────────────────────
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });

    // Close after choosing a section, or on Escape.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // ── Store switcher (download section) ───────────────────────────────────
  // Selecting a store shows its QR code (computers only; the QR is hidden on
  // phones) and updates the status line (all screen sizes).
  // Before launch the controls are <button>s, so selecting is all they do.
  // After launch a live store becomes an <a href="store URL">: on a phone it
  // opens the store; on a computer it switches the QR code instead.
  var storeControls = document.querySelectorAll('.store[data-qr]');
  var qrPanels = document.querySelectorAll('[data-qr-panel]');
  var storeStatus = document.getElementById('store-status');
  var qrArea = document.querySelector('.qr');
  // Ask the page whether the QR area is actually shown, so this always agrees with the CSS.
  var qrIsShown = function () { return !!qrArea && getComputedStyle(qrArea).display !== 'none'; };

  var selectStore = function (key) {
    storeControls.forEach(function (c) {
      c.setAttribute('aria-pressed', c.dataset.qr === key ? 'true' : 'false');
    });
    qrPanels.forEach(function (p) {
      p.hidden = p.dataset.qrPanel !== key;
    });
    if (storeStatus) {
      var text = storeStatus.getAttribute('data-status-' + key);
      if (text) storeStatus.textContent = text;
    }
  };

  storeControls.forEach(function (control) {
    control.addEventListener('click', function (e) {
      var isStoreLink = control.tagName === 'A' && control.getAttribute('href') &&
        control.getAttribute('href').charAt(0) !== '#';
      if (isStoreLink && !qrIsShown()) return; // phone after launch: open the store
      e.preventDefault();
      selectStore(control.dataset.qr);
    });
  });

  // ── Email reveal ────────────────────────────────────────────────────────
  // The address is never in the page source: it is stored reversed and split
  // across two attributes, and only assembled after a real click. This stops
  // the automated harvesters that scan pages for "name@domain" and mailto links.
  var reverse = function (s) { return s.split('').reverse().join(''); };

  document.querySelectorAll('.reveal-email').forEach(function (button) {
    button.addEventListener('click', function () {
      var address = reverse(button.dataset.u) + '@' + reverse(button.dataset.d);
      var subject = button.dataset.subject ? '?subject=' + encodeURIComponent(button.dataset.subject) : '';

      var link = document.createElement('a');
      link.className = 'email-revealed';
      link.href = 'mailto:' + address + subject;
      link.textContent = address;
      button.replaceWith(link);
      link.focus();
    });
  });
})();
