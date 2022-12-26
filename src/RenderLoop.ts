class RenderLoop {
    //#region Constructors
    constructor(onRender: (now: number) => void) {
        this._run = true;

        const helper = (now: number) => {
            if (this.Run()) {
                onRender(now);
            }
            requestAnimationFrame(helper)
        };
        this._callbackId = requestAnimationFrame(helper);
    }
    //#endregion

    //#region Public API
    public Run() {
        return this._run;
    }

    public Stop() {
        this._run = false;
        cancelAnimationFrame(this._callbackId);
    }

    public RegisterKeyEvent(handler: (e: KeyboardEvent) => void): void {
        window.onkeydown = handler;
    }
    //#endregion

    //#region Members
    private _run: boolean;
    private _callbackId: number;
    //#endregion
}