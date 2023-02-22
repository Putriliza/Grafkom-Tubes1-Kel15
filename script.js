const objects = [];
let drawState = '';
let hovered_object_id = -1;
let hovered_vertex_id = -1;
let selected_object_id = -1;
let selected_vertex_id = -1;

// contoh flow drawState line : '' -> 'Line' -> 'Line2' -> ''

const canvas = document.getElementById('canvas');
const drawButtons = document.querySelectorAll('.draw-button');
const drawStatus = document.getElementById('draw-status');
const activeCoor = document.getElementById('active-coor');
const activeObject = document.getElementById('active-object');
const activeVertex = document.getElementById('active-vertex');


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
  let lastObj = objects[objects.length - 1];

  getActiveObject(currentCoor);
  
  if (drawState == 'drag' || drawState == 'drag2') {
    drawState = 'drag2';
    objects[selected_object_id].vertices[selected_vertex_id].setCoor(currentCoor);
    drawStatus.innerHTML = `Dragging object ${selected_object_id} vertex ${selected_vertex_id} ...`;
  } else if (drawState == 'line2') {
    lastObj.vertices[1].setCoor(currentCoor);
  } else if (drawState == 'square2') {
    startPointX = lastObj.vertices[0].coor[0];
    startPointY = lastObj.vertices[0].coor[1];
    endPointX = currentCoor[0];
    endPointY = currentCoor[1];

    squareSide = Math.max(dist([startPointX, startPointY], [endPointX, startPointY]), dist([startPointX, startPointY], [startPointX, endPointY]));

    if ( startPointX < endPointX ) {

      if ( startPointY < endPointY) { // Kuadran 1
        lastObj.vertices[1].setCoor([startPointX, startPointY + squareSide])
        lastObj.vertices[2].setCoor([startPointX + squareSide, startPointY])
        lastObj.vertices[3].setCoor([startPointX + squareSide, startPointY])
        lastObj.vertices[4].setCoor([startPointX + squareSide, startPointY + squareSide])
        lastObj.vertices[5].setCoor([startPointX, startPointY + squareSide])

      } else { // Kuadran 4
        lastObj.vertices[1].setCoor([startPointX, startPointY - squareSide])
        lastObj.vertices[2].setCoor([startPointX + squareSide, startPointY])
        lastObj.vertices[3].setCoor([startPointX + squareSide, startPointY])
        lastObj.vertices[4].setCoor([startPointX + squareSide, startPointY - squareSide])
        lastObj.vertices[5].setCoor([startPointX, startPointY - squareSide])

      }
      // console.log([lastObj.vertices[0].coor, lastObj.vertices[1].coor, lastObj.vertices[2].coor, lastObj.vertices[3].coor, lastObj.vertices[4].coor, lastObj.vertices[5].coor]))

    } else {

      if ( startPointY < endPointY) { // Kuadran 2
        lastObj.vertices[1].setCoor([startPointX, startPointY + squareSide])
        lastObj.vertices[2].setCoor([startPointX - squareSide, startPointY])
        lastObj.vertices[3].setCoor([startPointX - squareSide, startPointY])
        lastObj.vertices[4].setCoor([startPointX - squareSide, startPointY + squareSide])
        lastObj.vertices[5].setCoor([startPointX, startPointY + squareSide])

      } else { // Kuadran 3
        lastObj.vertices[1].setCoor([startPointX, startPointY - squareSide])
        lastObj.vertices[2].setCoor([startPointX - squareSide, startPointY])
        lastObj.vertices[3].setCoor([startPointX - squareSide, startPointY])
        lastObj.vertices[4].setCoor([startPointX - squareSide, startPointY - squareSide])
        lastObj.vertices[5].setCoor([startPointX, startPointY - squareSide])

      }

    }
    
    
  } else if (drawState == 'rectangle2') {
    startPointX = lastObj.vertices[0].coor[0];
    startPointY = lastObj.vertices[0].coor[1];
    endPointX = currentCoor[0];
    endPointY = currentCoor[1];

    lastObj.vertices[1].setCoor([startPointX, endPointY])
    lastObj.vertices[2].setCoor([endPointX, startPointY])
    lastObj.vertices[3].setCoor([endPointX, startPointY])
    lastObj.vertices[4].setCoor(currentCoor)
    lastObj.vertices[5].setCoor([startPointX, endPointY])
  }
});


