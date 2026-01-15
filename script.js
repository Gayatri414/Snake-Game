const board = document.querySelector(".board");
const scoreEl = document.getElementById("score");

const modal = document.querySelector(".modal");
const startModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");

const blockSize = 50;
const cols = board.clientWidth / blockSize;
const rows = board.clientHeight / blockSize;

const blocks = {};
let intervalId = null;

// GAME STATE
let score = 0;
let snake = [];
let food = null;
let direction = "right";
let nextDirection = "right";

// CREATE GRID
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

// FOOD
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
  } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
  return newFood;
}

// RENDER
function render() {
  Object.values(blocks).forEach(b =>
    b.classList.remove("fill", "food")
  );

  snake.forEach(seg => {
    blocks[`${seg.y}-${seg.x}`]?.classList.add("fill");
  });

  blocks[`${food.y}-${food.x}`]?.classList.add("food");
}

// GAME LOOP
function gameLoop() {
  direction = nextDirection;

  let head = { ...snake[0] };

  if (direction === "left") head.x--;
  if (direction === "right") head.x++;
  if (direction === "up") head.y--;
  if (direction === "down") head.y++;

  // WALL COLLISION
  if (
    head.x < 0 || head.x >= cols ||
    head.y < 0 || head.y >= rows
  ) {
    endGame();
    return;
  }

  // SELF COLLISION
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // FOOD
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = generateFood();
  } else {
    snake.pop();
  }

  render();
}

// START GAME
function startGame() {
  clearInterval(intervalId);

  score = 0;
  scoreEl.textContent = score;

  snake = [{ x: 2, y: 4 }];
  direction = "right";
  nextDirection = "right";
  food = generateFood();

  modal.style.display = "none";
  startModal.style.display = "flex";
  gameOverModal.style.display = "none";

  render();
  intervalId = setInterval(gameLoop, 300);
}

// END GAME
function endGame() {
  clearInterval(intervalId);
  modal.style.display = "flex";
  startModal.style.display = "none";
  gameOverModal.style.display = "flex";
}

// CONTROLS (NO DIAGONAL)
addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "down") nextDirection = "up";
  if (e.key === "ArrowDown" && direction !== "up") nextDirection = "down";
  if (e.key === "ArrowLeft" && direction !== "right") nextDirection = "left";
  if (e.key === "ArrowRight" && direction !== "left") nextDirection = "right";
});

// BUTTONS
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
