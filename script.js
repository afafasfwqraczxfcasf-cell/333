/* ===========================================================
   Academia de Natación Diyer — comportamiento
   =========================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;

  /* ---------- Tema día / noche ---------- */
  var btnTema = document.getElementById('tema');

  function pintarTema(t) {
    raiz.setAttribute('data-tema', t);
    if (btnTema) {
      btnTema.setAttribute('aria-label', t === 'noche' ? 'Cambiar a modo día' : 'Cambiar a modo noche');
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'noche' ? '#02152c' : '#06284F');
  }

  if (btnTema) {
    btnTema.addEventListener('click', function () {
      var nuevo = raiz.getAttribute('data-tema') === 'noche' ? 'dia' : 'noche';
      pintarTema(nuevo);
      try { localStorage.setItem('diyer-tema', nuevo); } catch (e) {}
    });
  }

  /* ---------- Barra al hacer scroll ---------- */
  var barra = document.getElementById('barra');
  var ticking = false;

  function alScroll() {
    if (barra) barra.classList.toggle('pegada', window.scrollY > 40);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(alScroll); }
  }, { passive: true });
  alScroll();

  /* ---------- Menú móvil ---------- */
  var btnMenu = document.getElementById('menu');
  var nav = document.getElementById('nav');

  function cerrarMenu() {
    if (!nav) return;
    nav.classList.remove('abierto');
    document.body.classList.remove('bloqueo');
    if (btnMenu) btnMenu.setAttribute('aria-expanded', 'false');
  }

  if (btnMenu && nav) {
    btnMenu.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      document.body.classList.toggle('bloqueo', abierto);
      btnMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      btnMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    /* Si la ventana crece hasta el punto en que el menú vuelve a ser
       una barra horizontal, aseguramos que quede en estado limpio. */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) cerrarMenu();
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('abierto')) return;
      if (nav.contains(e.target) || btnMenu.contains(e.target)) return;
      cerrarMenu();
    });
  }

  /* ---------- Enlace activo según la sección visible ---------- */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var secciones = enlaces
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && secciones.length) {
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (ent) {
        if (!ent.isIntersecting) return;
        enlaces.forEach(function (a) {
          a.classList.toggle('activo', a.getAttribute('href') === '#' + ent.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secciones.forEach(function (s) { vigia.observe(s); });
  }

  /* ---------- Guía: dos preguntas y una recomendación ---------- */
  var panel = document.getElementById('guia-panel');

  if (panel) {
    var pasos = panel.querySelectorAll('.paso');
    var eleccion = { quien: null, meta: null };

    var WA = 'https://wa.me/573108731095?text=';

    var programas = {
      bebe: {
        t: 'Matronatación, en la sede El Buque',
        d: 'Para bebés de 6 a 30 meses, con mamá o papá dentro del agua. Se trabaja adaptación, flotación asistida y estimulación motriz en sesiones de 30 minutos.',
        m: 'Hola Diyer, tengo un bebé y me interesa la matronatación en la sede El Buque. ¿Qué horarios y cupos hay?'
      },
      ninoMiedo: {
        t: 'Clases para niños, empezando por Ambientación',
        d: 'El primer nivel de la ruta: entrar al agua sin miedo, mojarse la cara, soplar burbujas y soltarse del borde. Todo en formato de juego.',
        m: 'Hola Diyer, mi hijo/a le tiene miedo al agua y quiero empezar en el nivel de ambientación. ¿Qué horarios tienen?'
      },
      ninoAprender: {
        t: 'Clases para niños, ruta completa',
        d: 'Arranca en el nivel que le corresponda y avanza por propulsión, respiración y técnica. Clases de 30 a 45 minutos según la edad.',
        m: 'Hola Diyer, quiero que mi hijo/a aprenda a nadar. ¿Cómo hago para que lo evalúen y saber en qué nivel va?'
      },
      ninoTecnica: {
        t: 'Clases para niños, nivel Técnica',
        d: 'Para quien ya se desplaza solo: los cuatro estilos, viradas, distancia y disciplina deportiva.',
        m: 'Hola Diyer, mi hijo/a ya nada y quiero que mejore técnica y estilos. ¿Qué grupo le corresponde?'
      },
      adultoCero: {
        t: 'Clases para adultos, desde cero',
        d: 'Grupos pequeños para quien nunca aprendió. Se empieza por respiración y flotación, sin apuro y sin vergüenza.',
        m: 'Hola Diyer, soy adulto y quiero aprender a nadar desde cero. ¿Qué horarios manejan?'
      },
      adultoTecnica: {
        t: 'Clases para adultos, corrección de técnica',
        d: 'Para quien ya nada pero quiere mejorar brazada, respiración bilateral y resistencia.',
        m: 'Hola Diyer, ya nado y quiero corregir técnica y ganar resistencia. ¿Cómo son las clases para adultos?'
      },
      grupo: {
        t: 'Convenio para colegios y grupos',
        d: 'Programas institucionales con planificación por curso, horarios fijos y reportes de avance. Se cotizan según el número de estudiantes.',
        m: 'Hola Diyer, represento a un colegio o grupo y quiero cotizar un convenio de natación.'
      },
      inclusiva: {
        t: 'Natación inclusiva, con acompañamiento',
        d: 'Procesos adaptados al ritmo de cada estudiante, con rutinas y anticipación. Conviene contarnos el caso antes para asignar horario y profe.',
        m: 'Hola Diyer, necesito un proceso de natación con acompañamiento especializado. Quiero contarles el caso para ver cómo lo organizamos.'
      }
    };

    function resolver() {
      if (eleccion.meta === 'inclusiva') return programas.inclusiva;
      if (eleccion.quien === 'bebe') return programas.bebe;
      if (eleccion.quien === 'grupo') return programas.grupo;

      if (eleccion.quien === 'nino') {
        if (eleccion.meta === 'miedo') return programas.ninoMiedo;
        if (eleccion.meta === 'tecnica') return programas.ninoTecnica;
        return programas.ninoAprender;
      }
      if (eleccion.meta === 'tecnica') return programas.adultoTecnica;
      return programas.adultoCero;
    }

    function mostrar(n) {
      pasos.forEach(function (p) {
        p.hidden = Number(p.dataset.paso) !== n;
      });
      var visible = panel.querySelector('.paso:not([hidden]) h3');
      if (visible) {
        visible.setAttribute('tabindex', '-1');
        /* Mueve el foco al nuevo paso: ayuda a quien navega con teclado
           o lector de pantalla a notar el cambio sin perder su lugar. */
        visible.focus({ preventScroll: true });
      }
    }

    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;

      if (b.dataset.quien) {
        eleccion.quien = b.dataset.quien;
        mostrar(2);
        return;
      }

      if (b.dataset.meta) {
        eleccion.meta = b.dataset.meta;
        var r = resolver();
        document.getElementById('r-titulo').textContent = r.t;
        document.getElementById('r-texto').textContent = r.d;
        document.getElementById('r-wa').href = WA + encodeURIComponent(r.m);
        mostrar(3);
        return;
      }

      if (b.hasAttribute('data-volver')) { mostrar(1); return; }

      if (b.hasAttribute('data-reiniciar')) {
        eleccion.quien = null;
        eleccion.meta = null;
        mostrar(1);
      }
    });
  }

  /* ---------- Año del pie ---------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
