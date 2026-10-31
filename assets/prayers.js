// Loads the prayer list chosen in Admin and checks for a new one every minute.
// The last list is kept on this computer, so a screen keeps working if the internet drops.
window.PrayerList = (function () {
  var KEY = 'lcyg-prayers';

  function cached() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
      return null;
    }
  }
  function remember(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {}
  }
  function load() {
    return fetch('/api/prayers', { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function watch(onList) {
    var shownKey = null;
    function apply(list) {
      if (!list || !Array.isArray(list.items)) return;
      var items = list.items.map(function (s) { return String(s).trim(); }).filter(Boolean);
      var key = list.id + ':' + items.join('\n');
      if (key === shownKey) return;
      shownKey = key;
      onList({ id: list.id, name: list.name, items: items });
    }
    apply(cached());
    (function poll() {
      load()
        .then(function (list) {
          remember(list);
          apply(list);
        })
        .catch(function () {})
        .then(function () {
          setTimeout(poll, 60000);
        });
    })();
  }

  return { watch: watch, load: load };
})();
