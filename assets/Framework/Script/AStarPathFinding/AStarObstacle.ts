import { _decorator, Component, Node, Vec2 } from 'cc';
import MlEntry from '../Base/MlEntry';
import { AStarPathFindComponent } from './AStarPathFindComponent';
import { IPoint } from './AStarNode';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('AStarObstacle')
export class AStarObstacle extends Component {
    private _aStarComponent: AStarPathFindComponent;
    private _obsEnable=false;
    private _point:IPoint;

    
    public get point() : IPoint {
        if(!this._point){
            return this._aStarComponent.position2Point(this.node.worldPosition);
        }
        return this._point;
    }

    public set point(v : IPoint) {
        this._point = v;
    }
    public setPointByIndex(index:Vec2){
        let point = {x:index.x,y:index.y};
        this._point = point;
    }
    
    protected onLoad(): void {
        this._aStarComponent = MlEntry.getComponent(AStarPathFindComponent);
    }
    protected onEnable(): void {

    }

    public reset(){
        this._point=null;
        this.hide();
    }

    public show(){
        if(this._obsEnable){
            return;
        }
        this._obsEnable = true;
        this._aStarComponent.addObstacle(this);
    }

    public hide(){
        if(!this._obsEnable){
            return;
        }
        this._obsEnable = false;
        this._aStarComponent.removeObstacle(this);
    }
}

