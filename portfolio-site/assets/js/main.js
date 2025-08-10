(function(){
  const htmlEl = document.documentElement;
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme) htmlEl.setAttribute('data-theme', savedTheme);
  const themeBtn = document.querySelector('.theme-toggle');
  const setTheme = (t)=>{
    htmlEl.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if(themeBtn) themeBtn.textContent = t === 'dark' ? '🌞' : '🌙';
  };
  if(themeBtn){
    setTheme(htmlEl.getAttribute('data-theme') || 'light');
    themeBtn.addEventListener('click', ()=>{
      const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // Mobile nav
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('navMenu');
  if(navToggle && navMenu){
    navToggle.addEventListener('click', ()=>{
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = ()=>{
    if(lightbox){
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.hidden = true;
      if(lightboxImg) lightboxImg.src = '';
      if(lightboxCaption) lightboxCaption.textContent = '';
    }
  };
  if(lightbox){
    lightbox.addEventListener('click', (e)=>{
      if(e.target === lightbox || (e.target && e.target.classList.contains('lightbox-close'))){
        closeLightbox();
      }
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') closeLightbox();
    });
  }
  function bindLightbox(root){
    (root || document).querySelectorAll('[data-lightbox] img').forEach(img=>{
      const parent = img.closest('[data-lightbox]');
      parent.addEventListener('click', ()=>{
        if(!lightbox || !lightboxImg) return;
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden','false');
        lightboxImg.src = img.src;
        if(lightboxCaption) lightboxCaption.textContent = parent.getAttribute('data-caption') || '';
      });
    });
  }

  // Projects rendering
  async function loadProjects(){
    try{
      const res = await fetch('data/projects.json', {cache:'no-store'});
      if(!res.ok) throw new Error('Failed to load projects');
      return await res.json();
    }catch(err){
      console.error(err);
      return [];
    }
  }

  function projectCard(p){
    const tags = (p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
    return `
      <article class="card" data-category="${(p.category||'').toLowerCase()}" data-tags="${(p.tags||[]).join(',')}">
        <a href="${p.link||'#'}" class="media" data-lightbox data-caption="${p.title}">
          <img src="${p.image}" alt="${p.title}">
        </a>
        <div class="body">
          <div class="title">${p.title}</div>
          <div class="tags">${tags}</div>
        </div>
      </article>`;
  }

  function renderFeatured(projects){
    const grid = document.getElementById('featuredGrid');
    if(!grid) return;
    const items = projects.slice(0,3).map(projectCard).join('');
    grid.innerHTML = items;
    bindLightbox(grid);
  }
  function renderWork(projects){
    const grid = document.getElementById('workGrid');
    if(!grid) return;
    grid.innerHTML = projects.map(projectCard).join('');
    bindLightbox(grid);

    // Filters
    const chips = document.querySelectorAll('.filters .chip');
    chips.forEach(chip=>{
      chip.addEventListener('click', ()=>{
        chips.forEach(c=>c.classList.remove('is-active'));
        chip.classList.add('is-active');
        const filter = chip.getAttribute('data-filter');
        grid.querySelectorAll('.card').forEach(card=>{
          const cat = (card.getAttribute('data-category')||'').toLowerCase();
          const show = !filter || filter === 'All' || cat === filter.toLowerCase();
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Contact form validation
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const status = document.getElementById('formStatus');
      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const messageError = document.getElementById('messageError');
      let ok = true;
      if(!name.value.trim()){nameError.textContent='Please enter your name.'; ok=false;} else nameError.textContent='';
      if(!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){emailError.textContent='Enter a valid email.'; ok=false;} else emailError.textContent='';
      if(!message.value.trim()){messageError.textContent='Please include a message.'; ok=false;} else messageError.textContent='';
      if(!ok) return;

      try{
        status.textContent = 'Sending…';
        const formData = new FormData(form);
        const res = await fetch(form.action, {method:'POST', body: formData, headers:{'Accept':'application/json'}});
        if(res.ok){
          status.textContent = 'Thank you! I will get back to you soon.';
          form.reset();
        }else{
          status.textContent = 'Something went wrong. Please email me directly.';
        }
      }catch(err){
        status.textContent = 'Network error. Please try again later.';
      }
    });
  }

  // Initialize
  loadProjects().then(projects=>{
    renderFeatured(projects);
    renderWork(projects);
  });
})();