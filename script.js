const objects = [];
let drawState = '';
// contoh flow drawState line : '' -> 'Line' -> 'Line2' -> ''

const canvas = document.getElementById('canvas');
const drawButtons = document.querySelectorAll('.draw-button');
const drawStatus = document.getElementById('draw-status');

drawButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    drawAction(e.target.id);
  });
});

const drawAction = (model) => {
  if (drawState == '') {
    drawStatus.innerHTML = `Drawing ${model} ...`;
    drawState = model;
    if (model == 'line') {
      objects.push(new Line(objects.length));
    } else if (model == 'square') {
      objects.push(new Square(objects.length));
    } else if (model == 'rectangle') {
      objects.push(new Rectangle(objects.length));
    } else if (model == 'polygon') {
      objects.push(new Polygon(objects.length));
    }
  } else {
    drawStatus.innerHTML = 'Please finish drawing the previous object';
  }
};

canvas.addEventListener('mousemove', (e) => {
  currentCoor = getMouseCoor(e);
  let obj = objects[objects.length - 1];

  if (drawState == 'line2') {
    obj.vertices[obj.vertices.length - 1].coor = currentCoor;
  } else if (drawState == 'square2') {
    startPointX = obj.vertices[0].coor[0];
    startPointY = obj.vertices[0].coor[1];
    endPointX = currentCoor[0];
    endPointY = currentCoor[1];

    squareSide = Math.max(dist([startPointX, startPointY], [endPointX, startPointY]), dist([startPointX, startPointY], [startPointX, endPointY]));

    if ( startPointX < endPointX ) {

      if ( startPointY < endPointY) { // Kuadran 1
        obj.vertices[1].coor = [startPointX, startPointY + squareSide];
        obj.vertices[2].coor = [startPointX + squareSide, startPointY];
        obj.vertices[3].coor = [startPointX + squareSide, startPointY];
        obj.vertices[4].coor = [startPointX + squareSide, startPointY + squareSide];
        obj.vertices[5].coor = [startPointX, startPointY + squareSide];

      } else { // Kuadran 4
        obj.vertices[1].coor = [startPointX, startPointY - squareSide];
        obj.vertices[2].coor = [startPointX + squareSide, startPointY];
        obj.vertices[3].coor = [startPointX + squareSide, startPointY];
        obj.vertices[4].coor = [startPointX + squareSide, startPointY - squareSide];
        obj.vertices[5].coor = [startPointX, startPointY - squareSide];

      }
      // console.log([obj.vertices[0].coor, obj.vertices[1].coor, obj.vertices[2].coor, obj.vertices[3].coor, obj.vertices[4].coor, obj.vertices[5].coor]);

    } else {

      if ( startPointY < endPointY) { // Kuadran 2
        obj.vertices[1].coor = [startPointX, startPointY + squareSide];
        obj.vertices[2].coor = [startPointX - squareSide, startPointY];
        obj.vertices[3].coor = [startPointX - squareSide, startPointY];
        obj.vertices[4].coor = [startPointX - squareSide, startPointY + squareSide];
        obj.vertices[5].coor = [startPointX, startPointY + squareSide];

      } else { // Kuadran 3
        obj.vertices[1].coor = [startPointX, startPointY - squareSide];
        obj.vertices[2].coor = [startPointX - squareSide, startPointY];
        obj.vertices[3].coor = [startPointX - squareSide, startPointY];
        obj.vertices[4].coor = [startPointX - squareSide, startPointY - squareSide];
        obj.vertices[5].coor = [startPointX, startPointY - squareSide];

      }

    }
    
    
  } else if (drawState == 'rectangle2') {
    startPointX = obj.vertices[0].coor[0];
    startPointY = obj.vertices[0].coor[1];
    endPointX = currentCoor[0];
    endPointY = currentCoor[1];

    obj.vertices[1].coor = [startPointX, endPointY];
    obj.vertices[2].coor = [endPointX, startPointY];
    obj.vertices[3].coor = [endPointX, startPointY];
    obj.vertices[4].coor = currentCoor;
    obj.vertices[5].coor = [startPointX, endPointY];
  }
});

canvas.addEventListener('mouseup', (e) => {
  currentCoor = getMouseCoor(e);
  let obj = objects[objects.length - 1];

  if (drawState == 'line') {
    drawState = 'line2';
    obj.vertices[0].coor = currentCoor;
    obj.vertices[1].coor = currentCoor;

  } else if (drawState == 'line2') {
    drawState = '';
    drawStatus.innerHTML = '...';

  } else if (drawState == 'square') {
    obj.vertices[0].coor = currentCoor;
    drawState = 'square2';

  } else if (drawState == 'square2') {
    drawState = '';
    drawStatus.innerHTML = '...';

  } else if (drawState == 'rectangle') {
    obj.vertices[0].coor = currentCoor;
    drawState = 'rectangle2';

  } else if (drawState == 'rectangle2') {
    drawState = '';
    drawStatus.innerHTML = '...';
  } else if (drawState == 'polygon') {

    let isFirstVertice = obj.vertices[0].coor[0] === 0 && obj.vertices[0].coor[1] === 0

    if (isFirstVertice){
      obj.vertices[0].coor = currentCoor;
    } else{
      obj.addVertex(currentCoor, [0, 0, 0, 1]);
    }
    
  }
});

canvas.addEventListener('dblclick', (e) => {
  if (drawState == 'polygon') {
    drawState = '';
    drawStatus.innerHTML = '...';
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
const dist = (p1, p2) => Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));

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