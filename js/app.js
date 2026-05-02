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

const TAX_RATE = 0.18; // IGV Perú