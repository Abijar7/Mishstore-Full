// MishStore — app.js (vanilla JS)
const products = [
  {id:1, sku:'MS-001', name:'Pariso Chronograph', category:'Watches', price:179, img:'https://images.unsplash.com/photo-1518544881894-1f3e3c4423b6?q=80&w=1200&auto=format&fit=crop'},
  {id:2, sku:'MS-002', name:'Nebula Smart Pro', category:'Wearables', price:349, img:'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=1200&auto=format&fit=crop'},
  {id:3, sku:'MS-003', name:'Midnight Diver 200m', category:'Watches', price:229, img:'https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop'},
  {id:4, sku:'MS-004', name:'City Lite NFC', category:'Wearables', price:159, img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop'},
  {id:5, sku:'MS-005', name:'RetroSquare LED', category:'Watches', price:79, img:'https://images.unsplash.com/photo-1544117510-0bdfd6b2d1b7?q=80&w=1200&auto=format&fit=crop'},
  {id:6, sku:'MS-006', name:'Solstice Automatic', category:'Luxury', price:499, img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop'}
];

const state = {
  query: '',
  sort: 'featured',
  cart: JSON.parse(localStorage.getItem('mish_cart_full') || '[]'),
  theme: localStorage.getItem('mish_theme') || 'light'
};

const grid = document.getElementById('grid');
const searchEl = document.getElementById('search');
const sortEl = document.getElementById('sort');
const cartBtn = document.getElementById('cartBtn');
const cart = document.getElementById('cart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCart');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');

function money(n){ return '$' + n.toFixed(2); }

function renderProducts(){
  grid.innerHTML = '';
  let list = products.filter(p => p.name.toLowerCase().includes(state.query.toLowerCase()) || p.sku.toLowerCase().includes(state.query.toLowerCase()));
  if(state.sort === 'priceAsc') list.sort((a,b)=>a.price-b.price);
  if(state.sort === 'priceDesc') list.sort((a,b)=>b.price-a.price);
  if(state.sort === 'nameAsc') list.sort((a,b)=>a.name.localeCompare(b.name));
  list.forEach(p=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="flex:1">
            <h4>${p.name}</h4>
            <div class="meta">${p.category} • ${p.sku}</div>
          </div>
          <div class="price">${money(p.price)}</div>
        </div>
        <div style="margin-top:auto; display:flex; gap:8px; margin-top:10px;">
          <button class="btn" data-action="view" data-id="${p.id}">View</button>
          <button class="btn primary" data-action="add" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
}

function saveCart(){ localStorage.setItem('mish_cart_full', JSON.stringify(state.cart)); updateCartUI(); }

function updateCartUI(){
  cartItems.innerHTML = '';
  const totalQty = state.cart.reduce((s,i)=>s+i.qty,0);
  cartCount.textContent = totalQty;
  const subtotal = state.cart.reduce((s,i)=>s + i.price * i.qty, 0);
  subtotalEl.textContent = money(subtotal);
  checkoutBtn.disabled = state.cart.length === 0;
  state.cart.forEach(item=>{
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div style="flex:1">
        <div style="font-weight:700">${item.name}</div>
        <div class="small">${money(item.price)} × ${item.qty}</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <button class="btn" data-action="dec" data-id="${item.id}">−</button>
        <button class="btn" data-action="inc" data-id="${item.id}">+</button>
      </div>
    `;
    cartItems.appendChild(li);
  });
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const found = state.cart.find(x=>x.id===id);
  if(found) found.qty++;
  else state.cart.push({...p, qty:1});
  saveCart();
  openCart();
}

function changeQty(id, delta){
  const item = state.cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) state.cart = state.cart.filter(x=>x.id!==id);
  saveCart();
}

function openCart(){ cart.setAttribute('aria-hidden','false'); }
function closeCart(){ cart.setAttribute('aria-hidden','true'); }

function openModal(html){ modalContent.innerHTML = html; modal.setAttribute('aria-hidden','false'); }
function closeModal(){ modal.setAttribute('aria-hidden','true'); modalContent.innerHTML = ''; }

// Event delegation for product actions
grid.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  if(action === 'view'){ const p = products.find(x=>x.id===id); openModal(`<div style="display:flex; gap:12px; padding:18px;"><img src="${p.img}" alt="${p.name}" style="width:320px; height:320px; object-fit:cover; border-radius:8px;" /><div><h3>${p.name}</h3><p class="meta">${p.category} • ${p.sku}</p><p style="margin-top:12px; font-weight:700;">${money(p.price)}</p><div style="margin-top:16px;"><button class="btn primary" id="modalAdd" data-id="${p.id}">Add to cart</button></div></div></div>`); }
  if(action === 'add'){ addToCart(id); }
});

// Cart buttons
cartItems.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  if(action === 'inc') changeQty(id, 1);
  if(action === 'dec') changeQty(id, -1);
});

// top-level controls
document.getElementById('cartBtn').addEventListener('click', ()=> openCart());
document.getElementById('closeCart').addEventListener('click', ()=> closeCart());
clearCartBtn.addEventListener('click', ()=> { state.cart = []; saveCart(); });
checkoutBtn.addEventListener('click', ()=> { alert('Demo checkout — integrate payment gateway for real checkout.'); state.cart = []; saveCart(); });

// modal close handlers
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });
document.addEventListener('click', (e)=>{ if(e.target && e.target.id === 'modalAdd'){ addToCart(Number(e.target.dataset.id)); closeModal(); } });

// search + sort listeners
searchEl.addEventListener('input', (e)=>{ state.query = e.target.value; renderProducts(); });
sortEl.addEventListener('change', (e)=>{ state.sort = e.target.value; renderProducts(); });

// contact form demo
contactForm.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Thanks — message sent (demo).'); e.target.reset(); });

// theme toggle (simple)
function applyTheme(){ if(state.theme === 'dark'){ document.documentElement.style.setProperty('--bg','#0b1220'); document.documentElement.style.setProperty('--card','#0f1724'); document.documentElement.style.setProperty('--text','#e6eef6'); document.documentElement.style.setProperty('--muted','#9aa3b2'); } else { document.documentElement.style.setProperty('--bg','#f7f9fb'); document.documentElement.style.setProperty('--card','#ffffff'); document.documentElement.style.setProperty('--text','#0b1220'); document.documentElement.style.setProperty('--muted','#6b7280'); } localStorage.setItem('mish_theme', state.theme); }
themeToggle.addEventListener('click', ()=>{ state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); });

// initialize
document.getElementById('year').textContent = new Date().getFullYear();
applyTheme();
renderProducts();
updateCartUI();
