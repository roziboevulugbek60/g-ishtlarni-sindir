
// ==========================================
// NEON BREAKER
// Developed by Ulug'bek.R
// ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// GAME ELEMENTS
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const levelElement = document.getElementById("level");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startBtn = document.getElementById("startBtn");

// GAME SETTINGS
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let score = 0;
let lives = 3;
let level = 1;

let gameState = "ready";

let rightPressed = false;
let leftPressed = false;

const paddle = {
    x: WIDTH / 2 - 60,
    y: HEIGHT - 35,
    width: 120,
    height: 12,
    speed: 8
};

const ball = {
    x: WIDTH / 2,
    y: HEIGHT - 60,
    radius: 9,
    dx: 4,
    dy: -4,
    speed: 4
};

// BRICK SETTINGS
const brickSettings = {
    rows: 5,
    columns: 9,
    width: 72,
    height: 22,
    padding: 10,
    top: 70,
    left: 20
};

const colors = [
    "#ff3864",
    "#ff8c42",
    "#ffe45e",
    "#39e6a5",
    "#00d9ff"
];

let bricks = [];

// CREATE BRICKS
function createBricks() {
    bricks = [];

    for (let row = 0; row < brickSettings.rows; row++) {
        bricks[row] = [];

        for (let col = 0; col < brickSettings.columns; col++) {
            bricks[row][col] = {
                x: brickSettings.left +
                    col * (brickSettings.width + brickSettings.padding),

                y: brickSettings.top +
                    row * (brickSettings.height + brickSettings.padding),

                width: brickSettings.width,
                height: brickSettings.height,
                active: true,
                color: colors[row % colors.length]
            };
        }
    }
}

// RESET BALL
function resetBall() {
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - 20;

    ball.speed = 4 + (level - 1) * 0.5;
    ball.dx = ball.speed * 0.7;
    ball.dy = -Math.sqrt(
        ball.speed * ball.speed - ball.dx * ball.dx
    );
}

// RESET GAME
function resetGame() {
    score = 0;
    lives = 3;
    level = 1;

    paddle.x = WIDTH / 2 - paddle.width / 2;

    createBricks();
    resetBall();
    updateInfo();
}

// UPDATE INFORMATION
function updateInfo() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    levelElement.textContent = level;
}

// OVERLAY
function showOverlay(title, message, buttonText) {
    overlayTitle.textContent = title;
    overlayText.textContent = message;
    startBtn.textContent = buttonText;

    overlay.style.display = "flex";
}

// START GAME
function startGame() {
    if (gameState === "ready" ||
        gameState === "paused" ||
        gameState === "lost" ||
        gameState === "won") {

        if (gameState === "lost" || gameState === "won") {
            resetGame();
        }

        gameState = "running";
        overlay.style.display = "none";
    }
}

// PAUSE GAME
function pauseGame() {
    if (gameState === "running") {
        gameState = "paused";

        showOverlay(
            "PAUSED",
            "Press SPACE to continue",
            "RESUME"
        );
    } else if (gameState === "paused") {
        startGame();
    }
}

// KEYBOARD CONTROLS
document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();

    if (key === "arrowright" || key === "d") {
        rightPressed = true;
        event.preventDefault();
    }

    if (key === "arrowleft" || key === "a") {
        leftPressed = true;
        event.preventDefault();
    }

    if (event.code === "Space") {
        event.preventDefault();

        if (gameState === "running") {
            pauseGame();
        } else {
            startGame();
        }
    }
});

document.addEventListener("keyup", function(event) {
    const key = event.key.toLowerCase();

    if (key === "arrowright" || key === "d") {
        rightPressed = false;
    }

    if (key === "arrowleft" || key === "a") {
        leftPressed = false;
    }
});

// PADDLE POSITION
function keepPaddleInside() {
    paddle.x = Math.max(
        0,
        Math.min(WIDTH - paddle.width, paddle.x)
    );
}

// MOUSE CONTROL
canvas.addEventListener("mousemove", function(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;

    const mouseX = (event.clientX - rect.left) * scaleX;

    paddle.x = mouseX - paddle.width / 2;

    keepPaddleInside();
});

// TOUCH CONTROL
canvas.addEventListener("touchstart", function(event) {
    event.preventDefault();

    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;

    paddle.x =
        (touch.clientX - rect.left) * scaleX -
        paddle.width / 2;

    keepPaddleInside();
}, { passive: false });

