"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;

var points = [];

var numTimesToSubdivide=4;

var theta ;//theta * Math.PI/180.0;
//var twist=true;

//window.onload = 
function initTriangles(){
	points=[];
	canvas = document.getElementById( "gl-canvas" );
	theta = document.getElementById( "jd" ).value;
	theta = theta * Math.PI/180.0;

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		-Math.sqrt(3)/2, -0.5, 0,
		 Math.sqrt(3)/2, -0.5, 0,
		 0, 1.0 , 0
	];

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );

	divideTriangle( u, v, w, numTimesToSubdivide );//分解三角形

	// configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// load shaders and initialise attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	renderTriangles();
};

function triangle( a, b, c ){
	//var k;
	// points.push( a[0], a[1], a[2] );
	// points.push( b[0], b[1], b[2] );
	// points.push( c[0], c[1], c[2] );
	var da = Math.sqrt(a[0]*a[0]+a[1]*a[1]);
	var db = Math.sqrt(b[0]*b[0]+b[1]*b[1]);
	var dc = Math.sqrt(c[0]*c[0]+c[1]*c[1]);
	
	points.push( a[0]*Math.cos(da*theta)-a[1]*Math.sin(da*theta), a[0]*Math.sin(da*theta)+a[1]*Math.cos(da*theta), a[2] );
	points.push( b[0]*Math.cos(db*theta)-b[1]*Math.sin(db*theta), b[0]*Math.sin(db*theta)+b[1]*Math.cos(db*theta), b[2] );
	
	points.push( b[0]*Math.cos(db*theta)-b[1]*Math.sin(db*theta), b[0]*Math.sin(db*theta)+b[1]*Math.cos(db*theta), b[2] );
	points.push( c[0]*Math.cos(dc*theta)-c[1]*Math.sin(dc*theta), c[0]*Math.sin(dc*theta)+c[1]*Math.cos(dc*theta), c[2] );
	
	points.push( c[0]*Math.cos(dc*theta)-c[1]*Math.sin(dc*theta), c[0]*Math.sin(dc*theta)+c[1]*Math.cos(dc*theta), c[2] );
	points.push( a[0]*Math.cos(da*theta)-a[1]*Math.sin(da*theta), a[0]*Math.sin(da*theta)+a[1]*Math.cos(da*theta), a[2] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( a[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( b[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( c[k] );
}

function divideTriangle( a, b, c, count ){//count层数
	// check for end of recursion
	if( count == 0 ){
		triangle( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );//ab=a*0.5+b*(1-0.5)
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		--count;

		// three new triangles
		divideTriangle( a, ab, ca, count );
		divideTriangle( b, bc, ab, count );
		divideTriangle( c, ca, bc, count );
		
		divideTriangle( ab, bc, ca, count );
	}
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	//gl.drawArrays( gl.TRIANGLES, 0, points.length/3 );
	gl.drawArrays( gl.LINES, 0, points.length/3);
}