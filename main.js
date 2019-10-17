if (!window.WebGLRenderingContext) {
    alert("No WebGL Support");
}

// Get elements
const canvas = document.querySelector("#canvas");
const vertexSrc = document.querySelector("#vertex");
const fragSrc = document.querySelector("#fragment");

const gl = canvas.getContext("webgl");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
gl.viewportWidth = canvas.width;
gl.viewportHeight = canvas.height;

function loadShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = loadShader(gl.VERTEX_SHADER, vertexSrc.innerText);
const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragSrc.innerText);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Shader link failed")
}

gl.useProgram(shaderProgram);
shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
shaderProgram.screenSize = gl.getUniformLocation(shaderProgram, "uScreenSize")
shaderProgram.time = gl.getUniformLocation(shaderProgram, "uTime"); 

// Setup buffers
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const triangleVertices = [
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
vertexBuffer.itemSize = 3;
vertexBuffer.numberOfItems = 4;

// Draw
gl.clearColor(0.0, 0.0, 0.0, 1.0);

function draw() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.uniform1f(shaderProgram.time, Date.now());
    gl.uniform4fv(shaderProgram.screenSize, [gl.viewportWidth, gl.viewportHeight, 1 / gl.viewportWidth, 1 / gl.viewportHeight]);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numberOfItems);

    requestAnimationFrame(draw);
}

draw();
