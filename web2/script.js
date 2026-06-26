const timerForm = document.getElementById('timer-form');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const bgColorInput = document.getElementById('bg-color');
const bgImageInput = document.getElementById('bg-image');
const overlayColorInput = document.getElementById('overlay-color');
const editColorInput = document.getElementById('edit-color');
const message = document.getElementById('message');
const hoursEl = document.getElementById('hours-input');
const minutesEl = document.getElementById('minutes-input');
const secondsEl = document.getElementById('seconds-input');

let remainingSeconds = 0;
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

function updateEditableColor() {
  const hex = editColorInput.value;
  // column/background for editable area a bit more translucent
  document.documentElement.style.setProperty('--editable-bg', hexToRgba(hex, 0.12));
  // inputs slightly less translucent
  document.documentElement.style.setProperty('--editable-input-bg', hexToRgba(hex, 0.10));
}

function getInputValue(input, max) {
  const value = Number(input.value);
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }
  if (typeof max === 'number') {
    return Math.min(value, max);
  }
  return value;
}

function normalizeInputs() {
  const hours = getInputValue(hoursInput);
  const minutes = getInputValue(minutesInput, 59);
  const seconds = getInputValue(secondsInput, 59);
  hoursInput.value = hours;
  minutesInput.value = minutes;
  secondsInput.value = seconds;
}

function setTimerFromSeconds(total) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  hoursInput.value = hours;
  minutesInput.value = minutes;
  secondsInput.value = seconds;
}

function updateTimerMessage() {
  const hours = getInputValue(hoursInput);
  const minutes = getInputValue(minutesInput, 59);
  const seconds = getInputValue(secondsInput, 59);

  if (countdownInterval) {
    message.textContent = 'Countdown is running...';
    return;
  }

  if (hours === 0 && minutes === 0 && seconds === 0) {
    message.textContent = 'Customize the background and set your timer values.';
  } else {
    message.textContent = 'Ready to start your countdown.';
  }
}

function startCountdown(event) {
  event.preventDefault();
  normalizeInputs();

  const hours = getInputValue(hoursInput);
  const minutes = getInputValue(minutesInput, 59);
  const seconds = getInputValue(secondsInput, 59);
  remainingSeconds = hours * 3600 + minutes * 60 + seconds;

  if (remainingSeconds <= 0) {
    message.textContent = 'Enter a duration greater than zero to start the countdown.';
    return;
  }

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      message.textContent = 'Countdown complete!';
      return;
    }

    remainingSeconds -= 1;
    setTimerFromSeconds(remainingSeconds);
    message.textContent = 'Countdown is running...';
  }, 1000);
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

hoursInput.addEventListener('input', () => {
  stopCountdown();
  normalizeInputs();
  updateTimerMessage();
});

minutesInput.addEventListener('input', () => {
  stopCountdown();
  normalizeInputs();
  updateTimerMessage();
});

secondsInput.addEventListener('input', () => {
  stopCountdown();
  normalizeInputs();
  updateTimerMessage();
});

timerForm.addEventListener('submit', startCountdown);
bgColorInput.addEventListener('input', updateBackground);
bgImageInput.addEventListener('input', updateBackground);
overlayColorInput.addEventListener('input', updateBackground);
editColorInput.addEventListener('input', updateEditableColor);

updateBackground();
updateEditableColor();
normalizeInputs();
updateTimerMessage();
