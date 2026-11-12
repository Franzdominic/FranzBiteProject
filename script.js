const items = [
  {n:'Chicken Pasta',p:280,c:'pasta',i:'menu1',d:'Creamy and flavorful pasta topped with tender chicken, fresh herbs, and a delicious sauce.'},
  {n:'Chicken Overload Burger',p:550,c:'burger',i:'menu2',d:'A delicious grilled chicken patty served in a soft bun, topped with fresh lettuce, creamy sauce,tomato,and flavorful seasonings.'},
  {n:'Tuna Carbonara',p:170,c:'pasta',i:'menu3',d:'Creamy and delicious pasta made with tender tuna, rich carbonara sauce, and perfectly cooked pasta.'},
  {n:'Classic Beff Burger',p:350,c:'burger',i:'pop5',d:'Juicy beef patty with melted cheese, onions, and fresh lettuce in a toasted bun.'},
  {n:'Strawberry Juice',p:65,c:'drinks',i:'pop4',d:'Refreshing strawberry juice made from ripe, sweet strawberries.'},
  {n:'Tiramisu Cake',p:100,c:'dessert',i:'pop1',d:'Layers of coffee-soaked sponge and mascarpone cream dusted with cocoa.'}
];
const popular = [
  ['Tiramisu Cake',100,'pop1'],['Chicken Overload Burger',550,'pop2'],['Chicken Pasta',280,'pop3'],
  ['Strawberry Juice',65,'pop4'],['Classic Beff Burger',350,'pop5']
];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let cartCount = 0, cat = 'all', query = '';

// shared header
const tpl = $('#hdr');
$$('.hdr-slot').forEach(slot => slot.appendChild(tpl.content.cloneNode(true)));

// views
function show(v) {
  if (!$('#' + v)) v = 'home';
  $$('.view').forEach(s => s.classList.toggle('on', s.id === v));
  $$('.nav a').forEach(a => a.classList.toggle('on', a.dataset.v === v));
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => show(location.hash.slice(1)));
$$('[data-go]').forEach(b => b.onclick = () => (location.hash = b.dataset.go));

// cart
function addToCart() {
  cartCount++;
  $$('.badge').forEach(b => { b.textContent = cartCount; b.hidden = false; });
}
document.addEventListener('click', e => { if (e.target.matches('.add')) addToCart(); });

// popular cards
$('#popGrid').innerHTML = popular.map(([n, p, i]) =>
  `<article class="pc"><img src="images/${i}.png" alt="${n}"><h4>${n}</h4><div class="pr">₱${p}</div><button class="add">Add to Cart</button></article>`).join('');

// menu cards
function renderMenu() {
  const list = items.filter(x => (cat === 'all' || x.c === cat) && x.n.toLowerCase().includes(query));
  $('#track').innerHTML = list.length
    ? list.map(x => `<article class="mc"><img src="images/${x.i}.png" alt="${x.n}"><h4>${x.n}</h4><p>${x.d}</p><p class="pr">₱ ${x.p}</p><button class="add">Add to Cart</button></article>`).join('')
    : '<p class="empty">No items found in this category yet.</p>';
  $('#track').scrollLeft = 0;
}
$$('#cats li').forEach(li => li.onclick = () => {
  $$('#cats li').forEach(l => l.classList.toggle('on', l === li));
  cat = li.dataset.c; renderMenu();
});
const step = 280;
$('.arrow.l').onclick = () => $('#track').scrollBy({left: -step});
$('.arrow.r').onclick = () => $('#track').scrollBy({left: step});

// mouse wheel up/down slides the menu cards left/right
let wheelLock = false;
$('.menu-main').addEventListener('wheel', e => {
  const t = $('#track');
  if (t.scrollWidth <= t.clientWidth) return;
  e.preventDefault();
  if (wheelLock) return;
  wheelLock = true; setTimeout(() => (wheelLock = false), 350);
  t.scrollBy({left: (e.deltaY > 0 || e.deltaX > 0 ? 1 : -1) * step});
}, {passive: false});

// search
$$('.search').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  query = $('input', f).value.trim().toLowerCase();
  $$('.search input').forEach(i => (i.value = $('input', f).value));
  location.hash = 'menu'; show('menu'); renderMenu();
}));

// contact form
$('#msgForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, note = $('#note');
  const v = n => f.elements[n].value.trim();
  const ok = v('name') && /\S+@\S+\.\S+/.test(v('email')) && v('message');
  note.textContent = ok ? 'Thank you! Your message has been sent.' : 'Please fill in your name, a valid email, and a message.';
  if (ok) f.reset();
});

// keep the 1440px design centered, and shrink it to fit smaller screens
const fit = () => { document.body.style.zoom = Math.min(1, innerWidth / 1440); };
addEventListener('resize', fit); fit();

// shadow under the sticky nav once the page scrolls
const onScroll = () => $$('.hdr-slot').forEach(s => s.classList.toggle('stuck', scrollY > 4));
addEventListener('scroll', onScroll); onScroll();

renderMenu();
show(location.hash.slice(1) || 'home');