canvas.addEventListener('mouseup', (e) => {
  currentCoor = getMouseCoor(e);
  let lastObj = objects[objects.length - 1];
  if (drawState == '') {
    if (hovered_object_id != -1 && hovered_vertex_id != -1) {
      if (dist(currentCoor, objects[hovered_object_id].vertices[hovered_vertex_id].coor) < epsilon) {
        let clickedVertex = objects[hovered_object_id].vertices[hovered_vertex_id]
        clickedVertex.isSelected = !clickedVertex.isSelected;
        selected_object_id = hovered_object_id;
        selected_vertex_id = hovered_vertex_id;
        drawState = 'drag';

        if (clickedVertex.isSelected) {
          objects.forEach((obj) => {
            obj.vertices.forEach((vertex) => {
              if (vertex != clickedVertex) {
                vertex.isSelected = false;
              }
            })
          })
        }
      }
    } else {
      objects.forEach((obj) => {
        obj.vertices.forEach((vertex) => {
          vertex.isSelected = false;
        })
      })
    }
  } else if (drawState == 'drag2') {
    drawState = '';
    drawStatus.innerHTML = '...';
  } else if (drawState == 'line') {
    drawState = 'line2';
    lastObj.vertices[0].setCoor(currentCoor)
    lastObj.vertices[1].setCoor(currentCoor)

  } else if (drawState == 'line2') {
    drawState = '';
    drawStatus.innerHTML = '...';

  } else if (drawState == 'square') {
    lastObj.vertices[0].setCoor(currentCoor);
    drawState = 'square2';

  } else if (drawState == 'square2') {
    drawState = '';
    drawStatus.innerHTML = '...';

  } else if (drawState == 'rectangle') {
    lastObj.vertices[0].setCoor(currentCoor);
    drawState = 'rectangle2';

  } else if (drawState == 'rectangle2') {
    drawState = '';
    drawStatus.innerHTML = '...';
  } else if (drawState == 'polygon') {

    let isFirstVertice = lastObj.vertices[0].coor[0] === 0 && lastObj.vertices[0].coor[1] === 0

    if (isFirstVertice){
      lastObj.vertices[0].setCoor(currentCoor);
    } else{
      lastObj.addVertex(currentCoor, [0, 0, 0, 1]);
    }
    
  }
});

canvas.addEventListener('dblclick', (e) => {
  if (drawState == 'polygon') {
    drawState = '';
    drawStatus.innerHTML = '...';
  }
});

const getActiveObject = (currentCoor) => {
  let isExist = false;
  objects.forEach((obj) => {
    obj.vertices.forEach((vertex) => {
      if (dist(vertex.coor, currentCoor) < epsilon) {
        if (hovered_object_id == -1) {
          hovered_object_id = obj.id;
          hovered_vertex_id = vertex.id;
          activeObject.innerHTML = `Active object : ${hovered_object_id}`;
          activeVertex.innerHTML = `Active vertex : [${vertex.coor}]`;
          vertex.isHovered = true;

        } else if (hovered_object_id == obj.id) {
          
        } else {
          let oldVertex = objects[hovered_object_id].vertices[hovered_vertex_id];
          if (dist(vertex.coor, currentCoor) < dist(oldVertex.coor, currentCoor)) {
            hovered_object_id = obj.id;
            hovered_vertex_id = vertex.id;
            activeObject.innerHTML = `Active object : ${hovered_object_id}`;
            activeVertex.innerHTML = `Active vertex : [${vertex.coor}]`;
            vertex.isHovered = true;
            oldVertex.isHovered = false;
          } else {

          }
        }
        isExist = true;
      }
    });
  });
  if (!isExist) {
    hovered_object_id = -1;
    hovered_vertex_id = -1;
    activeObject.innerHTML = `Active object : ${hovered_object_id}`;
    activeVertex.innerHTML = `Active vertex : ${hovered_vertex_id}`;

    objects.forEach((obj) => {
      obj.vertices.forEach((vertex) => {
        vertex.isHovered = false;
      });
    });
  }
};

console.log(objects);

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
  activeCoor.innerHTML = `Current Coordinates: [${x}, ${y}]`;
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

const epsilon = 0.02;

