const objects = [];
let drawState = '';
let hoveredObjectId = -1;
let hoveredVertexId = -1;
let selectedObjectId = -1;
let selectedVertexId = -1;
let currentCoor = [0, 0];
// contoh flow drawState line : '' -> 'Line' -> 'Line2' -> ''

const canvas = document.getElementById('canvas');
const draw_buttons = document.querySelectorAll('.draw-button');
const draw_status = document.getElementById('draw-status');
const current_coor = document.getElementById('current-coor');
const active_object = document.getElementById('active-object');

// SPECIAL METHOD LINE
const sm_line = document.getElementById('special-method-line');
const line_length_slider = document.getElementById('line-length-slider');
const line_length_value = document.getElementById('line-length-value');
const rotation_degree_slider = document.getElementById('rotation-degree-slider');
const rotation_degree_value = document.getElementById('rotation-degree-value');
const delete_vertex_button = document.getElementById('delete-vertex-btn');
const convex_hull_button = document.getElementById('convex-hull-button');
const change_color_input = document.getElementById('change-color-input');

const save_objects_button = document.getElementById('save-objects-button');
const load_objects_button = document.getElementById('load-objects-button');
const animate_button = document.getElementById('animate-button');
const file = document.getElementById('file');
var filePath = '';

animate_button.addEventListener('click', (e) =>{
  if (selectedObjectId != -1){
    objects[selectedObjectId].animate()
    
  }
})

line_length_slider.addEventListener('input', (e) => {
  const length = parseFloat(e.target.value);
  line_length_value.innerHTML = `Length: ${length}`;
  if (selectedObjectId != -1) {
    if (objects[selectedObjectId].getModelName() == 'Line') {
      objects[selectedObjectId].setLength(length)
    }
  }
  console.log(objects[selectedObjectId].getLength());
});

rotation_degree_slider.addEventListener('input', (e) => {
  const degree = e.target.value;

  if (selectedObjectId != -1) {
    objects[selectedObjectId].rotate(degree) 
  }
  rotation_degree_value.innerHTML = `Rotation degree: ${degree}`  
});

delete_vertex_button.addEventListener('click', (e) => {
  if (selectedObjectId != -1) {
    objects[selectedObjectId].deleteVertex(selectedVertexId)
  }
});

convex_hull_button.addEventListener('click', (e) => {
  if (selectedObjectId != -1) {
    let hull = convexHull(objects[selectedObjectId].vertices);

    objects[selectedObjectId].vertices.forEach(objVertices => {
      let isHull = false;

      hull.forEach(h => {
        if (objVertices.id == h.id) {
          isHull = true;
        }
      });

      if (!isHull) {
        objects[selectedObjectId].deleteVertex(objVertices.id);
      }
    });
  }  
})

change_color_input.addEventListener('input', (e)=>{
  if (selectedObjectId != -1) {
    
    hexColor = e.target.value

    var rgbaColor = [1]
    const [r, g, b] = hexColor.match(/\w\w/g).map(x => parseInt(x, 16)/256);
    rgbaColor.unshift(b)
    rgbaColor.unshift(g)
    rgbaColor.unshift(r)
  
    // Update Object's color
    if (selectedVertexId === -1) {
      objects[selectedObjectId].vertices.forEach(vertex =>{
        vertex.color = rgbaColor
      })
    } else {
      objects[selectedObjectId].vertices[selectedVertexId].color = rgbaColor;
    }
  }
})

save_objects_button.addEventListener('click', (e) => {
  console.log(objects);
  const json = JSON.stringify(objects);
  saveToFile(json, 'objects.json');
})

file.addEventListener("change", function(event) {
  filePath = file.value.split("\\").pop();
});

load_objects_button.addEventListener('click', (e) => {
  if (filePath != '') {
    loadObjectsFromJsonFileAndAddToCanvas(objects, '../test/' + filePath);
  }
})

// SPECIAL METHOD SQUARE
const sm_square = document.getElementById('special-method-square');
const square_length_slider = document.getElementById('square-length-slider');
const square_length_value = document.getElementById('square-length-value');

