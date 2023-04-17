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

function ddaAlgorithm(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const step = Math.abs(Math.max(dx, dy));
  const increment = {
    x: dx / step,
    y: dy / step,
  };
  console.log(increment);

  const position = [];
  let x = x1;
  let y = y1;

  while (x != x2 && y != y2) {
    position.push({
      x: x / 400,
      y: y / 400,
    });

    x += increment.x;
    y += increment.y;
  }

  return position;
}

function main() {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");
  const renderBtn = document.getElementById("render-btn");

  const shaderProgram = initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!shaderProgram) {
    alert("Gagal dalam menginisiasi program shader");
    return;
  }
  gl.useProgram(shaderProgram);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  renderBtn.addEventListener("click", () => {
    const x1 = parseFloat(document.getElementById("x1").value);
    const y1 = parseFloat(document.getElementById("y1").value);
    const x2 = parseFloat(document.getElementById("x2").value);
    const y2 = parseFloat(document.getElementById("y2").value);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
    const position = ddaAlgorithm(x1, y1, x2, y2);
    position.forEach((pos) => {
      gl.vertexAttrib3f(a_Position, pos.x, pos.y, 0.0);
      gl.drawArrays(gl.POINTS, 0, 1);
    });
  });
}
