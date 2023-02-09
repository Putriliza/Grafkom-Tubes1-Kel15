const objects = [];
let drawState = '';
// contoh flow drawState line : '' -> 'Line' -> 'Line2' -> ''

const canvas = document.getElementById('canvas');

const drawAction = (model) => {
  if (drawState == '') {
    drawState = model;
    if (model == 'line') {
      objects.push(new Line(objects.length));
    }
  }
};

const mouseHandler = (e) => {
  currentCoor = getMouseCoor(e);
  let obj = objects[objects.length - 1];

  if (drawState == 'line2') {
    obj.vertices[obj.vertices.length - 1].coor = currentCoor;
  }
};

canvas.addEventListener('mouseup', (e) => {
  currentCoor = getMouseCoor(e);
  let obj = objects[objects.length - 1];

  if (drawState == 'line') {
    drawState = 'line2';
    obj.vertices[0].coor = currentCoor;
  } else if (drawState == 'line2') {
    drawState = '';
  }
});


// GL ----------------------------------------------------------------------------------------------
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

// UTIL --------------------------------------------------------------------------------------------
const dist = (p1, p2) => (Math.sqrt(Math.pow(p1[0] - p2[0])) + (Math.pow(p1[1] - p2[1])))

const getMouseCoor = (e) => {
  const x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
  const y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
  return [x, y];
};

function flatten(v) {
    let n = v.length * v[0].length;
    const floats = new Float32Array(n);
  
    let i = 0;
    v.forEach((row) => {
      row.forEach((col) => {
        floats[i++] = col;
      });
    });
    
    return floats;
  }