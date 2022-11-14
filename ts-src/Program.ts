class Program {
    //#region Constructors
    constructor(vertSource: string, fragSource: string) {
        const vs = this.MakeShader(gl.VERTEX_SHADER, vertSource);
        const fs = this.MakeShader(gl.FRAGMENT_SHADER, fragSource);
        this._id = this.LinkProgram(vs, fs);
        gl.deleteShader(fs);
        gl.deleteShader(vs);
    }
    //#endregion

    //#region Public API

    public SetFloat(name: string, float: number): void {
        this.Use();
        gl.uniform1f(this.UniformLocation(name), float);
    }

    public SetFloat4x4(name: string, matrix: Float4x4): void {
        this.Use();
        gl.uniformMatrix4fv(this.UniformLocation(name), false, matrix.ToData());
    }

    public Use(): void {
        gl.useProgram(this._id);
    }

    public Release(): void {
        gl.deleteProgram(this._id);
    }
    //#endregion

    //#region Private API
    private LinkProgram(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
        let program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS))
            return program;
        let msg = gl.getProgramInfoLog(program)!;
        gl.deleteProgram(program);
        throw new Error(msg);
    }

    private MakeShader(type: number, source: string): WebGLShader {
        let shader  = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            return shader;
        let msg = gl.getShaderInfoLog(shader)!;
        gl.deleteShader(shader);
        throw new Error(msg);
    }

    private UniformLocation(name: string) {
        const location = gl.getUniformLocation(this._id, name);
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