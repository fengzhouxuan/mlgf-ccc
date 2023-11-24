export abstract class ObjectPoolBase{
    private _name:string;
    constructor(name:string){
        this._name = name;
    }

    
    public get name() : string {
        return this._name;
    }

    abstract get count():number;

    abstract get autoReleaseInterval():number;
    abstract set autoReleaseInterval(v: number);

    abstract get capacity(): number;
    abstract set capacity(v:number);

    abstract release();
    abstract update(dt:number);
    
}