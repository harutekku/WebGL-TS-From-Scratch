class Float4x4 {
    //#region Constructors
    constructor(init?: number) {
        this._data = new Float32Array(16);
        if (init) {
            this.Set(0, 0, init);
            this.Set(1, 1, init);
            this.Set(2, 2, init);
            this.Set(3, 3, init);
        }
    }
    //#endregion

    public Set(i: number, j: number, value: number): void {
        this._data[4 * i + j] = value;
    }

    public ToData(): Float32Array {
        return this._data;
    }

    private _data: Float32Array;
}