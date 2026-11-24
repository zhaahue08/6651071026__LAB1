/* BREWÉ – script.js (JavaScript thuần). Dữ liệu là DỮ LIỆU MẪU, chưa xác minh. */
const $ = s => document.querySelector(s);
const esc = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => n.toLocaleString('vi-VN') + '₫';
const CATS = {noidia:'Bia nội địa', quocte:'Bia quốc tế', khongcon:'Bia không cồn', cider:'Cider / đồ uống khác'};

/* Dòng: Tên | Thương hiệu | Nhóm. Nhóm chỉ là phân loại minh họa, cần đối chiếu nguồn chính thức. */
const RAW = `Heineken Original|Heineken|quocte
Heineken Silver|Heineken|quocte
Heineken 0.0|Heineken|khongcon
Tiger|Tiger|noidia
Tiger Crystal|Tiger|noidia
Larue|Larue|noidia
Larue Special|Larue|noidia
Bivina|Bivina|noidia
Bia Việt|Bia Việt|noidia
Bia Saigon Lager|Saigon|noidia
Saigon Export|Saigon|noidia
Saigon Special|Saigon|noidia
Saigon Chill|Saigon|noidia
Saigon Gold|Saigon|noidia
333|333|noidia
333 Pilsner|333|noidia
Lạc Việt|Lạc Việt|noidia
Bia Hà Nội|Hanoi|noidia
Hanoi Premium|Hanoi|noidia
Hanoi Bold|Hanoi|noidia
Hanoi Light|Hanoi|noidia
Trúc Bạch|Trúc Bạch|noidia
Huda|Huda|noidia
Huda Gold|Huda|noidia
Huda Ice Blast|Huda|noidia
Huda Ice Twist|Huda|noidia
Halida|Halida|noidia
Carlsberg|Carlsberg|quocte
Tuborg|Tuborg|quocte
1664 Blanc|1664 Blanc|quocte
Budweiser|Budweiser|quocte
Beck's|Beck's|quocte
Corona Extra|Corona|quocte
Hoegaarden|Hoegaarden|quocte
Sapporo Premium|Sapporo|quocte
San Miguel|San Miguel|quocte
Sư Tử Trắng|Sư Tử Trắng|noidia
Sagota|Sagota|noidia
Bia Hạ Long|Hạ Long|noidia
Strongbow (cider táo, không phải bia)|Strongbow|cider`;

/* Ảnh placeholder tự thiết kế (SVG có tên sản phẩm). Thay bằng ảnh thật: image: "Images/products/ten-file.png" */
const ph = name => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#FFF8EF"/><rect x="105" y="50" width="90" height="200" rx="18" fill="#E3EBD9" stroke="#455B3E" stroke-width="4"/><text x="150" y="160" font-family="Georgia" font-size="16" text-anchor="middle" fill="#455B3E">${esc(name).slice(0, 14)}</text></svg>`);

const PHOTOS = {  // Tên sản phẩm (đúng như trong RAW) : tên file ảnh trong Images/products/
  "Heineken Original": "heineken-original.png",
  "Heineken Silver": "heineken-silver.png",
  "Heineken 0.0": "heineken-0-0.png",
  "Huda Ice Twist": "huda-ice-twist.jpg",
  "Tiger": "tiger.png",
  "Tiger Crystal": "tiger-crystal.png",
  "Larue": "larue.png",
  "Larue Special": "larue-special.png",
  "Bivina": "bivina.png",
  "Bia Việt": "bia-viet.png",
  "Bia Saigon Lager": "bia-saigon-lager.png",
  "Saigon Export": "saigon-export.png",
  "Saigon Special": "saigon-special.png",
  "Saigon Chill": "saigon-chill.png",
  "333": "333.png",
  "Lạc Việt": "lac-viet.png",
  "Bia Hà Nội": "bia-ha-noi.png",
  "Hanoi Premium": "hanoi-premium.png",
  "Trúc Bạch": "truc-bach.png",
  "Huda": "huda.png",
  "Huda Gold": "huda-gold.png",
  "Halida": "halida.png",
  "Carlsberg": "carlsberg.png",
  "Tuborg": "tuborg.png",
  "1664 Blanc": "1664-blanc.png",
  "Budweiser": "budweiser.png",
  "Corona Extra": "corona-extra.png",
  "Beck's": "beck-s.png",
  "Hoegaarden": "hoegaarden.png",
  "Sapporo Premium": "sapporo-premium.png",
  "San Miguel": "san-miguel.png",
  "Sư Tử Trắng": "su-tu-trang.png",
  "Sagota": "sagota.png",
  "Bia Hạ Long": "bia-ha-long.png"
};

