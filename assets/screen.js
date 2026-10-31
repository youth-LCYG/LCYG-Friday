// F turns full screen on and off (also works while the keyboard is set to Korean).
// Elements marked data-autohide (the link back to the hub) show when the mouse moves, then fade out.
(function () {
  addEventListener('keydown', function (e) {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.code !== 'KeyF' && e.key !== 'f' && e.key !== 'F' && e.key !== 'ㄹ') return;
    e.preventDefault();
    var d = document;
    var el = d.documentElement;
    var r = d.fullscreenElement || d.webkitFullscreenElement
      ? (d.exitFullscreen || d.webkitExitFullscreen).call(d)
      : (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    if (r && r.catch) r.catch(function () {});
  });

  if (document.querySelector('[data-autohide]')) {
    var timer;
    var wake = function () {
      document.body.classList.add('awake');
      clearTimeout(timer);
      timer = setTimeout(function () {
        document.body.classList.remove('awake');
      }, 2500);
    };
    addEventListener('mousemove', wake);
    addEventListener('touchstart', wake, { passive: true });
    wake();
  }
})();
