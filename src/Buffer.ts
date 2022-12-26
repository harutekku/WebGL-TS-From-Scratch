class VertexBuffer {
    //#region Constructors
    constructor(data: Float32Array) {
        this._id = webgl2.GL.createBuffer()!;
        webgl2.GL.bindBuffer(webgl2.GL.ARRAY_BUFFER, this._id);
        webgl2.GL.bufferData(webgl2.GL.ARRAY_BUFFER, data, webgl2.GL.STATIC_DRAW);
    }
    //#endregion

    //#region Public API
    public Bind(): void {
        webgl2.GL.bindBuffer(webgl2.GL.ARRAY_BUFFER, this._id);
    }

    public Unbind(): void {
        webgl2.GL.bindBuffer(webgl2.GL.ARRAY_BUFFER, null);
    }

    public Release(): void {
        webgl2.GL.deleteBuffer(this._id);
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
        case webgl2.GL.BOOL:
            return 1;

        case webgl2.GL.BYTE:
        case webgl2.GL.UNSIGNED_BYTE:
            return 1;

        case webgl2.GL.SHORT:
        case webgl2.GL.UNSIGNED_SHORT:
            return 2;

        case webgl2.GL.INT:
        case webgl2.GL.UNSIGNED_INT:
            return 4;

        case webgl2.GL.FLOAT:
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
        this._id = webgl2.GL.createVertexArray()!;
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

            webgl2.GL.vertexAttribPointer(i, element.Count, element.Type, false, stride, offset);
            webgl2.GL.enableVertexAttribArray(i);

            offset += element.Count * element.SizeOf();
        }
        this.Unbind();
    }

    public Bind(): void {
        webgl2.GL.bindVertexArray(this._id);
    }

    public Unbind(): void {
        webgl2.GL.bindVertexArray(null);
    }

    public Release(): void {
        webgl2.GL.deleteVertexArray(this._id);
    }
    //#endregion

    //#region Members
    private _id: WebGLVertexArrayObject;
    //#endregion 
}
