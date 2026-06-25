const bgColorInput = document.getElementById('bg-color');
const bgImageInput = document.getElementById('bg-image');
const overlayColorInput = document.getElementById('overlay-color');
const message = document.getElementById('message');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const controlButtons = document.querySelectorAll('.control-column button');

let hours = 0;
let minutes = 0;
let seconds = 0;
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

function updateTimerDisplay() {
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

function normalizeTime() {
  if (seconds >= 60) {
    minutes += Math.floor(seconds / 60);
    seconds %= 60;
  }
  if (seconds < 0) {
    const borrow = Math.ceil(Math.abs(seconds) / 60);
    minutes -= borrow;
    seconds += borrow * 60;
  }

  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes %= 60;
  }
  if (minutes < 0) {
    const borrow = Math.ceil(Math.abs(minutes) / 60);
    hours -= borrow;
    minutes += borrow * 60;
  }

  if (hours < 0) {
    hours = 0;
  }
  if (minutes < 0) {
    minutes = 0;
  }
  if (seconds < 0) {
    seconds = 0;
  }
}

function changeTime(unit, delta) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  if (unit === 'hours') {
    hours += delta;
  }
  if (unit === 'minutes') {
    minutes += delta;
  }
  if (unit === 'seconds') {
    seconds += delta;
  }

  normalizeTime();
  updateTimerDisplay();
  message.textContent = 'Time updated. Press any button to continue customizing.';
}

function startCountdown() {
  if (hours === 0 && minutes === 0 && seconds === 0) {
    message.textContent = 'Set a duration before starting the countdown.';
    return;
  }

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      message.textContent = 'Countdown complete!';
      return;
    }

    if (seconds > 0) {
      seconds -= 1;
    } else if (minutes > 0) {
      minutes -= 1;
      seconds = 59;
    } else if (hours > 0) {
      hours -= 1;
      minutes = 59;
      seconds = 59;
    }

    updateTimerDisplay();
    message.textContent = 'Countdown in progress...';
  }, 1000);
}

controlButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const unit = button.dataset.unit;
    const action = button.dataset.action;
    const delta = action === 'increment' ? 1 : -1;
    changeTime(unit, delta);
  });
});

const startButton = document.createElement('button');
startButton.type = 'button';
startButton.textContent = 'Start Countdown';
startButton.className = 'start-button';
startButton.addEventListener('click', startCountdown);

const countdownCard = document.querySelector('.countdown-card');
countdownCard.appendChild(startButton);

bgColorInput.addEventListener('input', updateBackground);
bgImageInput.addEventListener('input', updateBackground);
overlayColorInput.addEventListener('input', updateBackground);

updateBackground();
updateTimerDisplay();
message.textContent = 'Customize the background and set your timer values.';
