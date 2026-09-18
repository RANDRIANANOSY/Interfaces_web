const COURSES_DATA = [
  {
    id: 1,
    title: "Javascript for beginners",
    technology: "Javascript",
    techIconClass: "tech-js",
    techIconLabel: "JS",
    level: "beginner",
    price: 120000,
    language: "en",
    description: "Javascript made easy as your first language. This video walks you through the basic mechanism of algorithms, loops, conditions, functions, and DOM manipulation."
  },
  {
    id: 2,
    title: "Java for beginners",
    technology: "Java",
    techIconClass: "tech-java",
    techIconLabel: "Java",
    level: "beginner",
    price: 220000,
    language: "en",
    description: "A simple course for true beginners in Java. Learn OOP fundamentals: classes, objects, encapsulation, inheritance, polymorphism, abstraction to build solid software."
  },
  {
    id: 3,
    title: "Relational Databases for Beginners",
    technology: "Relational Databases",
    techIconClass: "tech-db",
    techIconLabel: "DB",
    level: "beginner",
    price: 180000,
    language: "en",
    description: "Understand how relational databases really work. This course introduces tables, primary keys, foreign keys, constraints, normalization, ER diagrams, and SQL queries."
  },
  {
    id: 4,
    title: "Git & Version Control Mastery",
    technology: "Git & Version Control",
    techIconClass: "tech-git",
    techIconLabel: "Git",
    level: "beginner",
    price: 95000,
    language: "en",
    description: "Master Git from scratch. Learn repositories, commits, branches, merging, rebasing, resolving conflicts, and collaborating with remote repositories like GitHub."
  },
  {
    id: 5,
    title: "Développement Web Moderne avec React",
    technology: "React",
    techIconClass: "tech-react",
    techIconLabel: "React",
    level: "intermediate",
    price: 250000,
    language: "fr",
    description: "Maîtrisez les composants, hooks avancés (useState, useEffect, useMemo), state management et bonnes pratiques pour concevoir des applications web interactives."
  },
  {
    id: 6,
    title: "Fampidirana amin'ny Python ho an'ny vao manomboka",
    technology: "Python",
    techIconClass: "tech-python",
    techIconLabel: "Py",
    level: "beginner",
    price: 80000,
    language: "mg",
    description: "Mianara fandaharana Python amin'ny teny Malagasy: fitsipika fototra, fari-piainana, loops, asa (functions) ary famahana olana tsotra."
  },
  {
    id: 7,
    title: "Conception avancée de bases de données SQL",
    technology: "Relational Databases",
    techIconClass: "tech-db",
    techIconLabel: "DB",
    level: "advanced",
    price: 290000,
    language: "fr",
    description: "Optimisation de requêtes complexes, indexation B-Tree, partitions, transactions ACID et mise en production haute disponibilité avec PostgreSQL."
  },
  {
    id: 8,
    title: "Java Spring Boot & Microservices",
    technology: "Java",
    techIconClass: "tech-java",
    techIconLabel: "Java",
    level: "advanced",
    price: 280000,
    language: "fr",
    description: "Architecture d'applications d'entreprise avec Spring Boot, Spring Data JPA, REST APIs, sécurité JWT et conteneurisation Docker."
  }
];

const state = {
  selectedLanguage: 'all',
  selectedTechnology: 'all',
  selectedLevel: 'all',
  maxPrice: 300000,
  keyword: '',
  cart: []
};

const DOM = {
  langButtons: document.querySelectorAll('.lang-btn'),
  techFilter: document.getElementById('techFilter'),
  levelFilter: document.getElementById('levelFilter'),
  priceFilter: document.getElementById('priceFilter'),
  priceDisplay: document.getElementById('priceDisplay'),
  keywordFilter: document.getElementById('keywordFilter'),
  clearKeyword: document.getElementById('clearKeyword'),
  resetFilters: document.getElementById('resetFilters'),
  btnResetEmpty: document.getElementById('btnResetEmpty'),
  coursesGrid: document.getElementById('coursesGrid'),
  resultsCount: document.getElementById('resultsCount'),
  emptyState: document.getElementById('emptyState'),
  cartCount: document.getElementById('cartCount'),
  cartPill: document.getElementById('cartPill'),
  toast: document.getElementById('toast')
};

function formatMGA(amount) {
  return `MGA ${amount.toLocaleString('en-US')}`;
}

