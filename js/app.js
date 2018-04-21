(() => {
  const canvas = document.querySelector("#pong");
  const ctx = canvas.getContext("2d");
  const ball = {x: 140, y: 100, dx: 2, dy: 2, r: 10};

  const drawPlayer = (x, y, color) => {
    ctx.beginPath();
    ctx.rect(x, y, 7, 60);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  const drawUs = () => {
    drawPlayer(0, (canvas.height / 2) - 30, "red");
  };

  const drawThem = () => {
    drawPlayer(canvas.width - 7, (canvas.height / 2) - 30, "green");
  };

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
    drawUs();
    drawThem();
  }

  const update = () => {
    if (ball.x + ball.dx > canvas.width - ball.r || ball.x + ball.dx < ball.r) {
      ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy > canvas.height - ball.r || ball.y + ball.dy < ball.r) {
      ball.dy = -ball.dy;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
  }

  const score = () => {
    return ball.x < ball.r || ball.x > canvas.width - ball.r;
  };

  const pause = () => false;

  const tick = () => {
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
