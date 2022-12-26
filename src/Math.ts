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

    //#region Public API
    public Multiply(other: Float4x4): Float4x4 {
        let t = new Float32Array(this._data);
        let l = this._data;
        let r = other._data;

        l[ 0] = t[0] * r[0] + t[1] * r[4] + t[2] * r[ 8] + t[3] * r[12];       
        l[ 1] = t[0] * r[1] + t[1] * r[5] + t[2] * r[ 9] + t[3] * r[13];
        l[ 2] = t[0] * r[2] + t[1] * r[6] + t[2] * r[10] + t[3] * r[14];       
        l[ 3] = t[0] * r[3] + t[1] * r[7] + t[2] * r[11] + t[3] * r[15];
            
        l[ 4] = t[4] * r[0] + t[5] * r[4] + t[6] * r[ 8] + t[7] * r[12];       
        l[ 5] = t[4] * r[1] + t[5] * r[5] + t[6] * r[ 9] + t[7] * r[13];
        l[ 6] = t[4] * r[2] + t[5] * r[6] + t[6] * r[10] + t[7] * r[14];       
        l[ 7] = t[4] * r[3] + t[5] * r[7] + t[6] * r[11] + t[7] * r[15];
            
        l[ 8] = t[8] * r[0] + t[9] * r[4] + t[10] * r[ 8] + t[11] * r[12];       
        l[ 9] = t[8] * r[1] + t[9] * r[5] + t[10] * r[ 9] + t[11] * r[13];
        l[10] = t[8] * r[2] + t[9] * r[6] + t[10] * r[10] + t[11] * r[14];       
        l[11] = t[8] * r[3] + t[9] * r[7] + t[10] * r[11] + t[11] * r[15];

        l[12] = t[12] * r[0] + t[13] * r[4] + t[14] * r[ 8] + t[15] * r[12];       
        l[13] = t[12] * r[1] + t[13] * r[5] + t[14] * r[ 9] + t[15] * r[13];
        l[14] = t[12] * r[2] + t[13] * r[6] + t[14] * r[10] + t[15] * r[14];       
        l[15] = t[12] * r[3] + t[13] * r[7] + t[14] * r[11] + t[15] * r[15];

        return this;
    }

    public Translate(translationVector: Float3): Float4x4 {
        const { X, Y, Z } = translationVector;
        this._data[12] = this._data[0] * X + this._data[4] * Y + this._data[ 8] * Z + this._data[12]; 
        this._data[13] = this._data[1] * X + this._data[5] * Y + this._data[ 9] * Z + this._data[13]; 
        this._data[14] = this._data[2] * X + this._data[6] * Y + this._data[10] * Z + this._data[14]; 
        this._data[15] = this._data[3] * X + this._data[7] * Y + this._data[11] * Z + this._data[15]; 
        return this;
    }

    public Scale(scale: Float3): Float4x4 {
        this._data[ 0] *= scale.X;
        this._data[ 1] *= scale.X;
        this._data[ 2] *= scale.X;
        this._data[ 3] *= scale.X;

        this._data[ 4] *= scale.Y;
        this._data[ 5] *= scale.Y;
        this._data[ 6] *= scale.Y;
        this._data[ 7] *= scale.Y;

        this._data[ 8] *= scale.Z;
        this._data[ 9] *= scale.Z;
        this._data[10] *= scale.Z;
        this._data[11] *= scale.Z;
        return this;
    }

    public Rotate(angle: number, axis: Float3): Float4x4 {
        axis.Normalize();
        const { X, Y, Z } = axis;
        const s   = Math.sin(angle);
        const c   = Math.cos(angle);
        const omc = 1 - c;
        
        let  t    = new Float32Array(9);

        t[0] = c + X * X * omc;
        t[1] = Y * X * omc + Z * s;
        t[2] = Z * X * omc - Y * s;

        t[3] = X * Y * omc - Z * s;
        t[4] = c + Y * Y * omc;
        t[5] = Z * Y * omc + X * s;

        t[6] = X * Z * omc + Y * s;
        t[7] = Y * Z * omc - X * s;
        t[8] = c + Z * Z * omc;

        const l = this._data;
        const r = [
            l[ 0], l[ 1], l[ 2],
            l[ 4], l[ 5], l[ 6],
            l[ 8], l[ 9], l[10]
        ];

        l[ 0] = r[0] * t[0] + r[3] * t[1] + r[6] * t[2];
        l[ 1] = r[1] * t[0] + r[4] * t[1] + r[7] * t[2];
        l[ 2] = r[2] * t[0] + r[5] * t[1] + r[8] * t[2];

        l[ 4] = r[0] * t[3] + r[3] * t[4] + r[6] * t[5];
        l[ 5] = r[1] * t[3] + r[4] * t[4] + r[7] * t[5];
        l[ 6] = r[2] * t[3] + r[5] * t[4] + r[8] * t[5];

        l[ 8] = r[0] * t[6] + r[3] * t[7] + r[6] * t[8];
        l[ 9] = r[1] * t[6] + r[4] * t[7] + r[7] * t[8];
        l[10] = r[2] * t[6] + r[5] * t[7] + r[8] * t[8];

        return this;
    }

    public Set(i: number, j: number, value: number): void {
        this._data[4 * j + i] = value;
    }

    public ToData(): Float32Array {
        return this._data;
    }

    public ToPrettyString(): string {
        let maxLen = 0;
        const precision = 10;
        this._data.forEach((e, i, a) => {
            const len = e.toFixed(precision).length;
            if (maxLen < len)
                maxLen = len;
        });

        let retVal: Array<String> = [];
        
        for (let i = 0; i != 4; ++i) {
            retVal.push("| ");
            for (let j = 0; j != 4; ++j) {
                let str = this._data[j * 4 + i].toFixed(precision);
                str = ' '.repeat(maxLen - str.length) + str + ' ';

                retVal.push(str);
            }
            retVal.push("|\n");
        }
        return retVal.join("");
    }
    //#endregion

    //#region Members
    private _data: Float32Array;
    //#endregion
}

class Float3 {
    //#region Constructors
    constructor(x: number, y: number, z: number) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
    //#endregion

    //#region Public API
    public Length(): number {
        return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }

    public Normalize(): void {
        const length = this.Length();
        if (!length)
            return;
        this.X /= length;
        this.Y /= length;
        this.Z /= length;
    }

    public Add(other: Float3): void {
        this.X += other.X,
        this.Y += other.Y,
        this.Z += other.Z
    }

    public Scale(c: number): void {
        this.X *= c;
        this.Y *= c;
        this.Z *= c;
    }

    public Dot(other: Float3): number {
        return this.X * other.X + this.Y * other.Y + this.Z * other.Z;
    }

    public Cross(other: Float3): Float3 {
        return new Float3(
            this.Y * other.Z - this.Z * other.Y,
            this.Z * other.X - this.X * other.Z,
            this.X * other.Y - this.Y * other.X
        );
    }

    public ToString(): string {
        return `[${this.X}, ${this.Y}, ${this.Z}]`;
    }
    //#endregion

    //#region Members
    public X: number;
    public Y: number;
    public Z: number;
    //#endregion
}
