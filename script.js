/* =====================================================
   DISTRIBUIDORA DEL ORIENTE — JS PRINCIPAL
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. MENÚ HAMBURGUESA ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Cierra el menú al hacer clic en un enlace
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 2. CARRUSEL DE TESTIMONIOS ---------- */
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  let currentIndex = 0;
  let autoplayId;

  // Crear puntos indicadores dinámicamente
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Autoplay
  function startAutoplay() { autoplayId = setInterval(nextSlide, 6000); }
  function resetAutoplay() { clearInterval(autoplayId); startAutoplay(); }
  startAutoplay();

  // Pausa al pasar el mouse
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayId));
  carousel.addEventListener('mouseleave', startAutoplay);

  // Soporte de swipe táctil
  let startX = 0;
  carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  });

  /* ---------- 3. VALIDACIÓN DE ENCUESTA ---------- */
  const form = document.getElementById('surveyForm');
  const message = document.getElementById('surveyMessage');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const carne = form.carne.value;
    const calificacion = form.querySelector('input[name="calificacion"]:checked');

    if (!carne) {
      message.textContent = '⚠️ Por favor selecciona qué carne consumes más.';
      message.classList.add('error');
      return;
    }
    if (!calificacion) {
      message.textContent = '⚠️ Por favor califica nuestro servicio con estrellas.';
      message.classList.add('error');
      return;
    }

    // Simulación de envío exitoso
    message.classList.remove('error');
    message.textContent = '✅ ¡Gracias por tu opinión! Tu respuesta ha sido registrada.';
    form.reset();

    // Oculta el mensaje después de 5 s
    setTimeout(() => { message.textContent = ''; }, 5000);
  });

  /* ---------- 4. ANIMACIÓN AL HACER SCROLL ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- 5. AÑO DINÁMICO EN EL FOOTER ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- 6. SMOOTH SCROLL CON OFFSET DEL HEADER ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});