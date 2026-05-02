/**
 * ═══════════════════════════════════════════════════════
 *   EL BUEN SABOR – Sistema POS
 *   JavaScript ES6+ | Vanilla JS | localStorage
 * ═══════════════════════════════════════════════════════
 */

'use strict';

/* ════════════════════════════════
   MÓDULO: DATOS / CATÁLOGO
════════════════════════════════ */
const PRODUCTS = [
    // ─── Hamburguesas ───────────────────────────────────
    {
        id: 'royal',
        name: 'Hamburguesa Royal',
        desc: 'Carne a la parrilla + huevo frito, lechuga, tomate y salsa especial',
        emoji: '🍔',
        price: 12.50,
        category: 'burgers',
        star: true,
    },
    {
        id: 'classic',
        name: 'Hamburguesa Clásica',
        desc: 'Carne jugosa, lechuga, tomate y mostaza',
        emoji: '🍔',
        price: 9.00,
        category: 'burgers',
    },
    {
        id: 'doble',
        name: 'Doble Carne',
        desc: 'Doble hamburguesa con queso americano y cebolla caramelizada',
        emoji: '🍔',
        price: 15.00,
        category: 'burgers',
    },
    {
        id: 'veggie',
        name: 'Burger Veggie',
        desc: 'Base de lentejas, aguacate y vegetales frescos',
        emoji: '🥗',
        price: 10.00,
        category: 'burgers',
    },
    // ─── Acompañamientos ────────────────────────────────
    {
        id: 'fries_sm',
        name: 'Papas Fritas S',
        desc: 'Papas crocantes, porción personal',
        emoji: '🍟',
        price: 4.00,
        category: 'sides',
    },
    {
        id: 'fries_lg',
        name: 'Papas Fritas L',
        desc: 'Porción grande para compartir',
        emoji: '🍟',
        price: 6.50,
        category: 'sides',
    },
    {
        id: 'onion',
        name: 'Aros de Cebolla',
        desc: 'Crujientes y dorados al punto',
        emoji: '🧅',
        price: 5.50,
        category: 'sides',
    },
    {
        id: 'salad',
        name: 'Ensalada Mixta',
        desc: 'Lechuga, tomate, pepino y vinagreta',
        emoji: '🥗',
        price: 4.50,
        category: 'sides',
    },
    // ─── Bebidas ────────────────────────────────────────
    {
        id: 'cola',
        name: 'Gaseosa 500ml',
        desc: 'Coca-Cola, Sprite o Inca Kola',
        emoji: '🥤',
        price: 3.00,
        category: 'drinks',
    },
    {
        id: 'water',
        name: 'Agua Mineral',
        desc: 'Sin gas, 600ml',
        emoji: '💧',
        price: 2.00,
        category: 'drinks',
    },
    {
        id: 'juice',
        name: 'Jugo Natural',
        desc: 'Naranja, maracuyá o piña – recién exprimido',
        emoji: '🍹',
        price: 4.00,
        category: 'drinks',
    },
    {
        id: 'coffee',
        name: 'Café Caliente',
        desc: 'Espresso o americano',
        emoji: '☕',
        price: 3.50,
        category: 'drinks',
    },
];

const TAX_RATE = 0.18; 

/* ════════════════════════════════
   MÓDULO: ESTADO (State)
════════════════════════════════ */
const state = {
  currentOrder: [],       // { product, qty }[]
  orderNumber: 1,         // Contador auto-incremental
  allOrders: [],          // Todos los pedidos del día (también en localStorage)
  activeTab: 'pos',       // tab activo
  activeCategory: 'all',  // filtro de categoría activo
};

/* ════════════════════════════════
   MÓDULO: PERSISTENCIA (localStorage)
════════════════════════════════ */
const Storage = {
  KEY: 'elbuensabor_orders',

  /** Carga pedidos del día desde localStorage */
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      // Filtra solo los pedidos de hoy
      const today = new Date().toDateString();
      return parsed.filter(o => new Date(o.timestamp).toDateString() === today);
    } catch (e) {
      console.error('Error cargando ventas:', e);
      return [];
    }
  },

  /** Guarda todos los pedidos */
  save(orders) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error guardando ventas:', e);
    }
  },

  /** Limpia pedidos del día */
  clearToday() {
    const today = new Date().toDateString();
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return;
      const all = JSON.parse(raw).filter(
        o => new Date(o.timestamp).toDateString() !== today
      );
      localStorage.setItem(this.KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Error limpiando ventas:', e);
    }
  },
};

/* ════════════════════════════════
   MÓDULO: HELPERS
════════════════════════════════ */
const fmt = (n) => `S/ ${n.toFixed(2)}`;
const fmtTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
};

/** Genera un ID único de pedido */
function genOrderId() {
  const id = state.orderNumber;
  state.orderNumber++;
  return `#${String(id).padStart(3, '0')}`;
}

/** Calcula subtotal, IGV y total de la orden actual */
function calcTotals() {
  const subtotal = state.currentOrder.reduce((acc, { product, qty }) => acc + product.price * qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

/** Devuelve producto por id */
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

/* ════════════════════════════════
   MÓDULO: TOAST
════════════════════════════════ */
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ════════════════════════════════
   MÓDULO: RELOJ
════════════════════════════════ */
function startClock() {
  const clockEl = document.getElementById('clock');
  const dateEl  = document.getElementById('date-display');

  function tick() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('es-PE');
    dateEl.textContent  = now.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' });
  }

  tick();
  setInterval(tick, 1000);
}

/* ════════════════════════════════
   MÓDULO: TABS
════════════════════════════════ */
function initTabs() {
  const navBtns   = document.querySelectorAll('.nav-btn');
  const tabSects  = document.querySelectorAll('.tab-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      state.activeTab = tab;

      navBtns.forEach(b => b.classList.remove('active'));
      tabSects.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${tab}`).classList.add('active');

      // Refrescar vistas al cambiar de tab
      if (tab === 'kitchen') renderKitchen();
      if (tab === 'sales')   renderSales();
    });
  });
}

/* ════════════════════════════════
   MÓDULO: CATÁLOGO / MENÚ
════════════════════════════════ */
function renderProducts(category = 'all') {
  const grid = document.getElementById('products-grid');
  const filtered = category === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category);

  grid.innerHTML = '';

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.innerHTML = `
      <div class="product-emoji">
        ${product.emoji}
        ${product.star ? '<span class="star-badge">⭐ Estrella</span>' : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-footer">
          <span class="product-price">${fmt(product.price)}</span>
          <button class="btn-add" data-id="${product.id}" title="Agregar">+</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function initCategoryFilters() {
  const catBtns = document.querySelectorAll('.cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.cat;
      renderProducts(state.activeCategory);
    });
  });
}