const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.9, 1.0, 1.0, 1.0); // background canvas: light blue

const vertexSource = `
  attribute vec4 vPosition;
  attribute vec4 vColor;
  varying vec4 fColor;
  void main(){
    gl_Position = vPosition;
    fColor = vColor;
  }
`;

const fragmentSource = `
  precision mediump float;
  varying vec4 fColor;
  void main(){
    gl_FragColor = fColor;
  }
`;

const program = initShaders(gl);
gl.useProgram(program);

render();

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  objects.forEach((obj) => {
    obj.render(gl);
  });

  window.requestAnimationFrame(render);
}


function initShaders(gl) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  return program;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  return shader;
}