square_length_slider.addEventListener('input', (e) => {
  const length = parseFloat(e.target.value);
  square_length_value.innerHTML = `Side Length: ${length}`;
  if (selectedObjectId != -1) {
    if (objects[selectedObjectId].getModelName() == 'Square') {
      objects[selectedObjectId].setLength(length);
    }
  }
  console.log(objects[selectedObjectId].getLength());
});

// SPECIAL METHOD RECTANGLE
const sm_rectangle = document.getElementById('special-method-rectangle');
const rectangle_length_slider = document.getElementById('rectangle-length-slider');
const rectangle_length_value = document.getElementById('rectangle-length-value');
const rectangle_width_slider = document.getElementById('rectangle-width-slider');
const rectangle_width_value = document.getElementById('rectangle-width-value');

rectangle_length_slider.addEventListener('input', (e) => {
  const length = parseFloat(e.target.value);
  rectangle_length_value.innerHTML = `Length: ${length}`;
  if (selectedObjectId != -1) {
    if (objects[selectedObjectId].getModelName() == 'Rectangle') {
      objects[selectedObjectId].setLength(length);
    }
  }
  console.log(objects[selectedObjectId].getLength());
});

rectangle_width_slider.addEventListener('input', (e) => {
  const width = parseFloat(e.target.value);
  rectangle_width_value.innerHTML = `Width: ${width}`;
  if (selectedObjectId != -1) {
    if (objects[selectedObjectId].getModelName() == 'Rectangle') {
      objects[selectedObjectId].setWidth(width);
    }
  }
  console.log(objects[selectedObjectId].getWidth());
});



// SPECIAL METHOD POLYGON
const sm_polygon = document.getElementById('special-method-polygon');

// set property display
const setPropertyDisplay = () => {
  const setter = (line, square, rectangle, polygon) => {
    sm_line.style.display = line;
    sm_square.style.display = square
    sm_rectangle.style.display = rectangle;
    sm_polygon.style.display = polygon;
  }

  if (selectedObjectId != -1) {
    if (objects[selectedObjectId].getModelName() == 'Line') {
      setter('block', 'none', 'none', 'none');
      line_length_slider.value = objects[selectedObjectId].getLength();
      line_length_value.innerHTML = `Length: ${line_length_slider.value}`
    } else if (objects[selectedObjectId].getModelName() == 'Square') {
      setter('none', 'block', 'none', 'none');
      square_length_slider.value = objects[selectedObjectId].getLength();
      square_length_value.innerHTML = `Side Length: ${square_length_slider.value}`
    } else if (objects[selectedObjectId].getModelName() == 'Rectangle') {
      setter('none', 'none', 'block', 'none');
      rectangle_length_slider.value = objects[selectedObjectId].getLength();
      rectangle_length_value.innerHTML = `Length: ${rectangle_length_slider.value}`
      rectangle_width_slider.value = objects[selectedObjectId].getWidth();
      rectangle_width_value.innerHTML = `Width: ${rectangle_width_slider.value}`
    } else if (objects[selectedObjectId].getModelName() == 'Polygon') {
      setter('none', 'none', 'none', 'block');
    } else {
      setter('none', 'none', 'none', 'none');
      active_object.innerHTML = 'Object unknown';
    }
    active_object.innerHTML = `[${selectedObjectId}] ${objects[selectedObjectId].getModelName()}`;
  } else {
    setter('none', 'none', 'none', 'none');
    active_object.innerHTML = 'No object selected';
  }
}