const products = RAW.split('\n').map((line, i) => {
  const [name, brand, category] = line.split('|');
  return {id: i + 1, name, brand, category, origin: null, packaging: null, volume: null, alcohol: null,
    price: 15000 + (i % 7) * 3000,            // giá MINH HỌA
    image: 'Images/products/' + (PHOTOS[name] || 'p' + String(i + 1).padStart(2, '0') + '.svg'),  // chưa có ảnh thật thì dùng ảnh minh họa
    description: `${name} thuộc nhóm ${CATS[category].toLowerCase()}.`,
    featured: i % 6 === 0};
});

const state = {q: '', brand: '', cat: '', sort: '', shown: 12};
let cart = {}, reviews = [], user = null, admin = false;

/* ---------- Tiện ích ---------- */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2200);
}
const openM = el => el.classList.add('show');
const closeM = el => el.classList.remove('show');
function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch (e) { return def; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* bỏ qua */ } }

/* ---------- Thẻ sản phẩm ---------- */
function cardHTML(p) {
  return `<article class="card"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy">
    <span class="tag">${CATS[p.category]}</span><h3>${esc(p.name)}</h3><p>${esc(p.brand)}</p>
    <p>${money(p.price)}</p>
    <div class="row"><button class="btn ghost" data-id="${p.id}">Chi tiết</button><button class="btn" data-add="${p.id}">Thêm</button></div></article>`;
}

function filtered() {
  const q = state.q.trim().toLowerCase();
  let list = products.filter(p => (!q || (p.name + ' ' + p.brand).toLowerCase().includes(q))
    && (!state.brand || p.brand === state.brand) && (!state.cat || p.category === state.cat));
  const s = {az: (a, b) => a.name.localeCompare(b.name, 'vi'), za: (a, b) => b.name.localeCompare(a.name, 'vi'),
    pa: (a, b) => a.price - b.price, pd: (a, b) => b.price - a.price}[state.sort];
  return s ? list.sort(s) : list;
}

function renderGrid() {
  const list = filtered();
  $('#grid').innerHTML = list.slice(0, state.shown).map(cardHTML).join('');
  $('#empty').hidden = list.length > 0;
  $('#moreBtn').hidden = state.shown >= list.length;
  $('#count').textContent = `Hiển thị ${Math.min(state.shown, list.length)} / ${list.length} sản phẩm`;
}
const refresh = () => { state.shown = 12; renderGrid(); };

/* ---------- Khởi tạo danh mục, thương hiệu, bộ lọc ---------- */
const brands = [...new Set(products.map(p => p.brand))];
$('#cats').innerHTML = Object.entries(CATS).map(([k, v]) => `<button class="cat" data-cat="${k}"><img src="Images/categories/${k}.svg" alt="" width="56" height="56"><br>${v}</button>`).join('');
$('#brandChips').innerHTML = brands.map(b => `<button class="chip" data-brand="${esc(b)}">${esc(b)}</button>`).join('');
$('#fBrand').insertAdjacentHTML('beforeend', brands.map(b => `<option>${esc(b)}</option>`).join(''));
$('#fCat').insertAdjacentHTML('beforeend', Object.entries(CATS).map(([k, v]) => `<option value="${k}">${v}</option>`).join(''));
$('#featGrid').innerHTML = products.filter(p => p.featured).map(cardHTML).join('');
const prodOpts = products.map(p => `<option>${esc(p.name)}</option>`).join('');
$('#rProd').innerHTML = prodOpts;
$('#vProd').innerHTML = '<option value="">Tất cả</option>' + prodOpts;

function goProducts() { $('#sanpham').scrollIntoView(); }
function syncFilters() { $('#fBrand').value = state.brand; $('#fCat').value = state.cat; $('#q').value = state.q; }

