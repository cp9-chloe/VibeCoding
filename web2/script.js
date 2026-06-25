const targetDateInput = document.getElementById('target-date');
const bgColorInput = document.getElementById('bg-color');
const bgImageInput = document.getElementById('bg-image');
const overlayColorInput = document.getElementById('overlay-color');
const form = document.getElementById('settings-form');
const message = document.getElementById('message');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

let countdownInterval = null;

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateBackground() {
  const color = bgColorInput.value;
  const imageUrl = bgImageInput.value.trim();
  const overlay = overlayColorInput.value;

  document.documentElement.style.setProperty('--bg-color', color);
  document.documentElement.style.setProperty('--overlay-color', hexToRgba(overlay, 0.35));

  if (imageUrl) {
    document.documentElement.style.setProperty('--bg-image', `url('${imageUrl}')`);
  } else {
    document.documentElement.style.setProperty('--bg-image', 'none');
  }
}

function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateCountdown() {
  const targetValue = targetDateInput.value;
  if (!targetValue) {
    message.textContent = 'Choose a valid target date to begin countdown.';
    return;
  }

  const targetTime = new Date(targetValue).getTime();
  const now = Date.now();
  const difference = targetTime - now;

  if (difference <= 0) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    message.textContent = 'Countdown complete!';
    return;
  }

  const seconds = Math.floor((difference / 1000) % 60);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
  message.textContent = 'Countdown is running. Customize the background anytime.';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const targetValue = targetDateInput.value;
  if (!targetValue) {
    message.textContent = 'Please select a target date and time.';
    return;
  }

  const targetTime = new Date(targetValue).getTime();
  if (targetTime <= Date.now()) {
    message.textContent = 'The target date must be in the future.';
    return;
  }

  updateBackground();
  updateCountdown();

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(updateCountdown, 1000);
});

bgColorInput.addEventListener('input', updateBackground);
bgImageInput.addEventListener('input', updateBackground);
overlayColorInput.addEventListener('input', updateBackground);

updateBackground();
message.textContent = 'Pick a future date and customize the background.';