const setDrawStatus = () => {
  switch (drawState) {
    case '':
      draw_status.innerHTML = 'No action, click a button to draw';
      break;
    case 'vertex-selected':
      draw_status.innerHTML = `Selecting vertex ${selectedVertexId} of object ${selectedObjectId}`;
      break;
    case 'drag':
      draw_status.innerHTML = `Dragging object ${selectedObjectId} ...`;
      break;
    case 'drag2':
      draw_status.innerHTML = `Dragging object ${selectedObjectId} vertex ${selectedVertexId} ...`;
      break;
    case 'translation':
      draw_status.innerHTML = `Translating object ${selectedObjectId}, double click to finish ...`;
      break;
    case 'dilation':
      draw_status.innerHTML = `Dilating + Rotating object ${selectedObjectId}, click to finish ...`;
      break;
    case 'line':
      draw_status.innerHTML = 'Drawing line, choose first vertex ...';
      break;
    case 'line2':
      draw_status.innerHTML = 'Drawing line, click to finish ...';
      break;
    case 'square':
      draw_status.innerHTML = 'Drawing square, choose first vertex ...';
      break;
    case 'square2':
      draw_status.innerHTML = 'Drawing square, click to finish ...';
      break;
    case 'rectangle':
      draw_status.innerHTML = 'Drawing rectangle, choose first vertex ...';
      break;
    case 'rectangle2':
      draw_status.innerHTML = 'Drawing rectangle, click to finish ...';
      break;
    case 'polygon':
      draw_status.innerHTML = 'Drawing polygon, choose first vertex ...';
      break;
    case 'polygon2':
      draw_status.innerHTML = 'Drawing polygon, click to add vertex or double click to finish ...';
      break;
    default:
      if (selectedObjectId != -1) {
        draw_status.innerHTML = `Modifying object ${selectedObjectId}, click center to translate or click vertex to dilate + rotate`;
      } else {
        draw_status.innerHTML = 'No action, click a button to draw';
      }
      break;
  }
}

draw_buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    drawAction(e.target.id);
  });
});


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
    let isMoving = objects[selectedObjectId].type == 'Square' || 'Rectangle'
    objects[selectedObjectId].moveVertex(selectedVertexId, currentCoor, isMoving);

  } else if (drawState == 'translation') {
    objects[selectedObjectId].translation(currentCoor);

  } else if (drawState == 'dilation') {
    objects[selectedObjectId].dilateAndRotate(selectedVertexId, currentCoor);
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
        lastObj.moveVertex(3, [startPointX + squareSide, startPointY + squareSide])

      } else { // Kuadran 4
        lastObj.moveVertex(1, [startPointX, startPointY - squareSide])
        lastObj.moveVertex(2, [startPointX + squareSide, startPointY])
        lastObj.moveVertex(3, [startPointX + squareSide, startPointY - squareSide])

      }

    } else {

      if ( startPointY < endPointY) { // Kuadran 2
        lastObj.moveVertex(1, [startPointX, startPointY + squareSide])
        lastObj.moveVertex(2, [startPointX - squareSide, startPointY])
        lastObj.moveVertex(3, [startPointX - squareSide, startPointY + squareSide])

      } else { // Kuadran 3
        lastObj.moveVertex(1, [startPointX, startPointY - squareSide])
        lastObj.moveVertex(2, [startPointX - squareSide, startPointY])
        lastObj.moveVertex(3, [startPointX - squareSide, startPointY - squareSide])

      }

    }
    
    
  } else if (drawState == 'rectangle2') {
    startPointX = lastObj.vertices[0].coor[0];
    startPointY = lastObj.vertices[0].coor[1];
    endPointX = currentCoor[0];
    endPointY = currentCoor[1];

    lastObj.moveVertex(1, [startPointX, endPointY])
    lastObj.moveVertex(2, [endPointX, startPointY])
    lastObj.moveVertex(3, currentCoor)
  } else if (drawState =='polygon2') {
    lastObj.moveVertex(lastObj.vertices.length - 1, currentCoor);
  }

  setDrawStatus();
  setPropertyDisplay();
});


canvas.addEventListener('dblclick', (e) => {
  if (drawState == 'polygon2') {
    objects[objects.length - 1].removeLastTwoVertices();
    drawState = '';

  } else if (drawState == 'translation') {
    drawState = '';
    selectedObjectId = -1;
    selectedVertexId = -1;
  }
  setDrawStatus();
  setPropertyDisplay();
});

