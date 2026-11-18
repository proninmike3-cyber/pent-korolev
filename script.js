'use strict';

// Navigation — no external dependencies.
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('#mobile-menu');
function closeNav() {
  navToggle?.setAttribute('aria-expanded', 'false');
  if (mobileNav) mobileNav.hidden = true;
  document.body.classList.remove('nav-open');
}
navToggle?.addEventListener('click', () => {
  const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(willOpen));
  mobileNav.hidden = !willOpen;
  document.body.classList.toggle('nav-open', willOpen);
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
window.addEventListener('resize', () => { if (window.innerWidth > 1020) closeNav(); });

// Menu: all prices from supplied PENT coffee menu card. No duplicate poster screenshot.
const menus = {
  classic: [
    ['Двойной эспрессо', '40 мл', '150 ₽'],
    ['Американо', '200 / 300 / 400 мл', '220 / 230 / 240 ₽'],
    ['Капучино', '200 / 300 / 400 мл', '250 / 260 / 270 ₽'],
    ['Латте', '300 / 400 мл', '280 / 310 ₽'],
    ['Флэт-уайт', '200 / 300 / 400 мл', '260 / 280 / 300 ₽'],
    ['Раф', '300 / 400 мл', '330 / 350 ₽'],
    ['Моккачино', '300 мл', '350 ₽'],
    ['Горячий шоколад', '300 мл', '350 ₽'],
    ['Какао', '300 мл', '300 ₽']
  ],
  signature: [
    ['Раф апельсин', '300 / 400 мл', '350 / 400 ₽'],
    ['Малиновый латте', '300 / 400 мл', '350 / 400 ₽']
  ],
  punch: [
    ['Манго-маракуйя', '400 мл', '350 ₽'],
    ['Черника-мята', '400 мл', '350 ₽'],
    ['Ягодный', '400 мл', '350 ₽'],
    ['Облепиха-апельсин', '400 мл', '350 ₽'],
    ['Клюква-апельсин', '400 мл', '350 ₽']
  ],
  extras: [
    ['Альтернативное молоко', '', '+100 ₽'],
    ['Дополнительный эспрессо', '', '+80 ₽'],
    ['Сиропы в ассортименте', '', '+50 ₽']
  ]
};
const menuList = document.querySelector('#menu-list');
const menuTabs = [...document.querySelectorAll('.menu-tab')];
function showMenu(category) {
  const items = menus[category];
  if (!items || !menuList) return;
  menuTabs.forEach(tab => {
    const active = tab.dataset.menu === category;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  menuList.replaceChildren(...items.map(([name, size, price]) => {
    const item = document.createElement('div'); item.className = 'menu-entry';
    const label = document.createElement('span'); label.textContent = name;
    if (size) { const sub = document.createElement('small'); sub.textContent = size; label.appendChild(sub); }
    const value = document.createElement('strong'); value.textContent = price;
    item.append(label, value);
    return item;
  }));
}
menuTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showMenu(tab.dataset.menu));
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? menuTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + menuTabs.length) % menuTabs.length;
    menuTabs[nextIndex].focus(); showMenu(menuTabs[nextIndex].dataset.menu);
  });
});
showMenu('classic');

// Demonstration only. Availability values are examples, NEVER actual reservations.
const daysBox = document.querySelector('#booking-days');
const slotsBox = document.querySelector('#booking-slots');
const bookingChoice = document.querySelector('#booking-choice');
const guestsSelect = document.querySelector('#guests');
const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const today = new Date(); today.setHours(0,0,0,0);
const dates = Array.from({length:7}, (_, i) => { const d = new Date(today); d.setDate(d.getDate()+i); return d; });
let activeDay = 0;
let selectedSlot = null;
const sampleHours = ['15:00','17:00','19:00','21:00','23:00'];
const sampleCounts = [10,8,6,4,3];
function remaining(dayOffset, index) {
  return Math.min(10, Math.max(1, sampleCounts[index] - ((dayOffset * 2 + index) % 3)));
}
function formatDate(d) { return `${d.getDate()} ${months[d.getMonth()]}`; }
function renderDates() {
  if (!daysBox) return;
  daysBox.replaceChildren(...dates.map((date, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'booking-day' + (i === activeDay ? ' active' : '');
    b.setAttribute('role','tab'); b.setAttribute('aria-selected', String(i === activeDay));
    b.setAttribute('aria-label', `${weekdays[date.getDay()]}, ${formatDate(date)}`);
    const short = document.createElement('span'); short.textContent = weekdays[date.getDay()];
    const num = document.createElement('strong'); num.textContent = String(date.getDate());
    b.append(short, num);
    b.addEventListener('click', () => { activeDay = i; selectedSlot = null; renderDates(); renderSlots(); });
    return b;
  }));
}
function renderSlots() {
  if (!slotsBox) return;
  const people = Number(guestsSelect?.value || 2);
  slotsBox.replaceChildren(...sampleHours.map((hour, index) => {
    const count = remaining(activeDay,index), disabled = count < people;
    const b = document.createElement('button'); b.type='button';
    b.className = 'booking-slot' + (selectedSlot === index ? ' selected' : '');
    b.disabled = disabled;
    b.setAttribute('aria-pressed', String(selectedSlot === index));
    const time = document.createElement('strong'); time.textContent = hour;
    const seats = document.createElement('span'); seats.textContent = disabled ? `Пример: ${count} мест` : `Пример: ${count} из 10 мест`;
    b.append(time,seats);
    b.addEventListener('click', () => { selectedSlot = index; renderSlots(); });
    return b;
  }));
  if (bookingChoice) {
    bookingChoice.textContent = selectedSlot === null
      ? 'Выберите удобное время.'
      : `${formatDate(dates[activeDay])} в ${sampleHours[selectedSlot]}, ${people} ${people === 1 ? 'гость' : people <= 4 ? 'гостя' : 'гостей'}. Подтвердите по телефону.`;
  }
}
guestsSelect?.addEventListener('change', () => { if (selectedSlot !== null && remaining(activeDay, selectedSlot) < Number(guestsSelect.value)) selectedSlot = null; renderSlots(); });
renderDates(); renderSlots();