/* ---------- Sự kiện chung (event delegation) ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  if (t.dataset.cat !== undefined) { state.cat = t.dataset.cat; state.brand = ''; state.q = ''; syncFilters(); refresh(); goProducts(); }
  if (t.dataset.brand !== undefined) { state.brand = t.dataset.brand; state.cat = ''; state.q = ''; syncFilters(); refresh(); goProducts(); }
  if (t.dataset.id) showDetail(+t.dataset.id);
  if (t.dataset.add) addCart(+t.dataset.add);
  if (t.dataset.close !== undefined) closeM(t.closest('.overlay'));
  if (t.classList.contains('overlay') && t.id !== 'ageGate') closeM(t);   // bấm ra ngoài để đóng
  if (t.dataset.plus) changeQty(t.dataset.plus, 1);
  if (t.dataset.minus) changeQty(t.dataset.minus, -1);
  if (t.dataset.del) { delete cart[t.dataset.del]; saveCart(); }
  if (t.dataset.saveReply !== undefined) saveReply(+t.dataset.saveReply);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.overlay.show:not(#ageGate)').forEach(closeM);
});

$('#q').addEventListener('input', e => { state.q = e.target.value; refresh(); });
$('#searchForm').addEventListener('submit', e => { e.preventDefault(); goProducts(); });
$('#fBrand').addEventListener('change', e => { state.brand = e.target.value; refresh(); });
$('#fCat').addEventListener('change', e => { state.cat = e.target.value; refresh(); });
$('#fSort').addEventListener('change', e => { state.sort = e.target.value; refresh(); });
$('#clearBtn').addEventListener('click', () => { Object.assign(state, {q: '', brand: '', cat: '', sort: ''}); $('#fSort').value = ''; syncFilters(); refresh(); });
$('#moreBtn').addEventListener('click', () => { state.shown += 12; renderGrid(); });

/* ---------- Xác nhận 18+, menu, lên đầu trang ---------- */
$('#ageYes').addEventListener('click', () => closeM($('#ageGate')));
$('#ageNo').addEventListener('click', () => { $('#ageMsg').textContent = 'Rất tiếc, nội dung này chỉ dành cho người từ 18 tuổi trở lên.'; });
$('#menuBtn').addEventListener('click', e => {
  const open = $('#nav').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', open);
});
$('#nav').addEventListener('click', e => { if (e.target.tagName === 'A') $('#nav').classList.remove('open'); });
window.addEventListener('scroll', () => {
  $('#topBtn').hidden = window.scrollY < 500;
  $('.top').classList.toggle('scrolled', window.scrollY > 10);
});
$('#topBtn').addEventListener('click', () => window.scrollTo({top: 0}));

/* ---------- Chi tiết sản phẩm ---------- */
function showDetail(id) {
  const p = products.find(x => x.id === id);
  const v = x => x ? esc(x) : 'Chưa cập nhật';
  $('#pBody').innerHTML = `<button class="x" data-close aria-label="Đóng">×</button>
    <img class="big" src="${p.image}" alt="${esc(p.name)}"><h2>${esc(p.name)}</h2>
    <p><span class="tag">${CATS[p.category]}</span> Thương hiệu: ${esc(p.brand)}</p><p>${esc(p.description)}</p>
    ${[['Xuất xứ', p.origin], ['Dung tích', p.volume], ['Nồng độ cồn', p.alcohol], ['Quy cách', p.packaging]].filter(x => x[1]).map(x => x[0] + ': ' + esc(x[1])).join('<br>').replace(/^(.+)$/, '<p>$1</p>')}
    <p>${money(p.price)}</p>
    <button class="btn" data-add="${p.id}">Thêm vào giỏ hàng</button>`;
  openM($('#pModal'));
}

/* ---------- Giỏ hàng mô phỏng (localStorage chỉ lưu id + số lượng) ---------- */
function saveCart() { save('brewe_cart', cart); renderCart(); }
function addCart(id) {
  cart[id] = (cart[id] || 0) + 1; saveCart(); toast('Đã thêm vào giỏ hàng');
  const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');   // hiệu ứng nảy số
  try { const a = new Audio('Sounds/add-to-cart.mp3'); a.volume = 0.4; a.play().catch(() => {}); } catch (e) { /* trình duyệt chặn âm thanh thì bỏ qua */ }
}
function changeQty(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; saveCart(); }
function renderCart() {
  const ids = Object.keys(cart); let sum = 0, n = 0;
  $('#cartList').innerHTML = ids.length ? ids.map(id => {
    const p = products.find(x => x.id == id); sum += p.price * cart[id]; n += cart[id];
    return `<div class="ci"><span>${esc(p.name)}<br><small>${money(p.price)}</small></span>
      <span class="qty"><button data-minus="${id}" aria-label="Giảm">−</button> ${cart[id]} <button data-plus="${id}" aria-label="Tăng">+</button></span>
      <button class="btn ghost sm" data-del="${id}">Xóa</button></div>`;
  }).join('') : '<p>Giỏ hàng đang trống.</p>';
  $('#subtotal').textContent = money(sum); $('#cartCount').textContent = n;
}
$('#cartBtn').addEventListener('click', () => openM($('#cartModal')));
cart = load('brewe_cart', {}); renderCart();

