const VSHADER_SOURCE = `
attribute vec4 a_Position;

void main() {
  gl_Position = a_Position;
  gl_PointSize = 1.0;
}`;

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

function clear(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function main() {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");
  const btn = document.getElementById("btn");

  const shaderProgram = initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!shaderProgram) {
    alert("Gagal dalam menginisiasi program shader");
    return;
  }
  gl.useProgram(shaderProgram);

  const a_Position = gl.getAttribLocation(shaderProgram, "a_Position");

  btn.addEventListener("click", () => {
    const x1 = parseFloat(document.getElementById("x1").value);
    const y1 = parseFloat(document.getElementById("y1").value);
    const x2 = parseFloat(document.getElementById("x2").value);
    const y2 = parseFloat(document.getElementById("y2").value);

    const position = ddaAlgorithm(x1, y1, x2, y2);

    clear(gl);
    for (let i = 0; i < position.length; i++) {
      const pos = position[i];
      gl.vertexAttrib3f(a_Position, pos.x, pos.y, 0.0);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  });

  canvas.addEventListener("click", (ev) => {
    click(ev, canvas, gl, a_Position);
  });

  clear(gl);
}

function ddaAlgorithm(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const step = Math.abs(Math.max(dx, dy));
  const increment = {
    x: dx / step,
    y: dy / step,
  };
  const position = [
    {
      x: x1,
      y: y1,
    },
  ];
  let x = x1;
  let y = y1;

  while (x != x2 && y != y2) {
    x += increment.x;
    y += increment.y;

    position.push({
      x: x / 400,
      y: y / 400,
    });
  }

  return position;
}

function getPosition(mouseX, mouseY, rect, canvasWidth, canvasHeight) {
  const x = (mouseX - rect.left - canvasWidth / 2) / (canvasWidth / 2);
  const y = (canvasHeight / 2 - (mouseY - rect.top)) / (canvasHeight / 2);
  return { x, y };
}

function click(ev, canvas, gl, a_Position) {
  const mouseX = ev.clientX;
  const mouseY = ev.clientY;
  const rect = ev.target.getBoundingClientRect();
  const { x, y } = getPosition(
    mouseX,
    mouseY,
    rect,
    canvas.width,
    canvas.height
  );

  const position = ddaAlgorithm(0.0, 0.0, x * 400, y * 400);

  clear(gl);
  for (let i = 0; i < position.length; i++) {
    const pos = position[i];
    gl.vertexAttrib3f(a_Position, pos.x, pos.y, 0.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
