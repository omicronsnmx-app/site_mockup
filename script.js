// LANGUAGE TOGGLE
function setLang(lang) {
  document.querySelectorAll('[data-es]').forEach(el => {
    el.innerHTML = el.getAttribute('data-' + lang);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.documentElement.lang = lang;
}

// POPUP
function showPopup() {
  if (sessionStorage.getItem('popupShown')) return;
  document.getElementById('popup').classList.add('active');
  sessionStorage.setItem('popupShown', 'true');
}
function closePopup() {
  document.getElementById('popup').classList.remove('active');
}
setTimeout(showPopup, 2500);

// GOAL CLICK
function goalClick(goal) {
  const msg = encodeURIComponent('Hola Zane, mi objetivo es: ' + goal + '. Quiero agendar mi primer entreno.');
  window.open('https://wa.me/526634307405?text=' + msg, '_blank');
}

// CLOSE POPUP ON ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopup();
});

// DESCARGA GUÍA
(function() {
  var form = document.getElementById('guiaForm');
  if (!form) return;
  var success = document.getElementById('guiaSuccess');
  var pdfUrl = './omicron_guia_entrenamiento.pdf';

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var data = new FormData(form);

    // abre PDF imediatamente em nova aba (dentro do click pra popup blocker permitir)
    window.open(pdfUrl, '_blank');

    // envia email pro formspree em background
    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function() {
      form.style.display = 'none';
      success.classList.add('show');
    }).catch(function() {
      // mesmo se falhar o email, o PDF ja abriu
      form.style.display = 'none';
      success.classList.add('show');
    });
  });
})();

/* ========== SUP-FORM HANDLER (envia pedido suplemento pro WhatsApp) ========== */
function submitSupForm(e) {
  e.preventDefault();
  var cat = document.getElementById('sup-cat').value;
  var brand = document.getElementById('sup-brand').value.trim();
  var goal = document.getElementById('sup-goal').value.trim();
  var wa = document.getElementById('sup-wa').value.trim();
  var msg = 'Hola Zane, busco suplemento.\n\n';
  msg += '• Categoría: ' + cat + '\n';
  if (brand) msg += '• Marca preferida: ' + brand + '\n';
  if (goal) msg += '• Objetivo: ' + goal + '\n';
  if (wa) msg += '• Mi WhatsApp: ' + wa + '\n';
  msg += '\n¿Puedes ayudarme con el mejor precio?';
  window.open('https://wa.me/526634307405?text=' + encodeURIComponent(msg), '_blank');
  return false;
}

/* ========== SCROLL REVEAL (animacao suave ao entrar no viewport) ========== */
(function() {
  if (typeof IntersectionObserver === 'undefined') return;

  // aplica a classe 'reveal' automaticamente em elementos chave
  var selectors = [
    '.section-eyebrow',
    '.section-title',
    '.section-sub',
    '.card',
    '.obj-card',
    '.hist-block',
    '.res-card',
    '.gym-bullets li',
    '.app-ctas .btn',
    '.guia-headline',
    '.gym-headline',
    '.gym-tagline'
  ];

  // aplica .reveal com delays escalonados por grupos
  selectors.forEach(function(sel) {
    var els = document.querySelectorAll(sel);
    els.forEach(function(el, i) {
      el.classList.add('reveal');
      var delay = Math.min(i % 6 + 1, 6);
      el.classList.add('reveal-delay-' + delay);
    });
  });

  // observa e ativa quando entra no viewport
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
})();

/* ========== SMOOTH SCROLL pra anchor links ========== */
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
/* ========== CACHE BUSTER DINAMICO PRA DESENVOLVIMENTO ==========
   Adiciona timestamp em todas as imagens ao carregar a pagina.
   Tu pode substituir qualquer foto na pasta /images/ e basta dar F5,
   nunca mais precisa mexer em codigo nem fazer hard refresh.
   
   Em producao (quando publicar online), pode tirar esse script
   ou deixar (custo minimo).
================================================================ */
(function() {
  var t = Date.now();
  // pega todos os elementos com style inline contendo background-image
  document.querySelectorAll('[style*="background-image"]').forEach(function(el) {
    var style = el.getAttribute('style');
    if (style && style.indexOf("./images/") > -1) {
      var newStyle = style.replace(/url\(['"]?(\.\/images\/[^'")\?]+)(\?[^'")]*)?['"]?\)/g,
        function(match, file) {
          return "url('" + file + "?t=" + t + "')";
        }
      );
      el.setAttribute('style', newStyle);
    }
  });
})();
