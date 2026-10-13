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
