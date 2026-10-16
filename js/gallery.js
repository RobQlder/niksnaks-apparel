// Renders the shirt gallery from shirts.json, with category filters and a lightbox.
(function () {
  var PLATES = ['yellow', 'teal', 'pink', 'purple', 'orange'];
  var grid = document.getElementById('grid');
  var filters = document.getElementById('filters');
  var lightbox = null;
  var data = null;

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function card(shirt, i) {
    var plate = PLATES[i % PLATES.length];
    var title = esc(shirt.name);
    var caption = esc(shirt.caption);
    return '<div class="col">' +
      '<a class="nn-card glightbox" href="images/full/' + esc(shirt.image) + '" data-gallery="shirts"' +
      ' data-title="' + title + '" data-description="' + caption + '">' +
      (shirt.new ? '<span class="nn-sticker" aria-label="New"><span>New</span></span>' : '') +
      '<img src="images/thumbs/' + esc(shirt.image) + '" alt="' + title + ' t-shirt" loading="lazy" width="700" height="700">' +
      '<div class="nn-plate nn-plate--' + plate + '"><h3>' + title + '</h3><p>' + caption + '</p></div>' +
      '</a></div>';
  }

  function render(category) {
    var shirts = data.shirts.filter(function (s) { return category === 'all' || s.category === category; });
    grid.innerHTML = shirts.map(card).join('');
    if (lightbox) lightbox.reload();
    else lightbox = GLightbox({ selector: '.glightbox', loop: true, touchNavigation: true });
  }

  function buildFilters() {
    var cats = [{ id: 'all', label: 'All' }].concat(data.categories || []);
    filters.innerHTML = cats.map(function (c, i) {
      return '<button type="button" class="nn-pill" data-cat="' + esc(c.id) + '" aria-pressed="' + (i === 0) + '">' + esc(c.label) + '</button>';
    }).join('');
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.nn-pill');
      if (!btn) return;
      filters.querySelectorAll('.nn-pill').forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
      render(btn.dataset.cat);
    });
  }

  fetch('shirts.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (json) {
      data = json;
      if (json.collection) document.getElementById('collection-name').textContent = json.collection;
      buildFilters();
      render('all');
    })
    .catch(function () { document.getElementById('empty').classList.remove('d-none'); });
})();
