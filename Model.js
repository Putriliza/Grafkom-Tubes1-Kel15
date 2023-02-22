class Point {
  constructor(coor, color, id=-1){
      this.id = id;
      this.coor = coor;
      this.color = color;
      this.isSelected = false;
      this.isHovered = false;
  }

  setCoor = (coor) => {
    this.coor = coor;
  }

  // TODO: dirender cuma ketika object atau vertex dihover/select
  render = (gl, vBuffer, vPosition) => {
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
    gl.drawArrays(gl.TRIANGLE_FAN, 0, dotVertices.length);
  }

  //other methods
}

class Model {
    constructor(id){
      this.id = id;
      this.vertices = [];
      this.dotVertices = [];

      //other attributes
    }

    //other methods  
    addVertex = (coor, color) => {
      this.vertices.push(new Point(coor, color, this.vertices.length));
    }

    renderDot = (gl, vBuffer, vPosition) => {
      this.vertices.forEach((v) => {
        v.render(gl, vBuffer, vPosition);
      });
    }
}
  
class Line extends Model {
  constructor(id){
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 1));
  }

  render = (gl) => {
    const verticesCoor = [];

    this.vertices.forEach((v) => {
      verticesCoor.push(v.coor);
    });

    const vBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.drawArrays(gl.LINES, 0, verticesCoor.length);

    this.renderDot(gl, vBuffer, vPosition);
    
  }
}

class Square extends Model {
  constructor(id){
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 1));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 2));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 3));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 4));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 5));
  }

  render = (gl) => {
    const verticesCoor = [];
    const colors = [];

    this.vertices.forEach((v) => {
      verticesCoor.push(v.coor);
      colors.push(v.color);
    });

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesCoor.length);

    this.renderDot(gl, vBuffer, vPosition);
  }
}

class Rectangle extends Model {
  constructor(id){
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 1));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 2));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 3));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 4));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 5));
  }

  render = (gl) => {
    const verticesCoor = [];
    const colors = [];

    this.vertices.forEach((v) => {
      verticesCoor.push(v.coor);
      colors.push(v.color);
    });

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesCoor.length);

    this.renderDot(gl, vBuffer, vPosition);
  }
}

class Polygon extends Model {
  constructor(id){
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
  }

  render = (gl) => {
    const verticesCoor = [];
    const colors = [];

    this.vertices.forEach((v) => {
      verticesCoor.push(v.coor);
      colors.push(v.color);
    });

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesCoor.length);

    this.renderDot(gl, vBuffer, vPosition);
  }
}