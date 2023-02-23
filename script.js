const objects = [];
let drawState = '';
let hovered_object_id = -1;
let hovered_vertex_id = -1;
let selected_object_id = -1;
let selected_vertex_id = -1;
let currentCoor = [0, 0];

console.log(hovered_object_id)
console.log(hovered_vertex_id)
console.log(selected_object_id)
console.log(selected_vertex_id)

// contoh flow drawState line : '' -> 'Line' -> 'Line2' -> ''

const canvas = document.getElementById('canvas');
const draw_buttons = document.querySelectorAll('.draw-button');
const draw_status = document.getElementById('draw-status');
const current_coor = document.getElementById('current-coor');
const sm_line = document.getElementById('special-method-line');
const sm_square = document.getElementById('special-method-square');
const sm_rectangle = document.getElementById('special-method-rectangle');
const sm_polygon = document.getElementById('special-method-polygon');

draw_buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    drawAction(e.target.id);
  });
});

// set special method display
setSpecialMethodDisplay = () => {
  const setter = (line, square, rectangle, polygon) => {
    sm_line.style.display = line;
    sm_square.style.display = square
    sm_rectangle.style.display = rectangle;
    sm_polygon.style.display = polygon;
  }

  if (selected_object_id != -1) {
    if (objects[selected_object_id].getModelName() == 'Line') {
      setter('block', 'none', 'none', 'none');
    } else if (objects[selected_object_id].getModelName() == 'Square') {
      setter('none', 'block', 'none', 'none');
    } else if (objects[selected_object_id].getModelName() == 'Rectangle') {
      setter('none', 'none', 'block', 'none');
    } else if (objects[selected_object_id].getModelName() == 'Polygon') {
      setter('none', 'none', 'none', 'block');
    }
  } else {
    setter('none', 'none', 'none', 'none');
  }
}


const drawAction = (model) => {
  if (drawState == '') {
    draw_status.innerHTML = `Drawing ${model} ...`;
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
    draw_status.innerHTML = 'Please finish drawing the previous object';
  }
};

