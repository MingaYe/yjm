"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),//0
    vec4( -0.5,  0.5,  0.5, 1.0 ),//1
    vec4(  0.5,  0.5,  0.5, 1.0 ),//2
    vec4(  0.5, -0.5,  0.5, 1.0 ),//3
    vec4( -0.5, -0.5, -0.5, 1.0 ),//4
    vec4( -0.5,  0.5, -0.5, 1.0 ),//5
    vec4(  0.5,  0.5, -0.5, 1.0 ),//6
    vec4(  0.5, -0.5, -0.5, 1.0 )//7
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
	vec4( 1.0, 0.0, 1.0, 0.5 ),  // pink
	vec4( 0.0, 0.0, 1.0, 0.5 ),  // blue
	vec4( 1.0, 0.0, 1.0, 0.8 ),  // pink
	vec4( 0.0, 0.0, 1.0, 0.8 ),  // blue
	vec4( 1.0, 0.0, 1.0, 0.1 ),  // pink
	vec4( 0.0, 0.0, 1.0, 0.1 ),  // blue
	// vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
 //    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
	// vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
 //    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 )  // white

];


//底座
var ARM1_HEIGHT      = 1.0;
var ARM1_WIDTH       = 3.0;
//手臂
var LOWER_ARM_HEIGHT_THI = 5.0;
var LOWER_ARM_WIDTH_THI  = 1.0;
//
var MID_ARM_HEIGHT_THI=5.0
var MID_ARM_WIDTH_THI=0.9


var modelViewMatrix,modelViewMatrix2, projectionMatrix;//单位矩阵4*4


var Arm1 = 0;

var LowerArm2 = 1;

var MidArm2=2;

var theta= [0,0,0];//只有三个0
var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//____________________________________________


function scale4(a, b, c) {
   var result = mat4();//4*4
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.9, 0.8, 0.6, 1.0 );//要在glClear之前设置Color
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    //设置页面的选择范围按钮控制，一共3组(参照theta数组的定义)
    //底部旋转和底部关节
    document.getElementById("slider1").onchange = function(event) {
        theta[0] = event.target.value;
    };
	
	document.getElementById("slider2").onchange = function(event) {
	      theta[1] = event.target.value;
	 };
	
    document.getElementById("slider3").onchange = function(event) {
         theta[2] =  event.target.value;
    };
  
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -5, 20, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}

//----------------------------------------------------------------------------
//上胳膊部分
function arm1() {
    var s = scale4(ARM1_WIDTH, ARM1_HEIGHT, ARM1_WIDTH);//长、宽、高
    var instanceMatrix = mult( translate( 0.0, 0.5 * ARM1_HEIGHT, 0.0 ), s);//实例矩阵
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


//手掌部分
function lowerArm2()
{
    var s = scale4(LOWER_ARM_WIDTH_THI, LOWER_ARM_HEIGHT_THI, LOWER_ARM_WIDTH_THI);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT_THI, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//中胳膊部分
function midArm2()
{
    var s = scale4(MID_ARM_WIDTH_THI, MID_ARM_HEIGHT_THI, MID_ARM_WIDTH_THI);
    var instanceMatrix = mult( translate( 0.0, 0.5 * MID_ARM_HEIGHT_THI, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );//清除屏幕和深度缓存
	//旋转定点和运行
    modelViewMatrix = rotate(theta[Arm1], 0, 1, 0 ); 
    modelViewMatrix2 = rotate(theta[Arm1], 0, 1, 0 );
    arm1();
////////////////

    modelViewMatrix = mult(modelViewMatrix2, translate(0.0, ARM1_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm2], 0, 0, 1 ));
    lowerArm2();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT_THI, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[MidArm2], 0, 0, 1) );
    midArm2();

    requestAnimFrame(render);
}

