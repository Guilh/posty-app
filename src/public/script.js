// Small client-side niceties
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function enhance() {
  document.documentElement.classList.add('js');
  // Stagger card animations
  if (!prefersReduced) {
    document.querySelectorAll('.card').forEach((el,i)=>{
      el.style.animationDelay = (i * 60)+'ms';
      el.classList.add('fade-in');
    });
  }
  // Active nav link
  const path = location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

enhance();