canvas.addEventListener('mousemove', (e) => {
  currentCoor = getMouseCoor(e);
  let lastObj = objects[objects.length - 1];

  getActiveObject(currentCoor);

  // MODIFY OBJECT
  if (drawState == 'drag' || drawState == 'drag2') {
    drawState = 'drag2';
    objects[selected_object_id].moveVertex(selected_vertex_id, currentCoor);
    draw_status.innerHTML = `Dragging object ${selected_object_id} vertex ${selected_vertex_id} ...`;
  } else if (drawState == 'translation') {
    objects[selected_object_id].translation(currentCoor);
    draw_status.innerHTML = `Translation object ${selected_object_id} ...`;
  }
  
  
  // DRAW NEW OBJECT
  else if (drawState == 'line2') {
    lastObj.moveVertex(1, currentCoor);
  } else if (drawState == 'square2') {
    startPointX = lastObj.vertices[0].coor[0];
    startPointY = lastObj.vertices[0].coor[1];
    endPointX = currentCoor[0];
    endPointY = currentCoor[1];

    squareSide = Math.max(dist([startPointX, startPointY], [endPointX, startPointY]), dist([startPointX, startPointY], [startPointX, endPointY]));

    if ( startPointX < endPointX ) {

      if ( startPointY < endPointY) { // Kuadran 1
        lastObj.moveVertex(1, [startPointX, startPointY + squareSide])
        lastObj.moveVertex(2, [startPointX + squareSide, startPointY])
        // lastObj.moveVertex(3, [startPointX + squareSide, startPointY])
        lastObj.moveVertex(3, [startPointX + squareSide, startPointY + squareSide])
        // lastObj.moveVertex(5, [startPointX, startPointY + squareSide])


      } else { // Kuadran 4
        lastObj.moveVertex(1, [startPointX, startPointY - squareSide])
        lastObj.moveVertex(2, [startPointX + squareSide, startPointY])
        // lastObj.moveVertex(3, [startPointX + squareSide, startPointY])
        lastObj.moveVertex(3, [startPointX + squareSide, startPointY - squareSide])
        // lastObj.moveVertex(5, [startPointX, startPointY - squareSide])

      }
      // console.log([lastObj.vertices[0].coor, lastObj.vertices[1].coor, lastObj.vertices[2].coor, lastObj.vertices[3].coor, lastObj.vertices[4].coor, lastObj.vertices[5].coor]))

    } else {

      if ( startPointY < endPointY) { // Kuadran 2
        lastObj.moveVertex(1, [startPointX, startPointY + squareSide])
        lastObj.moveVertex(2, [startPointX - squareSide, startPointY])
        // lastObj.moveVertex(3, [startPointX - squareSide, startPointY])
        lastObj.moveVertex(3, [startPointX - squareSide, startPointY + squareSide])
        // lastObj.moveVertex(5, [startPointX, startPointY + squareSide])



      } else { // Kuadran 3
        lastObj.moveVertex(1, [startPointX, startPointY - squareSide])
        lastObj.moveVertex(2, [startPointX - squareSide, startPointY])
        // lastObj.moveVertex(3, [startPointX - squareSide, startPointY])
        lastObj.moveVertex(3, [startPointX - squareSide, startPointY - squareSide])
        // lastObj.moveVertex(5, [startPointX, startPointY - squareSide])

      }

    }
    
    
  } else if (drawState == 'rectangle2') {
    startPointX = lastObj.vertices[0].coor[0];
    startPointY = lastObj.vertices[0].coor[1];
    endPointX = currentCoor[0];
    endPointY = currentCoor[1];

    lastObj.moveVertex(1, [startPointX, endPointY])
    lastObj.moveVertex(2, [endPointX, startPointY])
    // lastObj.moveVertex(3, [endPointX, startPointY])
    lastObj.moveVertex(3, currentCoor)
    // lastObj.moveVertex(5, [startPointX, endPointY])
  }
});

console.log(objects)

canvas.addEventListener('dblclick', (e) => {
  if (drawState == 'polygon') {
    drawState = '';
    draw_status.innerHTML = '...';
  } else if (drawState == 'translation') {
    drawState = '';
    draw_status.innerHTML = '...';
  }
});

