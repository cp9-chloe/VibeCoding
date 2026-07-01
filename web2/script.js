const timerForm = document.getElementById('timer-form');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const bgColorInput = document.getElementById('bg-color');
const bgImageInput = document.getElementById('bg-image');
const overlayColorInput = document.getElementById('overlay-color');
const message = document.getElementById('message');
const doorbellSound = document.getElementById('doorbell-sound');
const hoursEl = document.getElementById('hours-input');
const minutesEl = document.getElementById('minutes-input');
const secondsEl = document.getElementById('seconds-input');

let remainingSeconds = 0;
let countdownInterval = null;
let currentBackgroundColor = null;

function pad(value) {
  return String(value).padStart(2, '0');
}

function setBackgroundColor(color) {
  currentBackgroundColor = color;
  document.documentElement.style.setProperty('--bg-color', color);
}

function getRandomBackgroundColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 0.6 + Math.random() * 0.2;
  const lightness = 0.3 + Math.random() * 0.25;
  const candidate = hslToHex(hue, saturation, lightness);

  if (currentBackgroundColor && candidate.toLowerCase() === currentBackgroundColor.toLowerCase()) {
    return getRandomBackgroundColor();
  }

  return candidate;
}

function updateBackground() {
  const color = bgColorInput.value;
  const imageUrl = bgImageInput.value.trim();
  const overlay = overlayColorInput.value;

  setBackgroundColor(color);
  document.documentElement.style.setProperty('--overlay-color', hexToRgba(overlay, 0.35));

  if (imageUrl) {
    document.documentElement.style.setProperty('--bg-image', `url('${imageUrl}')`);
  } else {
    document.documentElement.style.setProperty('--bg-image', 'none');
  }

  updateEditableColor();
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0'))
    .join('')}`;
}

function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    switch (max) {
      case rNorm:
        h = 60 * (((gNorm - bNorm) / delta) % 6);
        break;
      case gNorm:
        h = 60 * (((bNorm - rNorm) / delta) + 2);
        break;
      default:
        h = 60 * (((rNorm - gNorm) / delta) + 4);
        break;
    }
  }

  return { h: (h + 360) % 360, s, l };
}

function hslToHex(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;

  if (huePrime >= 0 && huePrime < 1) {
    r = chroma;
    g = x;
  } else if (huePrime < 2) {
    r = x;
    g = chroma;
  } else if (huePrime < 3) {
    g = chroma;
    b = x;
  } else if (huePrime < 4) {
    g = x;
    b = chroma;
  } else if (huePrime < 5) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  const match = l - chroma / 2;
  return rgbToHex(
    Math.round((r + match) * 255),
    Math.round((g + match) * 255),
    Math.round((b + match) * 255),
  );
}

function getComplementaryColor(hex) {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex((h + 180) % 360, s, l);
}

function hexToRgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateEditableColor() {
  const baseHex = bgColorInput.value;
  const complementaryHex = getComplementaryColor(baseHex);

  if (document.getElementById('edit-color')) {
    document.getElementById('edit-color').value = complementaryHex;
  }

  document.documentElement.style.setProperty('--editable-bg', hexToRgba(complementaryHex, 0.20));
  document.documentElement.style.setProperty('--editable-input-bg', hexToRgba(complementaryHex, 0.16));
  document.documentElement.style.setProperty('--editable-border', hexToRgba(complementaryHex, 0.36));
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

  setBackgroundColor(bgColorInput.value);

  countdownInterval = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      message.textContent = 'Countdown complete!';
      if (doorbellSound) {
        doorbellSound.currentTime = 0;
        doorbellSound.play().catch(() => {});
      }
      return;
    }

    remainingSeconds -= 1;
    setTimerFromSeconds(remainingSeconds);
    setBackgroundColor(getRandomBackgroundColor());
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

updateBackground();
updateEditableColor();
normalizeInputs();
updateTimerMessage();
