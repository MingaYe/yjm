"use strict";

var canvas;
var gl;

var points = [];
var colors = [];
//旋转
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
//平移
var xD = 0;
var yD = 1;
var zD = 2;
//缩放
var xS = 0;
var yS = 1;
var zS = 2;

//旋转
var axis = 0;
var theta = [0, 0, 0];
//平移
var dd = 0;
var d = [0, 0, 0];
//缩放
var ss = 0;
var s = [1.0, 1.0, 1.0];

var thetaLoc;
var dLoc;
var sLoc;

window.onload = function initCube() {
    canvas = document.getElementById("rtcb-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    makeCube();

    gl.viewport(0, 0, canvas.width, canvas.height);//清空画布
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // load shaders and initialize attribute buffer
    var program = initShaders(gl, "rtvshader", "rtfshader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
    gl.uniform3fv(thetaLoc, theta);
	
	dLoc = gl.getUniformLocation(program, "d");
	gl.uniform3fv(dLoc, d);
	
	sLoc = gl.getUniformLocation(program, "s");
	gl.uniform3fv(sLoc, s);
	
	//旋转
    document.getElementById("xbutton").onclick = function () {
        axis = xAxis;
    }

    document.getElementById("ybutton").onclick = function () {
        axis = yAxis;
    }
	
    document.getElementById("zbutton").onclick = function () {
        axis = zAxis;
    }
	//平移
	document.getElementById("xpingyi").onclick = function () {
	    dd = xD;
	}
	
	document.getElementById("ypingyi").onclick = function () {
	    dd = yD;
	}
	
	document.getElementById("zpingyi").onclick = function () {
	    dd = zD;
	}
	//缩放
	document.getElementById("xsuofang").onclick = function () {
	    ss = xS;
	}
	
	document.getElementById("ysuofang").onclick = function () {
	    ss = yS;
	}
	
	document.getElementById("zsuofang").onclick = function () {
	    ss = zS;
	}

    render();
}

function makeCube() {
    var vertices = [
        glMatrix.vec4.fromValues(-0.5, -0.5, 0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5, 0.5, 0.5, 1.0),
        glMatrix.vec4.fromValues(0.5, 0.5, 0.5, 1.0),
        glMatrix.vec4.fromValues(0.5, -0.5, 0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5, 0.5, -0.5, 1.0),
        glMatrix.vec4.fromValues(0.5, 0.5, -0.5, 1.0),
        glMatrix.vec4.fromValues(0.5, -0.5, -0.5, 1.0),
    ];

    var vertexColors = [
        glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 1.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0)
    ];

    var faces = [
        1, 0, 3, 1, 3, 2, //正
        2, 3, 7, 2, 7, 6, //右
        3, 0, 4, 3, 4, 7, //底
        6, 5, 1, 6, 1, 2, //顶
        4, 5, 6, 4, 6, 7, //背
        5, 4, 0, 5, 0, 1  //左
    ];

    for (var i = 0; i < faces.length; i++) {
        points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);

        colors.push(vertexColors[Math.floor(i / 6)][0],
					vertexColors[Math.floor(i / 6)][1],
					vertexColors[Math.floor(i / 6)][2], 
					vertexColors[Math.floor(i / 6)][3]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 0.1;
    gl.uniform3fv(thetaLoc, theta);
	
	
	d[dd] += 0.005;
	if(d[dd]>1) d[dd] = -d[dd];
	gl.uniform3fv(dLoc, d);
	
	
	s[ss] += 0.005;
	if(s[ss]>1) s[ss] = -s[ss];
	gl.uniform3fv(sLoc, s);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

    requestAnimFrame(render);
}