const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');

const GRAVITY = 0.42;
const FLAP = -5.7;
const PIPE_WIDTH = 64;
const PIPE_GAP = 150;
const GROUND_HEIGHT = 70;

let bird;
let pipes = [];
let score = 0;
let gameRunning = false;
let spawnTimer = 0;
let animationId = null;
let lastTime = 0;

function resetGame() {
  bird = {
    x: 90,
    y: canvas.height / 2,
    radius: 16,
    velocity: 0
  };
  pipes = [];
  score = 0;
  gameRunning = true;
  spawnTimer = 0;
  lastTime = 0;
  overlay.classList.add('hidden');
}

function startGame() {
  resetGame();
  animationId = requestAnimationFrame(loop);
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = (timestamp - lastTime) / 16.67;
  lastTime = timestamp;

  update(delta);
  draw();

  if (gameRunning) {
    animationId = requestAnimationFrame(loop);
  }
}

function update(delta) {
  bird.velocity += GRAVITY * delta;
  bird.y += bird.velocity * delta;

  spawnTimer += delta;
  if (spawnTimer > 95) {
    spawnPipe();
    spawnTimer = 0;
  }

  for (let i = pipes.length - 1; i >= 0; i -= 1) {
    const pipe = pipes[i];
    pipe.x -= 3.2 * delta;

    if (pipe.x + PIPE_WIDTH < 0) {
      pipes.splice(i, 1);
    }

    if (pipe.x + PIPE_WIDTH < bird.x && !pipe.scored) {
      pipe.scored = true;
      score += 1;
    }

    if (checkCollision(bird, pipe)) {
      endGame();
      return;
    }
  }

  if (bird.y + bird.radius >= canvas.height - GROUND_HEIGHT || bird.y - bird.radius <= 0) {
    endGame();
  }
}

function spawnPipe() {
  const minTopHeight = 60;
  const gap = PIPE_GAP;
  const maxTopHeight = canvas.height - GROUND_HEIGHT - gap - minTopHeight;
  const topHeight = minTopHeight + Math.random() * maxTopHeight;

  pipes.push({
    x: canvas.width,
    topHeight,
    scored: false,
    gap
  });
}

function checkCollision(bird, pipe) {
  const birdLeft = bird.x - bird.radius;
  const birdRight = bird.x + bird.radius;
  const birdTop = bird.y - bird.radius;
  const birdBottom = bird.y + bird.radius;

  const pipeTopBottom = pipe.topHeight;
  const pipeBottomTop = pipe.topHeight + pipe.gap;

  const pipeRectLeft = pipe.x;
  const pipeRectRight = pipe.x + PIPE_WIDTH;

  const hitsTop = birdRight > pipeRectLeft && birdLeft < pipeRectRight && birdTop < pipeTopBottom;
  const hitsBottom = birdRight > pipeRectLeft && birdLeft < pipeRectRight && birdBottom > pipeBottomTop;

  return hitsTop || hitsBottom;
}

function endGame() {
  gameRunning = false;
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <h1>Game Over</h1>
    <p>Score: ${score}</p>
    <button id="restartButton">Play Again</button>
  `;
  document.getElementById('restartButton').addEventListener('click', startGame);
  if (animationId) cancelAnimationFrame(animationId);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);

  ctx.fillStyle = '#8ddf6a';
  ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 120, 32);

  ctx.fillStyle = '#ffdf00';
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3a7d44';
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    ctx.fillRect(pipe.x, pipe.topHeight + pipe.gap, PIPE_WIDTH, canvas.height - GROUND_HEIGHT - (pipe.topHeight + pipe.gap));
  });
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    if (!gameRunning) {
      startGame();
    } else {
      bird.velocity = FLAP;
    }
  }
});

startButton.addEventListener('click', startGame);
