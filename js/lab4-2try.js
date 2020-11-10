"use strict";

var canvas;
var gl;
var vBuffer;
var cBuffer;

var s = [1.0, 1.0, 1.0];//缩放
var theta = [0.0, 0.0, 0.0];
var d = [0.0, 0.0, 0.0];

var maxNumVertices = 500;
var index = 0;
var side = 6;

var cIndex = 0;
//var vIndex = 0;
var dIndex = -1;

var thetaLoc;//各种Loc
var sLoc;
var tLoc;
var dLoc;

var trianglePoints = [//三角形的图形
    0.0, 0.1, 0.0,1.0,
    -0.1, -0.1, 0.0,1.0,
    0.1, -0.1, 0.0,1.0
];
var squarePoints = [//矩形的图形
    0.0, 0.1, 0.0, 1.0,
    -0.1, 0.0, 0.0, 1.0,
    0.1, 0.0, 0.0, 1.0,
    -0.1, 0.0, 0.0, 1.0,
    0.1, 0.0, 0.0, 1.0,
    0.0, -0.1, 0.0, 1.0
];
var circlePoints = [];//圆

var colors = [
	0.0, 0.0, 0.0, 1.0, // black
	1.0, 0.0, 0.0, 1.0 , // red
	1.0, 1.0, 0.0, 1.0 , // yellow
	0.0, 1.0, 0.0, 1.0 , // green
	0.0, 0.0, 1.0, 1.0 , // blue
	1.0, 0.0, 1.0, 1.0 , // magenta
	0.0, 1.0, 1.0, 1.0  // cyan
];

var t;
var numPolygons = 0;
// var numIndices = [];
// numIndices[0] = 0;
var start = [0];
var circleColors = [];
var triangleColors = [];
var squareColors = [];
//----------------------------------------------------------------------------

function init(){
	//-----------------------------------固定---------------------------------------------
	canvas = document.getElementById( "canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
	
	gl.enable(gl.DEPTH_TEST);
	
	//----------------------------------固定------------------------------------------------
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	
	vBuffer = gl.createBuffer(); //position
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(trianglePoints), gl.STATIC_DRAW );
	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	cBuffer = gl.createBuffer(); // color
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW );
	
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	//----------------------------------各种Loc-------------------------------------
	tLoc = gl.getUniformLocation(program,"pos");//平移
	thetaLoc = gl.getUniformLocation(program, "theta");//旋转
	sLoc = gl.getUniformLocation(program, "s");//缩放
	dLoc = gl.getUniformLocation(program, "pos");
	
	
	//--------------------------------选图案--------------------------------------------
	var n = document.getElementById( "menu" );
	n.addEventListener( "click", function(){
		dIndex = n.selectedIndex;
		console.log(dIndex);
	});
	
	
	//-----------------------------选颜色-----------------------------------------
	var m = document.getElementById( "cmenu" );
	m.addEventListener( "click", function(){
		cIndex = m.selectedIndex*4;
		console.log(cIndex);
	});
	
	//------------------------------------------边---------------------------------------
	side = document.getElementById("bs").value;

	//-------------------------------鼠标点击--------------------------------------------
	canvas.addEventListener( "mousedown", function( event ){
		triangleColors = [];
		circleColors = [];
		squareColors = [];
		huatu();
		console.log(circlePoints);
		var rect = canvas.getBoundingClientRect();
		var cx = event.clientX - rect.left;
		var cy = event.clientY - rect.top; 
		t = glMatrix.vec3.fromValues( 2 * cx / canvas.width - 1, 2 * ( canvas.height - cy ) / canvas.height - 1,0.0 );

	} );
	renderPolygons();
}
//-------------------------------------------------------------------------------------------
function huatu(){
	if(dIndex == 0){
		console.log("a");
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(trianglePoints), gl.STATIC_DRAW);
		gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
		triangleColors = [];
		//console.log(cIndex);
		console.log(colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3]);
		triangleColors=[colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3],
						colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3],
						colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3]
		];
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);
		//index += 3;
		
		//gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		//var c = Math.floor(Math.random() * 1024) % 7;
		//var c = cIndex;
		//c = c * 4;
		//t = glMatrix.vec4.fromValues( colors[c], colors[c+1], colors[c+2], colors[c+3] );
		//gl.bufferSubData( gl.ARRAY_BUFFER, 16 * 3, new Float32Array( t ) );
	}else if(dIndex == 1){
		console.log("b");
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(squarePoints), gl.STATIC_DRAW);
		//gl.bufferSubData( gl.ARRAY_BUFFER,16 * 6 ,new Float32Array(squarePoints));
		gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
		squareColors = [
						colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3],
						colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3],
						colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3],
						colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3],
						colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3],
						colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3]
		];
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);
		//index += 6;
		
		//gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		//var c = cIndex;
		//c = c * 4;
		//t = glMatrix.vec4.fromValues( colors[c], colors[c+1], colors[c+2], colors[c+3] );
		//gl.bufferSubData( gl.ARRAY_BUFFER, 16 * 6, new Float32Array( t ) );
	}else if(dIndex == 2){
		console.log("c");
		side = 100;
		for(var i = 0; i < side; i++){
			var thetas = i * 2 * Math.PI / side;
			var r = 0.1;
			var a = r * Math.sin(thetas);
			var b = r * Math.cos(thetas);
			circlePoints.push(a,b,0.0,1.0);
			circleColors.push(colors[cIndex],colors[cIndex+1],colors[cIndex+2],colors[cIndex+3]);
		}
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(circlePoints), gl.STATIC_DRAW);
		gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(circleColors), gl.STATIC_DRAW);
		//index += 36;
		
		//gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		//var c = cIndex;
		//c = c * 4;
		//t = glMatrix.vec4.fromValues( colors[c], colors[c+1], colors[c+2], colors[c+3] );
		//gl.bufferSubData( gl.ARRAY_BUFFER, 16 * 6, new Float32Array( t ) );
	}

}


//-------------------------------------------------------------------------------------
function renderPolygons(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	//for( var i = 0; i < numPolygons; i++ ){
		if(dIndex == 0){
			s[0] += 0.02;
			s[1] += 0.02;
			s[2] += 0.02;
			if(s[0]>1){
				s[0] = 0.5;
				s[1] = 0.5;
				s[2] = 0.5;
			}
			
			console.log("aa");
			gl.uniform3fv( tLoc,new Float32Array(t));
			gl.uniform3fv( sLoc,new Float32Array(s));
			gl.drawArrays( gl.TRIANGLES, 0, 3);
		}else if(dIndex == 1){
			theta[2] +=0.1;
			gl.uniform3fv( thetaLoc,new Float32Array(theta));
			
			console.log("bb");
			gl.uniform3fv( tLoc,new Float32Array(t));
			gl.drawArrays( gl.TRIANGLES, 0, 6);
		}else if(dIndex == 2){
			
			//gl.uniform3fv(dLoc, d);
			
			console.log("cc");
			gl.uniform3fv( tLoc,new Float32Array(t));
			gl.drawArrays( gl.TRIANGLE_FAN, 0, circlePoints.length/2);
		}
	
	//}
		
	window.requestAnimationFrame(renderPolygons);
}