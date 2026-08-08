/* Every control on this page is a mockup: clicking anything reports a network error. */
(function () {
  var HIDE_AFTER = 5000;
  var toast = null;
  var hideTimer = null;
  var nudgeTimer = null;

  function build() {
    var el = document.createElement('div');
    el.className = 'net-toast';
    el.setAttribute('role', 'alert');
    el.innerHTML =
      '<svg class="net-toast__icon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="10"/><path d="M12 7v6"/><path d="M12 16.4v.1"/>' +
      '</svg>' +
      '<div class="net-toast__body">' +
        '<p class="net-toast__title">Network error</p>' +
        '<p class="net-toast__text">Could not connect to credly.com. Check your internet connection and try again.</p>' +
      '</div>' +
      '<button class="net-toast__close" type="button" aria-label="Dismiss">&times;</button>';

    el.querySelector('.net-toast__close').addEventListener('click', hide);
    document.body.appendChild(el);
    return el;
  }

  function hide() {
    clearTimeout(hideTimer);
    if (toast) { toast.classList.remove('is-open'); }
  }

  function show() {
    if (!toast) { toast = build(); }

    if (toast.classList.contains('is-open')) {
      // already up: nudge it so a repeat click still registers
      toast.classList.remove('is-nudge');
      void toast.offsetWidth;
      toast.classList.add('is-nudge');
      clearTimeout(nudgeTimer);
      nudgeTimer = setTimeout(function () { toast.classList.remove('is-nudge'); }, 300);
    } else {
      // force a reflow so the transition runs on first show
      void toast.offsetWidth;
      toast.classList.add('is-open');
    }

    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_AFTER);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.net-toast')) { return; }
    if (!e.target.closest('a, button, .search input')) { return; }
    e.preventDefault();
    show();
  });

  // middle-click would otherwise open the real URL in a new tab
  document.addEventListener('auxclick', function (e) {
    if (e.button !== 1 || !e.target.closest('a')) { return; }
    e.preventDefault();
    show();
  });

  var search = document.querySelector('.search input');
  if (search) {
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); show(); }
    });
  }
})();
