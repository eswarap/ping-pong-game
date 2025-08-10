const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PADDLE_MARGIN = 20;
const PADDLE_SPEED = 6;

// Ball properties
const BALL_SIZE = 14;
const BALL_SPEED = 5;

// State
let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

function resetBall() {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Mouse controls for left paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - PADDLE_HEIGHT / 2;
  leftPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddleY));
});

// Main game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function update() {
  // Ball position
  ballX += ballVX;
  ballY += ballVY;

  // Wall collision (top/bottom)
  if (ballY <= 0) {
    ballY = 0;
    ballVY *= -1;
  }
  if (ballY + BALL_SIZE >= HEIGHT) {
    ballY = HEIGHT - BALL_SIZE;
    ballVY *= -1;
  }

  // Paddle collision (left)
  if (
    ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= leftPaddleY &&
    ballY <= leftPaddleY + PADDLE_HEIGHT
  ) {
    ballX = PADDLE_MARGIN + PADDLE_WIDTH;
    ballVX *= -1;
    // Add a bit of "english" based on where it hit
    let hitPos = (ballY + BALL_SIZE / 2) - (leftPaddleY + PADDLE_HEIGHT / 2);
    ballVY = hitPos * 0.2;
  }

  // Paddle collision (right)
  if (
    ballX + BALL_SIZE >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
    ballY + BALL_SIZE >= rightPaddleY &&
    ballY <= rightPaddleY + PADDLE_HEIGHT
  ) {
    ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
    ballVX *= -1;
    let hitPos = (ballY + BALL_SIZE / 2) - (rightPaddleY + PADDLE_HEIGHT / 2);
    ballVY = hitPos * 0.2;
  }

  // Score (left/right wall)
  if (ballX < 0 || ballX > WIDTH) {
    resetBall();
  }

  // AI for right paddle
  if (ballY + BALL_SIZE / 2 < rightPaddleY + PADDLE_HEIGHT / 2) {
    rightPaddleY -= PADDLE_SPEED;
  } else if (ballY + BALL_SIZE / 2 > rightPaddleY + PADDLE_HEIGHT / 2) {
    rightPaddleY += PADDLE_SPEED;
  }
  rightPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddleY));
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw net
  ctx.strokeStyle = "#444";
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(
    WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    rightPaddleY,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );

  // Draw ball
  ctx.fillStyle = "#fff";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Start the game
resetBall();
loop();
