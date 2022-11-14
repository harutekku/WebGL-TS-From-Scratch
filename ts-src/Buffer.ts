class VertexBuffer {
    //#region Constructors
    constructor(data: Float32Array) {
        this._id = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._id);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }
    //#endregion

    //#region Public API
    public Bind(): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._id);
    }

    public Unbind(): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public Release(): void {
        gl.deleteBuffer(this._id);
    }
    //#endregion 

    //#region Members
    private _id: WebGLBuffer;
    //#endregion

}

class VALayoutElement {
    //#region Constructors
    constructor(type: number, count: number) {
        this.Type  = type;
        this.Count = count;
    }
    //#endregion 

    //#region Public API
    public SizeOf(): number {
        switch (this.Type) {
        case gl.BOOL:
            return 1;

        case gl.BYTE:
        case gl.UNSIGNED_BYTE:
            return 1;

        case gl.SHORT:
        case gl.UNSIGNED_SHORT:
            return 2;

        case gl.INT:
        case gl.UNSIGNED_INT:
            return 4;

        case gl.FLOAT:
            return 4;
        default:
            throw new Error("Invalid type");
        }
    }
    //#endregion

    //#region Members
    public readonly Type: number;
    public readonly Count: number;
    //#endregion
}

class VALayout {
    //#region Constructors
    constructor() {
        this._layout = new Array<VALayoutElement>();
        this._stride = 0;
    }
    //#endregion

    //#region Public API
    public Push(element: VALayoutElement): void {
        this._layout.push(element);
        this._stride += element.SizeOf() * element.Count;
    }

    public Layout(): Array<VALayoutElement> {
        return this._layout;
    }

    public Stride(): number {
        return this._stride;
    }
    //#endregion

    //#region Members
    private _layout: Array<VALayoutElement>;
    private _stride: number;
    //#endregion
}

class VertexArray {
    //#region Constructors
    constructor() {
        this._id = gl.createVertexArray()!;
    }
    //#endregion

    //#region Public API
    public AddLayout(buffer: VertexBuffer, layout: VALayout): void {
        this.Bind();
        buffer.Bind();
        const data   = layout.Layout();
        const stride = layout.Stride();
        let offset   = 0;
        for (let i = 0; i != data.length; ++i) {
            const element = data[i];

            gl.vertexAttribPointer(i, element.Count, element.Type, false, stride, offset);
            gl.enableVertexAttribArray(i);

            offset += element.Count * element.SizeOf();
        }
        this.Unbind();
    }

    public Bind(): void {
        gl.bindVertexArray(this._id);
    }

    public Unbind(): void {
        gl.bindVertexArray(null);
    }

    public Release(): void {
        gl.deleteVertexArray(this._id);
    }
    //#endregion

    //#region Members
    private _id: WebGLVertexArrayObject;
    //#endregion 
}
