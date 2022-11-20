//#region Helpers
function ConstructLocalURL(subpath: string): string {
    const pathElements = document.baseURI.split('/');
    pathElements.pop();
    const url = pathElements.join('/') + subpath;
    return url;
}

async function GetFile(path: string): Promise<string> {
    return fetch(path)
    .then((response) => {
        if (!response.ok)
            throw new Error(`Error: ${response.status}`);
        return response.text();
    });
}

function InitCanvas(): typeof InitCanvas {
    webgl2.Canvas.width  = document.body.clientWidth;
    webgl2.Canvas.height = document.body.clientHeight;
    webgl2.GL.viewport(0, 0, webgl2.Canvas.width, webgl2.Canvas.height);

    return InitCanvas;
}

function Radians(degrees: number): number {
    return (Math.PI * degrees) / 180.0;
}

function Perspective(fov: number, ratio: number, near: number, far: number): Float4x4 {
    let result = new Float4x4();

    const t = Math.tan(fov / 2) * near;
    const b = -t;
    const r = t * ratio;
    const l = -r;

    result.Set(0, 0, (2 * near) / (r - l));
    result.Set(0, 2, (r + l) / (r - l));

    result.Set(1, 1, (2 * near) / (t - b));
    result.Set(1, 2, (t + b) / (t - b));

    result.Set(2, 2, -(far + near) / (far - near));
    result.Set(2, 3, (-2 * far * near) / (far - near));

    result.Set(3, 2, -1);

    return result;
}
//#endregion