class Point {
  constructor(coor, color, id=-1, isCentroid=false) {
      this.id = id;
      this.coor = coor;
      this.color = color;
      this.isSelected = false;
      this.isHovered = false;
      this.isCentroid = isCentroid;
  }

  setCoor = (coor) => {
    this.coor = coor;
  }

  render = (gl, vBuffer, vPosition, cBuffer, vColor) => {
    if (this.isHovered || this.isSelected) {
      const dotVertices = [
          [this.coor[0] - epsilon, this.coor[1] - epsilon],
          [this.coor[0] + epsilon, this.coor[1] - epsilon],
          [this.coor[0] + epsilon, this.coor[1] + epsilon],
          [this.coor[0] - epsilon, this.coor[1] + epsilon],
      ];
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(dotVertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vPosition);
      const dotColor = Array(4).fill(this.isSelected ? [1, 0, 0, 1] : (this.isCentroid ? [1, 1, 0, 1] : [0, 0, 1, 1]))
      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(dotColor), gl.STATIC_DRAW);
      gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vColor);
      
      gl.drawArrays(gl.TRIANGLE_FAN, 0, dotVertices.length);
    }
  }

  //other methods
}

class Model {
    constructor(id){
      this.id = id;
      this.vertices = [];
      this.centroid = new Point([0,0], [0, 0, 0, 1], 99, true);

      // Model isSelected or isHovered based on the centroid
    }

    getModelName = () => {
      return this.constructor.name;
    }

    addVertex = (coor, color) => {
      if (!this.isExistVertex(coor)) {
        this.vertices.push(new Point(coor, color, this.vertices.length));
        this.setCentroid();
      }
    }

    moveVertex = (id, coor) => {
      this.vertices[id].setCoor(coor);
      this.setCentroid();
    }

    isExistVertex = (coor) => {
      return this.vertices.some((v) => v.coor[0] === coor[0] && v.coor[1] === coor[1]);
    }

    setCentroid = () => {
      // search for the largest and smallest x and y
      
      let minX = Math.min(...this.vertices.map((v) => v.coor[0]));
      let minY = Math.min(...this.vertices.map((v) => v.coor[1]));
      let maxX = Math.max(...this.vertices.map((v) => v.coor[0]));
      let maxY = Math.max(...this.vertices.map((v) => v.coor[1]));

      this.centroid.coor = [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    translation = (coor) => {
      let dx = coor[0] - this.centroid.coor[0];
      let dy = coor[1] - this.centroid.coor[1];
      this.vertices.forEach((v) => {
        v.coor[0] += dx;
        v.coor[1] += dy;
      });
      this.setCentroid();
    }

    renderDot = (gl, vBuffer, vPosition, cBuffer, vColor) => {
      this.vertices.forEach((v) => {
        v.render(gl, vBuffer, vPosition, cBuffer, vColor);
      });
      this.centroid.render(gl, vBuffer, vPosition, cBuffer, vColor);
    }
}
  
class Line extends Model {
  constructor(id) {
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 1));
  }

  getLength = () => {
    return dist(this.vertices[0].coor, this.vertices[1].coor)
  }

  setLength = (length) => {
    let dx = this.vertices[1].coor[0] - this.vertices[0].coor[0];
    let dy = this.vertices[1].coor[1] - this.vertices[0].coor[1];
    let angle = Math.atan2(dy, dx);
    let x0 = this.centroid.coor[0] - length * Math.cos(angle)/2;
    let y0 = this.centroid.coor[1] - length * Math.sin(angle)/2;
    let x1 = this.centroid.coor[0] + length * Math.cos(angle)/2;
    let y1 = this.centroid.coor[1] + length * Math.sin(angle)/2;
    this.vertices[0].coor = [x0, y0];
    this.vertices[1].coor = [x1, y1];

    console.log(`x1: ${this.vertices[1].coor[0]}, y1: ${this.vertices[1].coor[1]}`);
    console.log(`x2: ${this.vertices[0].coor[0]}, y2: ${this.vertices[0].coor[1]}`);
    console.log(this.getLength(), length);
  }

  render = (gl) => {
    const verticesCoor = [];
    const verticesColors = [];

    this.vertices.forEach((v) => {
      verticesCoor.push(v.coor);
      verticesColors.push(v.color);
    });

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    
    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesColors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.LINES, 0, verticesCoor.length);

    this.renderDot(gl, vBuffer, vPosition, cBuffer, vColor)
  }
}

class Square extends Model {
  constructor(id){
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 1));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 2));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 3));
    // this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 4));
    // this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 5));
  }

  render = (gl) => {
    const verticesCoor = [];
    const verticesColors = [];

    this.vertices.forEach((v) => {
      verticesCoor.push(v.coor);
      verticesColors.push(v.color);
    });

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesColors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticesCoor.length);

    this.renderDot(gl, vBuffer, vPosition, cBuffer, vColor)
  }
}

class Rectangle extends Model {
  constructor(id){
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 1));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 2));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 3));
    // this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 4));
    // this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 5));
  }

  render = (gl) => {
    const verticesCoor = [];
    const verticesColors = [];

    this.vertices.forEach((v) => {
      verticesCoor.push(v.coor);
      verticesColors.push(v.color);
    });

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesColors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticesCoor.length);

    this.renderDot(gl, vBuffer, vPosition, cBuffer, vColor)
  }
}

class Polygon extends Model {
  constructor(id){
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
  }

  render = (gl) => {
    const verticesCoor = [];
    const verticesColors = [];

    this.vertices.forEach((v) => {
      verticesCoor.push(v.coor);
      verticesColors.push(v.color);
    });

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesColors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesCoor.length);

    this.renderDot(gl, vBuffer, vPosition, cBuffer, vColor)
  }
}