canvas.addEventListener('mouseup', (e) => {
  currentCoor = getMouseCoor(e);
  let lastObj = objects[objects.length - 1];
  if (drawState == '') {
    if (hoveredObjectId != -1) {
      if (hoveredVertexId != -1) {
      // SELECT VERTEX
        if (dist(currentCoor, objects[hoveredObjectId].vertices[hoveredVertexId].coor) < epsilon) {
          let clickedObject = objects[hoveredObjectId];
          let clickedVertex = clickedObject.vertices[hoveredVertexId]
          clickedVertex.isSelected = !clickedVertex.isSelected;
          selectedObjectId = hoveredObjectId;
          setPropertyDisplay();
          selectedVertexId = hoveredVertexId;

          if (clickedVertex.isSelected) {
            drawState = 'vertex-selected';

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
      if ((dist(currentCoor, objects[hoveredObjectId].centroid.coor) < epsilon) ||
          (dist(currentCoor, objects[selectedObjectId].centroid.coor) < epsilon)) {
        let clickedObject = objects[hoveredObjectId];
        clickedObject.centroid.isSelected = !clickedObject.centroid.isSelected;
        selectedObjectId = hoveredObjectId;
        setPropertyDisplay();
        selectedVertexId = -1;
        console.log(clickedObject.centroid.isSelected)

        //drawState = 'translation';
        drawState = 'selected'

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
        selectedObjectId = -1;
        setPropertyDisplay();
        selectedVertexId = -1;
      })
    }
  } else if (drawState == 'drag2') {
    drawState = '';
  } else if (drawState == 'vertex-selected') {
      if (hoveredVertexId == selectedVertexId){
        drawState = 'drag';
      }else{
        objects[hoveredObjectId].vertices[selectedVertexId].isSelected = false
        selectedVertexId = hoveredVertexId
        objects[hoveredObjectId].vertices[selectedVertexId].isSelected = true
      } 
  } else if (drawState == 'selected') {

    if (hoveredObjectId != -1) {
      if (hoveredVertexId != -1) {
        if (dist(currentCoor, objects[hoveredObjectId].vertices[hoveredVertexId].coor) < epsilon) {
          let clickedObject = objects[hoveredObjectId];
          let clickedVertex = clickedObject.vertices[hoveredVertexId]
          clickedVertex.isSelected = !clickedVertex.isSelected;
          selectedObjectId = hoveredObjectId;
          setPropertyDisplay();
          selectedVertexId = hoveredVertexId;

          if (clickedVertex.isSelected) {
            
            drawState = 'dilation';

            objects.forEach((obj) => {
              obj.vertices.forEach((vertex) => {
                
                if (vertex != clickedVertex) {
                  vertex.isSelected = false
                }
              })
              obj.centroid.isSelected = false;
            })
          }
        }
      }

      // SELECT CENTROID
      if ((dist(currentCoor, objects[hoveredObjectId].centroid.coor) < epsilon) ||
          (dist(currentCoor, objects[selectedObjectId].centroid.coor) < epsilon)) {
        let clickedObject = objects[hoveredObjectId];
        clickedObject.centroid.isSelected = !clickedObject.centroid.isSelected;
        selectedObjectId = hoveredObjectId;
        setPropertyDisplay();
        selectedVertexId = -1;
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
        selectedObjectId = -1;
        setPropertyDisplay();
        selectedVertexId = -1;
      })
    }
    
  } else if (drawState == 'dilation'){
    drawState = '';

  } else if (drawState == 'line') {
    drawState = 'line2';
    lastObj.moveVertex(0, currentCoor);
    lastObj.moveVertex(1, currentCoor);

  } else if (drawState == 'line2') {
    drawState = '';

  } else if (drawState == 'square') {
    lastObj.moveVertex(0, currentCoor);
    drawState = 'square2';

  } else if (drawState == 'square2') {
    drawState = '';

  } else if (drawState == 'rectangle') {
    lastObj.moveVertex(0, currentCoor);
    drawState = 'rectangle2';

  } else if (drawState == 'rectangle2') {
    drawState = '';

  } else if (drawState == 'polygon') {
    if (lastObj.isFirstVertex) {
      lastObj.moveVertex(0, currentCoor);
    }
    lastObj.addVertex(currentCoor, [0, 0, 0, 1]);
    drawState = 'polygon2';
  } else if (drawState == 'polygon2') {
    lastObj.moveVertex(lastObj.vertices.length - 1, currentCoor);
    lastObj.addVertex(currentCoor, [0, 0, 0, 1]);
  }
  setDrawStatus();
  setPropertyDisplay();
});



const getActiveObject = (currentCoor) => {
  let isExist = false;

  objects.forEach((obj) => {
    // Hover or Click Vertices
    obj.vertices.forEach((vertex) => {
      if (dist(vertex.coor, currentCoor) < epsilon) {
        if (hoveredObjectId == -1) {
          hoveredObjectId = obj.id;
          hoveredVertexId = vertex.id;
          vertex.isHovered = true;
          obj.centroid.isHovered = true;

        } else if (hoveredObjectId == obj.id) {
          
        } else {
          let oldObj = objects[hoveredObjectId];
          let oldVertex = oldObj.vertices[hoveredVertexId];
          if (dist(vertex.coor, currentCoor) < dist(oldVertex.coor, currentCoor)) {
            hoveredObjectId = obj.id;
            hoveredVertexId = vertex.id;
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
      if (hoveredObjectId == -1) {
        hoveredObjectId = obj.id;
        hoveredVertexId = -1;
        obj.centroid.isHovered = true;
      } else if (hoveredObjectId == obj.id) {

      } else {
        let oldObj = objects[hoveredObjectId];
        if (dist(obj.centroid.coor, currentCoor) < dist(oldObj.centroid.coor, currentCoor)) {
          hoveredObjectId = obj.id;
          hoveredVertexId = -1;
          obj.centroid.isHovered = true;
          oldObj.centroid.isHovered = false;
        }
      }
      isExist = true;
    }
  });

  if (!isExist) {
    hoveredObjectId = -1;
    hoveredVertexId = -1;

    objects.forEach((obj) => {
      obj.vertices.forEach((vertex) => {
        vertex.isHovered = false;
      });
      obj.centroid.isHovered = false;
    });
  }
};

// UTIL --------------------------------------------------------------------------------------------
const dist = (p1, p2) => Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));

const getMouseCoor = (e) => {
  const x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
  const y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
  current_coor.innerHTML = `[${x.toFixed(3)}, ${y.toFixed(3)}]`;
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

function saveToFile(json, fileName) {
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function loadObjectsFromJsonFileAndAddToCanvas(array, filePath) {
  // Load the JSON file
  fetch(filePath)
    .then(response => response.json())
    .then(objects => {
      // Add each object to the canvas
      objects.forEach(obj => {
        if (obj.type == 'Line') {
          const newObject = new Line(obj.id);
          newObject.setAtrributes(obj.id, obj.vertices, obj.angle, obj.centroid);
          array.push(newObject);

        } else if (obj.type == 'Square') {
          const newObject = new Square(obj.id);
          newObject.setAtrributes(obj.id, obj.vertices, obj.angle, obj.centroid);
          array.push(newObject);

        } else if (obj.type == 'Rectangle') {
          const newObject = new Rectangle(obj.id);
          newObject.setAtrributes(obj.id, obj.vertices, obj.angle, obj.centroid);
          array.push(newObject);

        } else if (obj.type == 'Polygon') {
          const newObject = new Polygon(obj.id);
          newObject.setAtrributes(obj.id, obj.vertices, obj.angle, obj.centroid);
          array.push(newObject);

        }
      });
    })
    .catch(error => console.error(error));
}

// Check if point c is to the left of the directed line from a to b
function isLeft(a, b, c) {
  const ax = a.coor[0], ay = a.coor[1];
  const bx = b.coor[0], by = b.coor[1];
  const cx = c.coor[0], cy = c.coor[1];
  return ((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) > 0;
}

function convexHull(vertices) {
  // Find the leftmost point as the starting point of the hull
  let leftmost = 0;
  for (let i = 1; i < vertices.length; i++) {
    if (vertices[i].coor[0] < vertices[leftmost].coor[0]) {
      leftmost = i;
    }
  }

  // Initialize the hull with the leftmost point
  let hull = [leftmost];

  // Find the next point in the hull by selecting the point that has the
  // smallest angle from the previous point
  let prev = leftmost;
  do {
    let next = null;
    for (let i = 0; i < vertices.length; i++) {
      if (i === prev) continue;

      if (next === null || isLeft(vertices[prev], vertices[next], vertices[i])) {
        next = i;
      }
    }
    hull.push(next);
    prev = next;
  } while (prev !== leftmost);

  // Convert the list of indices to the list of points
  return hull.map(i => vertices[i]);
}


const epsilon = 0.02;