/* ---------- Tài khoản mô phỏng (không lưu gì) ---------- */
$('#accBtn').addEventListener('click', () => {
  $('#accName').parentElement.hidden = !!user;
  $('#accSubmit').textContent = user ? 'Đăng xuất' : 'Đăng nhập';
  openM($('#accModal'));
});
$('#accForm').addEventListener('submit', e => {
  e.preventDefault();
  user = user ? null : ($('#accName').value.trim() || 'Khách demo');
  $('#accLabel').textContent = user || 'Đăng nhập';
  closeM($('#accModal')); toast(user ? 'Xin chào ' + user : 'Đã đăng xuất');
});

/* ---------- Đánh giá ---------- */
const SAMPLE = [
  {id: 1, name: 'Minh Anh', product: 'Tiger', stars: 5, text: 'Giao diện dễ nhìn, thông tin rõ ràng.', date: '2026-10-01', sample: true, reply: ''},
  {id: 2, name: 'Quốc Bảo', product: 'Heineken 0.0', stars: 4, text: 'Nhóm không cồn tách riêng rất tiện lọc.', date: '2026-10-05', sample: true, reply: 'Cảm ơn bạn đã ủng hộ BREWÉ!'},
  {id: 3, name: 'Thu Hà', product: 'Bia Saigon Lager', stars: 3, text: 'Mong có thêm thông tin chi tiết cho từng sản phẩm.', date: '2026-10-09', sample: true, reply: ''}];
reviews = load('brewe_reviews_v2', SAMPLE);
const starStr = n => '★'.repeat(n) + '☆'.repeat(5 - n);

function renderReviews() {
  const total = reviews.length, avg = total ? reviews.reduce((s, r) => s + r.stars, 0) / total : 0;
  $('#avg').textContent = avg.toFixed(1) + '/5'; $('#stars').textContent = starStr(Math.round(avg));
  $('#total').textContent = total + ' đánh giá';
  $('#bars').innerHTML = [5, 4, 3, 2, 1].map(s => {
    const c = reviews.filter(r => r.stars === s).length;
    return `<div class="bar5"><span>${s}★</span><div class="track"><i style="width:${total ? c / total * 100 : 0}%"></i></div><span>${c}</span></div>`;
  }).join('');
  const fs = $('#vStar').value, fp = $('#vProd').value;
  const list = reviews.filter(r => (!fs || r.stars == fs) && (!fp || r.product === fp)).sort((a, b) => b.id - a.id);
  $('#revList').innerHTML = list.length ? list.map(r => `<article class="rev"><header><span class="av">${esc(r.name[0].toUpperCase())}</span>
    <div><b>${esc(r.name)}</b> <br><small>${esc(r.product)} · ${esc(r.date)}</small></div>
    <span style="margin-left:auto" aria-label="${r.stars} sao">${starStr(r.stars)}</span></header><p>${esc(r.text)}</p>
    ${r.reply ? `<div class="reply"><b>Phản hồi từ người bán:</b> ${esc(r.reply)}</div>` : ''}
    ${admin ? `<label>Trả lời <textarea id="rp${r.id}" rows="2" maxlength="200">${esc(r.reply)}</textarea></label><button class="btn sm" data-save-reply="${r.id}">Lưu phản hồi</button>` : ''}
  </article>`).join('') : '<p>Chưa có đánh giá phù hợp.</p>';
}
function saveReply(id) {
  reviews.find(r => r.id === id).reply = $('#rp' + id).value.trim();
  save('brewe_reviews_v2', reviews); renderReviews(); toast('Đã lưu phản hồi');
}
$('#vStar').addEventListener('change', renderReviews);
$('#vProd').addEventListener('change', renderReviews);
$('#adminMode').addEventListener('change', e => { admin = e.target.checked; renderReviews(); });
$('#revForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#rName').value.trim(), text = $('#rText').value.trim(), stars = +$('#rStar').value;
  let err = '';
  if (name.length < 2) err = 'Vui lòng nhập tên (ít nhất 2 ký tự).';
  else if (!stars) err = 'Vui lòng chọn số sao.';
  else if (text.length < 10) err = 'Nhận xét cần ít nhất 10 ký tự.';
  $('#rErr').textContent = err;
  if (err) return;
  reviews.push({id: Date.now(), name, product: $('#rProd').value, stars, text, date: new Date().toISOString().slice(0, 10), sample: false, reply: ''});
  save('brewe_reviews_v2', reviews); e.target.reset(); renderReviews(); toast('Đã gửi đánh giá, cảm ơn bạn!');
});