function renderCourses(courses) {
  DOM.resultsCount.innerHTML = `Showing <strong>${courses.length}</strong> course${courses.length > 1 ? 's' : ''}`;

  if (courses.length === 0) {
    DOM.coursesGrid.innerHTML = '';
    DOM.emptyState.classList.remove('hidden');
    return;
  }

  DOM.emptyState.classList.add('hidden');

  DOM.coursesGrid.innerHTML = courses.map(course => {
    return `
      <article class="course-card" data-id="${course.id}">
        <div class="card-thumbnail">
          <div class="tech-tag">
            <span class="tech-icon-box ${course.techIconClass}">${course.techIconLabel}</span>
            <span>${course.technology.toLowerCase()}</span>
          </div>
          <span class="level-badge ${course.level}">${course.level}</span>
        </div>

        <div class="card-body">
          <h2 class="course-title" title="${escapeHtml(course.title)}">${escapeHtml(course.title)}</h2>
          <div class="course-price">${formatMGA(course.price)}</div>
          <p class="course-description">${escapeHtml(course.description)}</p>

          <div class="card-footer">
            <button type="button" class="btn-learn-more" onclick="handleLearnMore(${course.id})">Learn more</button>
            <button type="button" class="btn-add-cart" onclick="handleAddToCart(${course.id})">Add to cart</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function filterCourses() {
  const filtered = COURSES_DATA.filter(course => {
    const matchLang = state.selectedLanguage === 'all' || course.language === state.selectedLanguage;
    const matchTech = state.selectedTechnology === 'all' || 
      course.technology.toLowerCase() === state.selectedTechnology.toLowerCase();
    const matchLevel = state.selectedLevel === 'all' || course.level === state.selectedLevel;
    const matchPrice = course.price <= state.maxPrice;

    let matchKeyword = true;
    if (state.keyword.trim() !== '') {
      const q = state.keyword.toLowerCase().trim();
      matchKeyword = course.title.toLowerCase().includes(q) ||
                     course.technology.toLowerCase().includes(q) ||
                     course.description.toLowerCase().includes(q);
    }

    return matchLang && matchTech && matchLevel && matchPrice && matchKeyword;
  });

  renderCourses(filtered);
}

function updatePriceSliderUI(val) {
  DOM.priceDisplay.textContent = formatMGA(val);
  const min = parseInt(DOM.priceFilter.min, 10);
  const max = parseInt(DOM.priceFilter.max, 10);
  const percentage = ((val - min) / (max - min)) * 100;
  
  DOM.priceFilter.style.background = `linear-gradient(to right, var(--primary-red) 0%, var(--primary-red) ${percentage}%, #fed7d7 ${percentage}%, #fed7d7 100%)`;
}

DOM.langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    DOM.langButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedLanguage = btn.getAttribute('data-lang');
    filterCourses();
  });
});

DOM.techFilter.addEventListener('change', (e) => {
  state.selectedTechnology = e.target.value;
  filterCourses();
});

DOM.levelFilter.addEventListener('change', (e) => {
  state.selectedLevel = e.target.value;
  filterCourses();
});

DOM.priceFilter.addEventListener('input', (e) => {
  const val = parseInt(e.target.value, 10);
  state.maxPrice = val;
  updatePriceSliderUI(val);
  filterCourses();
});

DOM.keywordFilter.addEventListener('input', (e) => {
  state.keyword = e.target.value;
  if (state.keyword.length > 0) {
    DOM.clearKeyword.classList.add('visible');
  } else {
    DOM.clearKeyword.classList.remove('visible');
  }
  filterCourses();
});

DOM.clearKeyword.addEventListener('click', () => {
  DOM.keywordFilter.value = '';
  state.keyword = '';
  DOM.clearKeyword.classList.remove('visible');
  DOM.keywordFilter.focus();
  filterCourses();
});

function resetAllFilters() {
  state.selectedLanguage = 'all';
  state.selectedTechnology = 'all';
  state.selectedLevel = 'all';
  state.maxPrice = 300000;
  state.keyword = '';

  DOM.langButtons.forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === 'all');
  });
  DOM.techFilter.value = 'all';
  DOM.levelFilter.value = 'all';
  DOM.priceFilter.value = 300000;
  DOM.keywordFilter.value = '';
  DOM.clearKeyword.classList.remove('visible');
  
  updatePriceSliderUI(300000);
  filterCourses();
  showToast("Filters have been reset");
}

DOM.resetFilters.addEventListener('click', resetAllFilters);
DOM.btnResetEmpty.addEventListener('click', resetAllFilters);

let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  DOM.toast.textContent = message;
  DOM.toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, 2500);
}

window.handleAddToCart = function(courseId) {
  const course = COURSES_DATA.find(c => c.id === courseId);
  if (!course) return;

  state.cart.push(course);
  DOM.cartCount.textContent = state.cart.length;

  DOM.cartPill.style.transform = 'scale(1.15)';
  setTimeout(() => {
    DOM.cartPill.style.transform = 'scale(1)';
  }, 200);

  showToast(`Added "${course.title}" to cart!`);
};

window.handleLearnMore = function(courseId) {
  const course = COURSES_DATA.find(c => c.id === courseId);
  if (!course) return;

  alert(`📌 Course Details:\n\nTitle: ${course.title}\nTechnology: ${course.technology}\nLevel: ${course.level}\nPrice: ${formatMGA(course.price)}\nLanguage: ${course.language.toUpperCase()}\n\nDescription:\n${course.description}`);
};

DOM.cartPill.addEventListener('click', () => {
  if (state.cart.length === 0) {
    showToast("Your cart is currently empty.");
  } else {
    const total = state.cart.reduce((sum, item) => sum + item.price, 0);
    const summary = state.cart.map((item, idx) => `${idx + 1}. ${item.title} (${formatMGA(item.price)})`).join('\n');
    alert(`🛒 Your Cart (${state.cart.length} item${state.cart.length > 1 ? 's' : ''}):\n\n${summary}\n\nTotal: ${formatMGA(total)}`);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updatePriceSliderUI(300000);
  filterCourses();
});