canvas.addEventListener("touchmove", function(event) {
    event.preventDefault();

    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;

    paddle.x =
        (touch.clientX - rect.left) * scaleX -
        paddle.width / 2;

    keepPaddleInside();
}, { passive: false });

// BACKGROUND
function drawBackground() {
    ctx.fillStyle = "#090e20";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < 40; i++) {
        const x = (i * 137) % WIDTH;
        const y = (i * 79) % HEIGHT;

        ctx.fillStyle = "rgba(0, 217, 255, 0.2)";
        ctx.fillRect(x, y, 2, 2);
    }
}

// DRAW PADDLE
function drawPaddle() {
    ctx.save();

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00eaff";

    const gradient = ctx.createLinearGradient(
        paddle.x,
        paddle.y,
        paddle.x,
        paddle.y + paddle.height
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#00bfff");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.roundRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height,
        8
    );

    ctx.fill();
    ctx.restore();
}

// DRAW BALL
function drawBall() {
    ctx.save();

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#00eaff";

    const gradient = ctx.createRadialGradient(
        ball.x - 3,
        ball.y - 3,
        1,
        ball.x,
        ball.y,
        ball.radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#00cfff");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();
    ctx.restore();
}

// DRAW BRICKS
function drawBricks() {
    bricks.forEach(row => {
        row.forEach(brick => {
            if (!brick.active) return;

            ctx.save();

            ctx.shadowBlur = 12;
            ctx.shadowColor = brick.color;

            ctx.fillStyle = brick.color;

            ctx.beginPath();
            ctx.roundRect(
                brick.x,
                brick.y,
                brick.width,
                brick.height,
                5
            );

            ctx.fill();
            ctx.restore();
        });
    });
}

// MOVE PADDLE
function movePaddle() {
    if (rightPressed) {
        paddle.x += paddle.speed;
    }

    if (leftPressed) {
        paddle.x -= paddle.speed;
    }

    keepPaddleInside();
}

// BALL MOVEMENT
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // WALL COLLISION
    if (ball.x + ball.radius >= WIDTH) {
        ball.x = WIDTH - ball.radius;
        ball.dx = -Math.abs(ball.dx);
    }

    if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
    }

    if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
    }

    // PADDLE COLLISION
    if (
        ball.dy > 0 &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width
    ) {
        ball.y = paddle.y - ball.radius;

        const hitPoint =
            (ball.x - (paddle.x + paddle.width / 2)) /
            (paddle.width / 2);

        ball.dx = hitPoint * ball.speed;

        ball.dy = -Math.sqrt(
            ball.speed * ball.speed - ball.dx * ball.dx
        );
    }

    // BALL FALLS
    if (ball.y - ball.radius > HEIGHT) {
        lives--;
        updateInfo();

        if (lives <= 0) {
            gameState = "lost";

            showOverlay(
                "GAME OVER",
                "Your final score: " + score,
                "PLAY AGAIN"
            );
        } else {
            resetBall();
        }
    }
}

// BRICK COLLISION
function checkBrickCollision() {
    for (const row of bricks) {
        for (const brick of row) {
            if (!brick.active) continue;

            if (
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height
            ) {
                brick.active = false;

                ball.dy *= -1;

                score += 10;
                updateInfo();

                return;
            }
        }
    }
}

// LEVEL CHECK
function checkLevel() {
    const remainingBricks = bricks.flat().filter(
        brick => brick.active
    ).length;

    if (remainingBricks === 0) {
        if (level >= 5) {
            gameState = "won";

            showOverlay(
                "YOU WIN!",
                "Amazing! Final score: " + score,
                "PLAY AGAIN"
            );

            return;
        }

        level++;

        createBricks();
        resetBall();
        updateInfo();
    }
}

// GAME LOOP
function gameLoop() {
    drawBackground();
    drawBricks();
    drawPaddle();
    drawBall();

    if (gameState === "running") {
        movePaddle();
        moveBall();

        if (gameState === "running") {
            checkBrickCollision();
            checkLevel();
        }
    }

    requestAnimationFrame(gameLoop);
}

// BUTTON
startBtn.addEventListener("click", startGame);

// INITIALIZATION
createBricks();
resetBall();
updateInfo();

showOverlay(
    "READY?",
    "Are you ready to break some bricks?",
    "START GAME"
);

gameLoop();

// ==========================================
// DEVELOPED BY ULUG'BEK.R
// ==========================================
