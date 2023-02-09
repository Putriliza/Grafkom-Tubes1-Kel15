class Point {
  constructor(coor, color, id=-1){
      this.id = id;
      this.coor = coor;
      this.color = color;

      //other attributes
  }

  //other methods
}

class Model {
    constructor(id){
      this.id = id;
      this.vertices = [];

      //other attributes
    }

    //other methods
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

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCoor), gl.STATIC_DRAW);
    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.drawArrays(gl.LINES, 0, verticesCoor.length);
  }
}