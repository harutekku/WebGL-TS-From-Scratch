const canvas = <HTMLCanvasElement>document.querySelector("#ctx")!;
const gl = <WebGL2RenderingContext>canvas.getContext("webgl2")!;

if (!gl) {
    alert("Your browser doesn't support WebGL2 :^(");
    throw new Error();
}

window.onresize = InitCanvas();

async function main() {
    const vertSource = await GetFile(ConstructLocalURL("/shaders/Vertex.vert"));
    const fragSource = await GetFile(ConstructLocalURL("/shaders/Fragment.frag"));

    const vertices: Float32Array = new Float32Array([
         0.0,  0.5, -1.5,    1.0, 0.0, 0.0,
        -0.5, -0.5, -1.5,    0.0, 1.0, 0.0,
         0.5, -0.5, -1.5,    0.0, 0.0, 1.0
    ]);

    const p: Program = new Program(vertSource, fragSource);
    p.Use();

    const vbo = new VertexBuffer(vertices);
    const l = new VALayout();
    l.Push(new VALayoutElement(gl.FLOAT, 3));
    l.Push(new VALayoutElement(gl.FLOAT, 3));
    const vao = new VertexArray();
    vao.AddLayout(vbo, l);

    let then = 0;

    const renderLoop = new RenderLoop((now: number) => {
        const delta = now - then;
        then = now;

        const projection = Perspective(Radians(45), canvas.width / canvas.height, 0.1, 100.0);

        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        p.Use();

        const nowInSeconds = now / 1000.0;
        p.SetFloat4x4("Projection", projection);
        p.SetFloat("RedTime", Math.sin(nowInSeconds + Math.PI / 3) / 2 + 0.5);
        p.SetFloat("GreenTime", Math.sin(nowInSeconds + 2 * Math.PI / 3) / 2 + 0.5);
        p.SetFloat("BlueTime", Math.sin(nowInSeconds + Math.PI) / 2 + 0.5);

        vao.Bind();
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    });

    renderLoop.RegisterKeyEvent((e: KeyboardEvent) => {
        if (e.key === 'Escape' && renderLoop.Run()) {
            renderLoop.Stop();
            vao.Release();
            vbo.Release();
            p.Release();
            console.log("Stopped animation");
        }
    });
}

main();