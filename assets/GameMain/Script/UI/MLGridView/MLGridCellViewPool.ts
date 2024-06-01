import { MLGridCellView } from "./MLGridCellView";

export class MLGridCellViewPool {
    private _pool: MLGridCellView[];
    constructor() {
        this._pool = [];
    }

    public size () {
        return this._pool.length;
    }

    public clear () {
        const count = this._pool.length;
        for (let i = 0; i < count; ++i) {
            this._pool[i].node?.destroy();
        }
        this._pool.length = 0;
    }

    public put (obj: MLGridCellView) {
        if (obj && this._pool.indexOf(obj) === -1) {
            if(obj.node){
                obj.node.active = false;
            }
            this._pool.unshift(obj);
        }
    }

    public get (): MLGridCellView | null {
        if(this._pool.length === 0){
            return null;
        }
        const obj = this._pool.shift();
        if(obj.node){
            obj.node.active = true;
        }
        return obj;
        const last = this._pool.length - 1;
        if (last < 0) {
            return null;
        } else {
            const obj = this._pool[last];
            this._pool.length = last;
            if(obj.node){
                obj.node.active = true;
            }
            return obj;
        }
    }
}

