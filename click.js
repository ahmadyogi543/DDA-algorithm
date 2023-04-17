const VSHADER_SOURCE = `
attribute vec4 a_Position;

void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;
}`;

const FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;

void main() {
  gl_FragColor = u_FragColor;
}`;

const points = [];

function clear(gl, r, g, b, a) {
  gl.clearColor(r, g, b, a);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function getPosition(mouseX, mouseY, rect, canvasWidth, canvasHeight) {
  const x = (mouseX - rect.left - canvasWidth / 2) / (canvasWidth / 2);
  const y = (canvasHeight / 2 - (mouseY - rect.top)) / (canvasHeight / 2);
  return { x, y };
}

function click(ev, canvas, gl, a_Position, u_FragColor) {
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
  if (x >= 0.0 && y >= 0.0) {
    points.push({ pos: { x, y }, color: { r: 1.0, g: 0.0, b: 0.0, a: 1.0 } });
  } else if (x < 0.0 && y < 0.0) {
    points.push({ pos: { x, y }, color: { r: 0.0, g: 1.0, b: 0.0, a: 1.0 } });
  } else {
    points.push({ pos: { x, y }, color: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 } });
  }

  clear(gl, 0.0, 0.0, 0.0, 1.0);
  for (const vertex of points) {
    const { pos, color } = vertex;
    gl.vertexAttrib3f(a_Position, pos.x, pos.y, 0.0);
    gl.uniform4f(u_FragColor, color.r, color.g, color.b, color.a);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

function main() {
  const canvas = document.getElementById("canvas");
  const btn = document.getElementById("clear-btn");
  const gl = canvas.getContext("webgl");

  const shaderProgram = initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!shaderProgram) {
    alert("Gagal dalam menginisiasi program shader");
    return;
  }
  gl.useProgram(shaderProgram);
  const a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
  const u_FragColor = gl.getUniformLocation(shaderProgram, "u_FragColor");

  canvas.addEventListener("click", (ev) => {
    click(ev, canvas, gl, a_Position, u_FragColor);
  });
  btn.addEventListener("click", () => {
    while (points.length > 0) {
      points.pop();
    }
    clear(gl, 0.0, 0.0, 0.0, 1.0);
  });

  clear(gl, 0.0, 0.0, 0.0, 1.0);
}
