import { Quat, Vec3 } from "cc";

export abstract class EntityData{
    private _entityId:number;
    public shower:object;
    private _position:Vec3 = new Vec3();
    private _rotation:Quat = Quat.IDENTITY;
    private _scale: Vec3 = new Vec3(1, 1, 1);
    
    public get scale(): Vec3 {
        return this._scale;
    }
    public set scale(value: Vec3) {
        this._scale = value;
    }

    public get entityId() : number {
        return this._entityId;
    }

    public set entityId(v : number) {
        this._entityId = v;
    }
    
    public get position() : Vec3 {
        return this._position;
    }
    
    public set position(v : Vec3) {
        this._position = v;
    }
    
    public get rotation() : Quat {
        return this._rotation;
    }
    
    public set rotation(v : Quat) {
        this._rotation = v;
    }
    
    
    
}