canvas.addEventListener('mouseup', (e) => {
  currentCoor = getMouseCoor(e);
  let lastObj = objects[objects.length - 1];
  if (drawState == '') {
    if (hovered_object_id != -1) {
      if (hovered_vertex_id != -1) {
      // SELECT VERTEX
        if (dist(currentCoor, objects[hovered_object_id].vertices[hovered_vertex_id].coor) < epsilon) {
          let clickedObject = objects[hovered_object_id];
          let clickedVertex = clickedObject.vertices[hovered_vertex_id]
          clickedVertex.isSelected = !clickedVertex.isSelected;
          selected_object_id = hovered_object_id;
          selected_vertex_id = hovered_vertex_id;

          if (clickedVertex.isSelected) {
            drawState = 'drag';

            objects.forEach((obj) => {
              obj.vertices.forEach((vertex) => {
                if (vertex != clickedVertex) {
                  vertex.isSelected = false
                }
              })
              obj.centroid.isSelected = false;
            })
          }
          return;
        }
      }

      // SELECT CENTROID
      if ((dist(currentCoor, objects[hovered_object_id].centroid.coor) < epsilon) ||
          (dist(currentCoor, objects[selected_object_id].centroid.coor) < epsilon)) {
        console.log('centroid')
        let clickedObject = objects[hovered_object_id];
        clickedObject.centroid.isSelected = !clickedObject.centroid.isSelected;
        selected_object_id = hovered_object_id;
        selected_vertex_id = -1;
        console.log(clickedObject.centroid.isSelected)

        drawState = 'translation';

        objects.forEach((obj) => {
          obj.vertices.forEach((vertex) => {
            vertex.isSelected = false
          })
          if (obj != clickedObject) {
            obj.centroid.isSelected = false;
          }
        })
      }
    } else {
      objects.forEach((obj) => {
        obj.vertices.forEach((vertex) => {
          vertex.isSelected = false;
        })
        obj.centroid.isSelected = false;
        selected_object_id = -1;
        selected_vertex_id = -1;
      })
    }
    setSpecialMethodDisplay();

  } else if (drawState == 'drag2') {
    drawState = '';
    draw_status.innerHTML = '...';
  } else if (drawState == 'line') {
    drawState = 'line2';
    lastObj.moveVertex(0, currentCoor);
    lastObj.moveVertex(1, currentCoor);

  } else if (drawState == 'line2') {
    drawState = '';
    draw_status.innerHTML = '...';

  } else if (drawState == 'square') {
    lastObj.moveVertex(0, currentCoor);
    drawState = 'square2';

  } else if (drawState == 'square2') {
    drawState = '';
    draw_status.innerHTML = '...';

  } else if (drawState == 'rectangle') {
    lastObj.moveVertex(0, currentCoor);
    drawState = 'rectangle2';

  } else if (drawState == 'rectangle2') {
    drawState = '';
    draw_status.innerHTML = '...';
  } else if (drawState == 'polygon') {

    let isFirstVertice = lastObj.vertices[0].coor[0] === 0 && lastObj.vertices[0].coor[1] === 0

    if (isFirstVertice){
      lastObj.moveVertex(0, currentCoor);
    } else{
      lastObj.addVertex(currentCoor, [0, 0, 0, 1]);
    }
    
  }
});



const getActiveObject = (currentCoor) => {
  let isExist = false;

  objects.forEach((obj) => {
    // Hover or Click Vertices
    obj.vertices.forEach((vertex) => {
      if (dist(vertex.coor, currentCoor) < epsilon) {
        if (hovered_object_id == -1) {
          hovered_object_id = obj.id;
          hovered_vertex_id = vertex.id;
          vertex.isHovered = true;
          obj.centroid.isHovered = true;

        } else if (hovered_object_id == obj.id) {
          
        } else {
          let oldObj = objects[hovered_object_id];
          let oldVertex = oldObj.vertices[hovered_vertex_id];
          if (dist(vertex.coor, currentCoor) < dist(oldVertex.coor, currentCoor)) {
            hovered_object_id = obj.id;
            hovered_vertex_id = vertex.id;
            vertex.isHovered = true;
            obj.centroid.isHovered = true;
            oldVertex.isHovered = false;
            oldObj.centroid.isHovered = false;
          }
        }
        isExist = true;
      }
    });

    // Hover or Click Objects
    if (dist(obj.centroid.coor, currentCoor) < epsilon) {
      if (hovered_object_id == -1) {
        hovered_object_id = obj.id;
        hovered_vertex_id = -1;
        obj.centroid.isHovered = true;
      } else if (hovered_object_id == obj.id) {

      } else {
        let oldObj = objects[hovered_object_id];
        if (dist(obj.centroid.coor, currentCoor) < dist(oldObj.centroid.coor, currentCoor)) {
          hovered_object_id = obj.id;
          hovered_vertex_id = -1;
          obj.centroid.isHovered = true;
          oldObj.centroid.isHovered = false;
        }
      }
      isExist = true;
    }
  });

  if (!isExist) {
    hovered_object_id = -1;
    hovered_vertex_id = -1;

    objects.forEach((obj) => {
      obj.vertices.forEach((vertex) => {
        vertex.isHovered = false;
      });
      obj.centroid.isHovered = false;
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
  current_coor.innerHTML = `Current Coordinates: [${x}, ${y}]`;
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

