// Scatters stars into every element with data-stars="<how many>".
// data-stars-band="0.15" keeps them in the top part of the box; data-twinkle lets a few big ones twinkle.
(function () {
  function seeded(seed) {
    return function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
  document.querySelectorAll('[data-stars]').forEach(function (box, n) {
    var count = parseInt(box.getAttribute('data-stars'), 10) || 60;
    var band = parseFloat(box.getAttribute('data-stars-band') || '1');
    var twinkle = box.hasAttribute('data-twinkle');
    var rnd = seeded(3 + n * 17);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var star = document.createElement('i');
      var big = twinkle && rnd() < 0.1;
      var size = big ? 3 : rnd() < 0.5 ? 1.5 : 2;
      star.style.left = (rnd() * 100).toFixed(2) + '%';
      star.style.top = (Math.pow(rnd(), 1.6) * 100 * band).toFixed(2) + '%';
      star.style.width = star.style.height = size + 'px';
      star.style.opacity = big ? '0.95' : (0.2 + rnd() * 0.45).toFixed(2);
      if (big) {
        star.style.boxShadow = '0 0 6px 1px rgba(182, 225, 243, 0.6)';
        star.style.animation = 'tw ' + (4 + rnd() * 3).toFixed(1) + 's ease-in-out ' + (rnd() * 4).toFixed(1) + 's infinite';
      }
      frag.appendChild(star);
    }
    box.appendChild(frag);
  });
})();
