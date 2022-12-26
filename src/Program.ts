class Program {
    //#region Constructors
    constructor(vertSource: string, fragSource: string) {
        const vs = this.MakeShader(webgl2.GL.VERTEX_SHADER, vertSource);
        const fs = this.MakeShader(webgl2.GL.FRAGMENT_SHADER, fragSource);
        this._id = this.LinkProgram(vs, fs);
        webgl2.GL.deleteShader(fs);
        webgl2.GL.deleteShader(vs);
    }
    //#endregion

    //#region Public API
    public SetFloat(name: string, float: number): void {
        this.Use();
        webgl2.GL.uniform1f(this.UniformLocation(name), float);
    }

    public SetFloat4x4(name: string, matrix: Float4x4): void {
        this.Use();
        webgl2.GL.uniformMatrix4fv(this.UniformLocation(name), false, matrix.ToData());
    }

    public Use(): void {
        webgl2.GL.useProgram(this._id);
    }

    public Release(): void {
        webgl2.GL.deleteProgram(this._id);
    }
    //#endregion

    //#region Private API
    private LinkProgram(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
        let program = webgl2.GL.createProgram()!;
        webgl2.GL.attachShader(program, vs);
        webgl2.GL.attachShader(program, fs);
        webgl2.GL.linkProgram(program);

        if (webgl2.GL.getProgramParameter(program, webgl2.GL.LINK_STATUS))
            return program;
        let msg = webgl2.GL.getProgramInfoLog(program)!;
        webgl2.GL.deleteProgram(program);
        throw new Error(msg);
    }

    private MakeShader(type: number, source: string): WebGLShader {
        let shader  = webgl2.GL.createShader(type)!;
        webgl2.GL.shaderSource(shader, source);
        webgl2.GL.compileShader(shader);

        if (webgl2.GL.getShaderParameter(shader, webgl2.GL.COMPILE_STATUS))
            return shader;
        let msg = webgl2.GL.getShaderInfoLog(shader)!;
        webgl2.GL.deleteShader(shader);
        throw new Error(msg);
    }

    private UniformLocation(name: string) {
        const location = webgl2.GL.getUniformLocation(this._id, name);
        if (location === null)
            throw new Error(`Unknown uniform: ${name}`);
        else
            return location;
    }
    //#endregion

    //#region Members
    private _id: WebGLProgram;
    //#endregion
}