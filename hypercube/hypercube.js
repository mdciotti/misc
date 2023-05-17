'use strict'

class Vector {
	constructor(elements) {
		this.elements = Array.from(elements)
	}
}

function unpackVector(bits, d) {
	// Assume bits is a binary number where each digit represents one direction
	let elements = []
	elements.fill(0, 0, d)
	for (let i = 0; i < d; i++) {
		elements[i] = (bits >> i) & 1
	}

	return new Vector(elements)
}


class Hypercube {

	constructor(dimension) {
		console.log(`created hypercube of dimension ${dimension}`)
		this.dimension = dimension
		this.edges = []
		this.vertices = []

		let d = this.dimension

		// Number of vertices = 2^dimension
		for (let i = 0; i < 1 << d; i++) {
			this.vertices[i] = unpackVector(i, d)
		}
	
		// Number of edges = d * 2^(d-1)
		// Iterative algorithm
		for (let i = 0; i < d; i++) {
			let c = 1 << i
			let r = 0
			for (let j = 0; j < 1 << (d - 1); j++) {
				this.edges.push(r, r + c)
				r += 1
				if (r % (2 * c) === c) r += c
			}
		}
	}
}

let fshaderCode = `
#ifdef GL_ES
precision mediump float;
#endif
varying vec3 vPosition;
void main(void) {
	float r = 0.5 + 0.5 * vPosition.x;
	float g = 0.5 + 0.5 * vPosition.y;
	float b = 0.5 + 0.5 * vPosition.z;
	//gl_FragColor = vec4(r, g, b, 0.25);
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`

let vshaderCode = `
attribute vec3 ppos;
varying vec3 vPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
attribute float a_pointSize;
void main(void) {
	gl_PointSize = a_pointSize;
	gl_Position = uPMatrix * uMVMatrix * vec4(ppos.x, ppos.y, ppos.z, 1.0);
	vPosition = ppos;
}
`

function initShaders(gl) {
	console.log('Initializing Shaders...');
	let fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fshaderCode);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		console.error('Error during fragment shader compilation:\n' + gl.getShaderInfoLog(fshader));
		return;
	}
	let vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vshaderCode);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		console.error('Error during vertex shader compilation:\n' + gl.getShaderInfoLog(vshader));
		return;
	}

	let program = gl.createProgram();
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Error during program linking:\n' + gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('Error during program validation:\n' + gl.getProgramInfoLog(program));
		return;
	}

	gl.useProgram(program);

	return program
}

function initBuffers(gl, hc, program) {
	console.log('Initializing Buffers...')
	let vattrib = gl.getAttribLocation(program, 'ppos')
	if (vattrib == -1) {
		console.error('Error during attribute address retrieval')
		return
	}
	gl.enableVertexAttribArray(vattrib)

	// Vertex buffer object
	let vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	let vbo_size = hc.vertices.length * hc.dimension
	let vbo_data = new Float32Array(vbo_size)
	// for (let i = 0; i < hc.vertices.length; i++) {
	// 	for (let e = 0; e < hc.dimension; e++) {
	// 		vbo_data[i*hc.dimension + e] = hc.vertices[i].elements[e]
	// 	}
	// }
	for (let i = 0; i < hc.edges.length; i++) {
		for (let e = 0; e < hc.dimension; e++) {
			vbo_data[i*hc.dimension + e] = hc.edges[i].elements[e]
		}
	}
	gl.bufferData(gl.ARRAY_BUFFER, vbo_data, gl.STATIC_DRAW)
	gl.vertexAttribPointer(vattrib, hc.dimension, gl.FLOAT, false, 0, 0)
}

function init() {
	let hc = new Hypercube(2)
	// console.log(hc.vertices)
	// console.log(hc.edges)

	let canvas = document.createElement('canvas')
	let w = 500, h = 500
	canvas.width = w
	canvas.height = h
	document.body.appendChild(canvas)
	let gl = canvas.getContext('webgl')

	let program = initShaders(gl)
	initBuffers(gl, hc, program)

	// Edge buffer object
	// let ebo = gl.createBuffer()
	// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)

	// Set up projection matrix
	var pUniform = gl.getUniformLocation(program, 'uPMatrix');
	if (pUniform == -1) {
		console.error('Error during uniform address retrieval: "uPMatrix"');
		running = false;
		return;
	}
	var pMatrix = mat4.create();
	mat4.identity(pMatrix);
	// mat4.perspective(120, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	gl.uniformMatrix4fv(pUniform, false, pMatrix);

	// Model view matrix
	var mvUniform = gl.getUniformLocation(program, 'uMVMatrix');
	if (mvUniform == -1) {
		console.error('Error during uniform address retrieval: "uMVMatrix"');
		running = false;
		return;
	}
	// var mvMatrix = getRotationMatrix(toRad(rotx), toRad(roty), toRad(rotz));
	let mvMatrix = mat4.create()
	mat4.identity(mvMatrix)
	gl.uniformMatrix4fv(mvUniform, false, mvMatrix)

	// Set up points
	var a_pointSize = gl.getAttribLocation(program, "a_pointSize");
	gl.vertexAttrib1f(a_pointSize, 1.0);

	// draw(gl, hc)
	draw_gl(gl, hc)
}

function project(v) {
	let x, y
	x = v.elements[0] / 10
	y = v.elements[1] / 10
	return [x, y]
}

function draw_gl(gl, hc) {

	// gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	// var size = Math.min(gl.viewportWidth, gl.viewportHeight);
	// gl.viewport(0, 0, size, size);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// gl.drawArrays(gl.POINTS, 0, hc.vertices.length);
	gl.drawArrays(gl.LINES, 0, hc.vertices.length);
	gl.flush();
}

window.addEventListener('load', init)
