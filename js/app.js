(() => {
  const canvas = document.querySelector("#pong");
  const ctx = canvas.getContext("2d");
  const ball = {x: 140, y: 100, dx: 2, dy: 2, r: 10};
  const paddleHeight = 80;
  const paddleWidth = 7;
  const paddleStart = (canvas.height - paddleHeight) / 2;
  const us = {x: canvas.width - paddleWidth, y: paddleStart, color: "red"};
  const them = {x: 0, y: paddleStart, color: "green"};

  let time = 0;
  let lastHit = -10000;

  const drawPlayer = (p) => {
    ctx.beginPath();
    ctx.rect(p.x, p.y, paddleWidth, paddleHeight);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.closePath();
  }

  const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "rgba(240, 90, 240, 1.0)";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayer(us);
    drawPlayer(them);
  }

  const weHit = () => {
    return ball.x > canvas.width - ball.r - paddleWidth && ball.y >= us.y && ball.y < us.y + paddleHeight;
  }

  const theyHit = () => {
    return ball.x < ball.r + paddleWidth && ball.y >= them.y && ball.y < them.y + paddleHeight;
  }

  const moveX = () => {
    ball.x += ball.dx;
  }

  const moveY = () => {
    ball.y += ball.dy;
  }

  const update = () => {
    if (weHit() || theyHit()) {
      lastHit = time;
      ball.dx = -ball.dx;
      moveX();
    }

    if (ball.y > canvas.height - ball.r || ball.y < ball.r) {
      ball.dy = -ball.dy;
    }

    moveX();
    moveY();
  }

  const score = () => {
    return ball.x < ball.r || ball.x > canvas.width - ball.r;
  };

  const pause = () => false;

  const tick = () => {
    time++;
    draw();
    update();
    if (score()) {
      console.log("win")
      pause();
    } else {
      requestAnimationFrame(tick);
    }
  }

  tick();
})()
