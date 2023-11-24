import { IReference } from "../ReferencePool/IReference";

export interface IPoint{
    x:number,
    y:number
}
export class AStarNode implements IReference{
    public static CustomUnitName = "AStarNode";
    private _id:number;
    private _position:IPoint={x:0,y:0};
    private _walkable:boolean =true;
    private _obstacleCount=0;
    constructor(){
        this._id=0;
        this._position = { x: 0, y: 0 };
        // this._walkable = true;
        this._obstacleCount=0;
    }

    public create(position:IPoint):AStarNode{
        this._position = position;
        return this;
    }
    clear() {
        this._id = 0;
        this._position = { x: 0, y: 0 };
        // this._walkable = true;
        this._obstacleCount=0;
    }

    
    public get id() : number {
        return this._id
    }
    
    public set id(v : number) {
        this._id = v;
    }
    
    public get position() : IPoint {
        return this._position;
    }
    
    public get walkable():boolean {
        return  this._obstacleCount==0;
    }
    
    // public set walkable(value:boolean) {
    //     this._walkable = value;
    // }

    public addObstacle(){
        this._obstacleCount++;
    }

    public subObstacle(){
        this._obstacleCount--;
    }
        
    public get customUnitName(): string {
        return AStarNode.CustomUnitName;
    }

}