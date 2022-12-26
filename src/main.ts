function Init(): void {
    const canvas = <HTMLCanvasElement>document.querySelector("#ctx")!;
    const ctx = <WebGL2RenderingContext>canvas.getContext("webgl2")!;

    if (!ctx) {
        alert("Your browser doesn't support WebGL2 :^(");
        throw new Error();
    }

    webgl2.SetCurrentContext(ctx);

    window.onresize = InitCanvas();
}

async function main() {
    Init();

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
    l.Push(new VALayoutElement(webgl2.GL.FLOAT, 3));
    l.Push(new VALayoutElement(webgl2.GL.FLOAT, 3));
    const vao = new VertexArray();
    vao.AddLayout(vbo, l);

    let then = 0;
    
    let model = new Float4x4(1.0);

    const projection = Perspective(Radians(45), webgl2.Canvas.width / webgl2.Canvas.height, 0.1, 100.0);
    p.SetFloat4x4("Projection", projection);

    const renderLoop = new RenderLoop((now: number) => {
        const delta = now - then;
        then = now;

        webgl2.GL.clearColor(0.1, 0.1, 0.1, 1.0);
        webgl2.GL.clear(webgl2.GL.COLOR_BUFFER_BIT);
        p.Use();

        const r = 2;
        const x = Math.sin(Radians(now / 100)) * r;
        const z = Math.cos(Radians(now / 100)) * r;

        const view = LookAt(new Float3(x, 0, z), new Float3(0, 0, 0), new Float3(0, 1, 0));
        
        const nowInSeconds = now / 1000.0;
        p.SetFloat4x4("Model", model);
        p.SetFloat4x4("View", view);
        p.SetFloat("RedTime", Math.sin(nowInSeconds + Math.PI / 3) / 2 + 0.5);
        p.SetFloat("GreenTime", Math.sin(nowInSeconds + 2 * Math.PI / 3) / 2 + 0.5);
        p.SetFloat("BlueTime", Math.sin(nowInSeconds + Math.PI) / 2 + 0.5);

        vao.Bind();
        webgl2.GL.drawArrays(webgl2.GL.TRIANGLES, 0, 3);
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