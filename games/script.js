const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const attemptsEl = document.getElementById('attempts');
const difficultyLabel = document.getElementById('difficulty-label');
const menu = document.getElementById('menu');
const gameOverOverlay = document.getElementById('gameOver');
const gameOverText = document.getElementById('gameOverText');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const modeButtons = document.querySelectorAll('.mode-btn');

const difficultySettings = {
  easy: { speed: 4.4, gap: 220, spawnRate: 1.65, color: '#6ee7b7' },
  medium: { speed: 5.7, gap: 180, spawnRate: 1.35, color: '#fbbf24' },
  hard: { speed: 7.2, gap: 140, spawnRate: 1.02, color: '#fb7185' }
};

let difficulty = 'easy';
let attempts = 0;
let state = 'menu';
let player;
let obstacles = [];
let obstacleTimer = 0;
let lastTime = 0;
let musicTimer = null;
let audioCtx = null;
let masterGain = null;

const keys = { jump: false };

function init() {
  resetPlayer();
  render();
  bindEvents();
  updateHUD();
}

function bindEvents() {
  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      difficulty = button.dataset.mode;
      modeButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      updateHUD();
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
      event.preventDefault();
      if (state === 'menu' || state === 'gameover') {
        startGame();
      } else {
        jumpPlayer();
      }
    }
  });

  canvas.addEventListener('pointerdown', () => {
    if (state === 'menu' || state === 'gameover') {
      startGame();
    } else {
      jumpPlayer();
    }
  });
}

function resetPlayer() {
  player = {
    x: 80,
    y: canvas.height - 120,
    width: 38,
    height: 38,
    vy: 0,
    gravity: 0.42,
    jumpForce: 10.8,
    grounded: true
  };
}

function updateHUD() {
  attemptsEl.textContent = attempts;
  difficultyLabel.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function startGame() {
  state = 'playing';
  menu.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  resetPlayer();
  obstacles = [];
  obstacleTimer = 0;
  lastTime = performance.now();
  startMusic();
  requestAnimationFrame(loop);
}

function jumpPlayer() {
  if (player.grounded) {
    player.vy = -player.jumpForce;
    player.grounded = false;
  }
}

function loop(timestamp) {
  const delta = Math.min((timestamp - lastTime) / 16.67, 1.8);
  lastTime = timestamp;

  if (state === 'playing') {
    update(delta);
    render();
    requestAnimationFrame(loop);
  }
}

function update(delta) {
  player.vy += player.gravity * delta;
  player.y += player.vy * delta;

  const groundY = canvas.height - 90;
  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  const currentDifficulty = difficultySettings[difficulty];
  obstacleTimer += delta * 0.06;
  if (obstacleTimer >= currentDifficulty.spawnRate) {
    spawnObstacle();
    obstacleTimer = 0;
  }

  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const obstacle = obstacles[i];
    obstacle.x -= currentDifficulty.speed * delta;

    if (obstacle.x + obstacle.width < -20) {
      obstacles.splice(i, 1);
      continue;
    }

    if (checkCollision(player, obstacle)) {
      die();
      return;
    }
  }
}

function spawnObstacle() {
  const height = 120 + Math.random() * 90;
  const width = 24 + Math.random() * 18;
  const gap = difficultySettings[difficulty].gap;

  obstacles.push({
    x: canvas.width + 20,
    y: canvas.height - 90 - height,
    width,
    height,
    gap,
    color: difficultySettings[difficulty].color
  });
}

function checkCollision(player, obstacle) {
  const playerBox = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height
  };

  const obstacleBox = {
    x: obstacle.x,
    y: obstacle.y,
    width: obstacle.width,
    height: obstacle.height
  };

  return (
    playerBox.x < obstacleBox.x + obstacleBox.width &&
    playerBox.x + playerBox.width > obstacleBox.x &&
    playerBox.y < obstacleBox.y + obstacleBox.height &&
    playerBox.y + playerBox.height > obstacleBox.y
  );
}

function die() {
  if (state !== 'playing') return;
  state = 'gameover';
  attempts += 1;
  updateHUD();
  gameOverText.textContent = `Attempts: ${attempts}. Pick a new difficulty or try again.`;
  gameOverOverlay.classList.remove('hidden');
  stopMusic();
}

function render() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1d4ed8');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, canvas.height - 90, canvas.width, 90);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, canvas.height - 90, canvas.width, 6);

  drawPlayer();
  drawObstacles();
}

function drawPlayer() {
  ctx.fillStyle = '#facc15';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(player.x + 8, player.y + 10, 8, 8);
  ctx.fillRect(player.x + 22, player.y + 10, 8, 8);
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function startMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
  }

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.04;
    masterGain.connect(audioCtx.destination);
  }

  audioCtx.resume();
  const pattern = [261.63, 329.63, 392.0, 523.25];
  let index = 0;

  musicTimer = setInterval(() => {
    if (state !== 'playing') return;
    playTone(pattern[index % pattern.length], 0.26, 'sine');
    index += 1;
  }, 400);
}

function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function playTone(freq, duration, type) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

init();