/* ---------- Newsletter mô phỏng ---------- */
$('#nlForm').addEventListener('submit', e => {
  e.preventDefault();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#nlMail').value.trim());
  $('#nlMsg').textContent = ok ? 'Cảm ơn bạn đã đăng ký nhận tin!' : 'Email chưa đúng định dạng.';
  if (ok) { e.target.reset(); toast('Đăng ký thành công'); }
});

renderGrid(); renderReviews();

/* ---------- Khuyến mãi (minh họa, bấm để lọc sản phẩm) ---------- */
const PROMOS = [
  {t: 'Thương hiệu Việt', d: 'Khám phá các nhãn bia nội địa quen thuộc.', attr: 'data-cat="noidia"', imgs: ['bia-viet.png', 'bia-ha-noi.png', 'bia-saigon-lager.png']},
  {t: 'Bia quốc tế', d: 'Các thương hiệu bia nhập khẩu và quốc tế.', attr: 'data-cat="quocte"', imgs: ['heineken-silver.png', 'sapporo-premium.png', 'corona-extra.png']},
  {t: 'Dòng Saigon', d: 'Xem các sản phẩm thuộc thương hiệu Saigon.', attr: 'data-brand="Saigon"', imgs: ['saigon-chill.png', 'saigon-export.png', 'bia-saigon-lager.png']}];
$('#promoGrid').innerHTML = PROMOS.map(p => `<article class="pcard"><span class="tag">Minh họa</span>
  <div class="imgs">${p.imgs.map(f => `<img src="Images/products/${f}" alt="" loading="lazy">`).join('')}</div>
  <h3>${p.t}</h3><p>${p.d}</p><button class="btn sm" ${p.attr}>Xem nhóm này</button></article>`).join('');

/* ---------- Hiệu ứng hiện dần khi cuộn tới ---------- */
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; el.classList.add('in'); io.unobserve(el);
    // chạy xong thì gỡ class để hiệu ứng hover của thẻ hoạt động bình thường
    setTimeout(() => el.classList.remove('rv', 'in'), 1000 + parseFloat(el.style.getPropertyValue('--d') || 0) * 1000);
  }), {threshold: 0.12, rootMargin: '0px 0px -30px 0px'});
  document.querySelectorAll('main h2, .cat, .chip, .pcard, .about > *, .revTop > *, .news .card, .nl, #featGrid, #grid, .promo p').forEach(el => {
    el.style.setProperty('--d', Math.min([...el.parentElement.children].indexOf(el), 6) * 0.07 + 's');   // xuất hiện lần lượt
    el.classList.add('rv'); io.observe(el);
  });
}

/* ---------- Form liên hệ ---------- */
$('#ctForm').addEventListener('submit', e => {
  e.preventDefault();
  const n = $('#cName').value.trim(), m = $('#cMail').value.trim(), t = $('#cText').value.trim();
  let err = '';
  if (n.length < 2) err = 'Vui lòng nhập họ tên.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) err = 'Email chưa đúng định dạng.';
  else if (t.length < 10) err = 'Nội dung cần ít nhất 10 ký tự.';
  $('#cErr').textContent = err;
  if (err) return;
  e.target.reset(); toast('Cảm ơn bạn đã liên hệ BREWÉ!');
});

/* ---------- Bong bóng bay lên ở hero ---------- */
(function () {
  const hero = $('.hero');
  if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div'); box.className = 'bubbles'; box.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span'), z = 6 + Math.random() * 14;
    s.style.cssText = `left:${Math.random() * 100}%;width:${z}px;height:${z}px;animation-duration:${7 + Math.random() * 7}s;animation-delay:${-Math.random() * 10}s`;
    box.appendChild(s);
  }
  hero.appendChild(box);
})();
