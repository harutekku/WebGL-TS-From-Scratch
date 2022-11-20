class Context {
    //#region Constructors
    constructor() {
        this._context = null;
        Object.seal(this);
    }
    //#endregion

    //#region Public API
    public get GL(): WebGL2RenderingContext {
        if (!this._context)
            throw new Error("No context");
        return this._context;
    }

    public get Canvas(): HTMLCanvasElement {
        if (!this._context)
            throw new Error("No context");
        return this._context.canvas;
    }

    public SetCurrentContext(context: WebGL2RenderingContext): void {
        if (this._context)
            return;
        else if (!context)
            throw new Error("Context can't be null");

        this._context = context;
        Object.freeze(this);
    } 
    //#endregion

    //#region Members
    private _context: WebGL2RenderingContext | null;
    //#endregion
}

const webgl2 = new Context();
