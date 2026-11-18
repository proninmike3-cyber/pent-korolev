const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
    document.body.classList.toggle('menu-open', !expanded);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
      document.body.classList.remove('menu-open');
    });
  });
}

const bookingDaysEl = document.getElementById('booking-days');
const bookingSlotsEl = document.getElementById('booking-slots');
const bookingSelectedEl = document.getElementById('booking-selected');

const weekdayNames = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

function getDayTemplate(dayIndex) {
  if (dayIndex === 0) {
    return [
      { time: '15:00', seats: 8 },
      { time: '17:00', seats: 6 },
      { time: '19:00', seats: 5 },
      { time: '21:00', seats: 4, note: 'Киновечер' },
      { time: '23:00', seats: 3 },
    ];
  }

  if (dayIndex === 5 || dayIndex === 6) {
    return [
      { time: '15:00', seats: 7 },
      { time: '17:00', seats: 6 },
      { time: '19:00', seats: 4 },
      { time: '21:00', seats: 3 },
      { time: '23:00', seats: 2 },
      { time: '01:00', seats: 4 },
    ];
  }

  return [
    { time: '15:00', seats: 9 },
    { time: '17:00', seats: 8 },
    { time: '19:00', seats: 6 },
    { time: '21:00', seats: 5 },
    { time: '23:00', seats: 4 },
  ];
}

function generateBookingData() {
  const today = new Date();
  const days = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayIndex = date.getDay();
    const slots = getDayTemplate(dayIndex).map((slot, slotIndex) => {
      const adjustment = (i + slotIndex) % 3;
      const seats = Math.max(1, slot.seats - (adjustment === 2 ? 1 : 0));
      return {
        ...slot,
        seats,
      };
    });

    days.push({
      id: i,
      date,
      title: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : `${date.getDate()} ${monthNames[date.getMonth()]}`,
      weekday: weekdayNames[dayIndex],
      slots,
    });
  }

  return days;
}

const bookingData = generateBookingData();
let activeDay = 0;

function renderDayButtons() {
  if (!bookingDaysEl) return;

  bookingDaysEl.innerHTML = bookingData.map((item, index) => `
    <button class="booking-day ${index === activeDay ? 'active' : ''}" type="button" data-index="${index}" role="tab" aria-selected="${index === activeDay}">
      <span class="weekday">${item.weekday}</span>
      <span class="daynum">${item.date.getDate()}</span>
    </button>
  `).join('');

  bookingDaysEl.querySelectorAll('.booking-day').forEach((button) => {
    button.addEventListener('click', () => {
      activeDay = Number(button.dataset.index);
      renderBooking();
    });
  });
}

function renderSlots(day) {
  return day.slots.map((slot) => {
    const lowClass = slot.seats <= 3 ? 'low' : '';
    const specialClass = slot.note ? 'special' : '';

    return `
      <article class="slot-card ${lowClass} ${specialClass}">
        <div>
          <span class="slot-label">${slot.note || 'Свободный слот'}</span>
          <div class="slot-time">${slot.time}</div>
        </div>
        <span class="slot-seats">Осталось ${slot.seats} из 10</span>
      </article>
    `;
  }).join('');
}

function renderBooking() {
  if (!bookingSlotsEl || !bookingSelectedEl) return;

  const day = bookingData[activeDay];
  renderDayButtons();

  bookingSelectedEl.innerHTML = `<strong>${day.title}</strong> · ${day.date.getDate()} ${monthNames[day.date.getMonth()]}<br>Показываем доступные часы и ориентировочный остаток мест. Финальное подтверждение брони — у администратора.`;
  bookingSlotsEl.innerHTML = renderSlots(day);
}

if (bookingData.length) {
  renderBooking();
}