import { _decorator, Color, Component, EventTarget, Node, path, Quat, Tween, tween, Vec2, Vec3 } from 'cc';
import { ReferencePool } from '../ReferencePool/ReferencePool';
import { AStarPathFinder } from './AStartPathFinder';
import { ReferenceCollection } from '../ReferencePool/ReferenceCollection';
import { AStarPathFindComponent } from './AStarPathFindComponent';
import MlEntry from '../Base/MlEntry';
import { IPoint } from './AStarNode';
const { ccclass, property } = _decorator;
export interface ICccAstarAgentDelegate {
    onNavgationDone(agent: CccAstarAgent);
    onNavDoneStepByStep(agent: CccAstarAgent,path:Vec3[],step:number);
    canMoveWhenFindPath(agent: CccAstarAgent,path:Vec3[],complete:boolean,userData:object):boolean;
}
@ccclass('CccAstarAgent')
export class CccAstarAgent extends Component {
    public delegate: ICccAstarAgentDelegate;
    public includeStartNode: boolean;
    public includeEndNode: boolean = false;
    private _gridId: number = 0;
    private _aStarPathFinderReferencePool: ReferenceCollection = null;
    private _aStarPathFinder: AStarPathFinder = null;
    private _aStarComponent: AStarPathFindComponent = null;
    private _inited = false;
    private _curPath: Vec3[] = [];
    private _curPathIndex = 0;
    private _speed = 6;
    private _isDone: boolean = false;
    private _isRunning = false;
    private _pointInGrid:IPoint;
    
    public get pointInGrid() : IPoint {
        if(!this._pointInGrid){
            return this._aStarComponent.getIndexInGrid(this.node.getWorldPosition());
        }
        return this._pointInGrid;
    }
    
    public set pointInGrid(v : IPoint) {
        this. _pointInGrid= v;
    }
    
    public get isDone(): boolean {
        return this._isDone;
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }

    public get aStarPathFinder(): AStarPathFinder {
        return this._aStarPathFinder;
    }
    
    public set speed(v : number) {
        this._speed = v;
    }
    
    public init() {
        if (this._inited) {
            return;
        }
        this._inited = true;
        this._aStarComponent = MlEntry.getComponent(AStarPathFindComponent);
        this._aStarPathFinderReferencePool = ReferencePool.create(AStarPathFinder.CustomUnitName);
        this._aStarPathFinder = this._aStarPathFinderReferencePool.acquire(AStarPathFinder);
        this._aStarPathFinder.create();
        // this._aStarComponent.registerAgent(this);
    }

    protected onDestroy(): void {
        if (this._inited) {
            this._aStarPathFinderReferencePool.release(this._aStarPathFinder);
        }
    }

    public getNavPath(startPoint:IPoint,endPosition:Vec3):{path:IPoint[],complete:boolean}{
        return this._aStarComponent.getNavPath(this,startPoint,this._aStarComponent.position2Point(endPosition));
    }

    public navTo(endPosition: Vec3,userData:object) {
        this.init();
        // this._navTimes++;
        this._isDone = false;
        this._isRunning = true;
        this._aStarComponent.addRequestPathQueue(this, endPosition,userData);
    }

    public stopNav(){
        this._curPath.length = 0;
        this._curPathIndex = 0;
        this._isRunning = false;
        this._isDone = false;
    }

    public reset(){
        this._aStarPathFinderReferencePool.release(this.aStarPathFinder);
        this._curPath.length=0;
        this._isRunning = false;
        this._isDone = false;
        this._curPathIndex = 0;
        this._pointInGrid=null;
        this._inited=false;
    }

    public onPathFind(path: Vec3[],complete:boolean,userData:object) {
        // this._navTimes--;
        // if(this._navTimes>0){
        //     return;
        // }
        let canMove=true;
        if(this.delegate){
            canMove = this.delegate.canMoveWhenFindPath(this,path,complete,userData);
        }
        this._path = path;
        if(canMove){
            this._curPath = path;
            this._curPathIndex = 0;
        }else{
            this._isRunning = false;
            this._isDone = true;
        }
    }

    _path: Vec3[];
    protected update(dt: number): void {
        // this.drawGizmo();
        this.updateMovePath(dt);
    }
    _tempMoveDirVec = new Vec3();
    _tempRotation = new Quat();

    
    private updateMovePath(dt: number) {
        if (this._curPath.length == 0) {
            this._isRunning = false;
            return;
        }
        if (this._curPathIndex >= this._curPath.length) {
            this._isDone = true;
            this._curPath.length = 0;
            this._isRunning = false;
            this.delegate?.onNavgationDone(this);
            return;
        }
        this._isRunning = true;
        let nextPoint = this._curPath[this._curPathIndex];
        nextPoint.y=0;
        let pos = this.node.getWorldPosition();
        pos.y=0;
        let prePoint = this._curPathIndex == 0 ? pos : this._curPath[this._curPathIndex-1];

        Vec3.subtract(this._tempMoveDirVec, nextPoint, prePoint);
        this._tempMoveDirVec.y = 0;
        this._tempMoveDirVec.normalize();

        let rotation = this.node.rotation;
        let tempQuat =new Quat();
        Quat.fromViewUp(this._tempRotation, this._tempMoveDirVec)
        Quat.slerp(tempQuat, rotation, this._tempRotation, 0.3);
        this.node.setRotation(tempQuat);

        let dtx = nextPoint.x - pos.x;
        let dtz = nextPoint.z - pos.z;
        let dif = dtx*dtx+dtz*dtz;
        let stepx = this._speed * dt * Math.abs(this._tempMoveDirVec.x);
        let stepz = this._speed * dt * Math.abs(this._tempMoveDirVec.z);
        let step = stepx*stepx +stepz*stepz;
        let done  =false;
        if(dif<=step){
            pos = nextPoint;
            done=true;
        }else{
            pos.x+=Math.sign(dtx) * stepx;
            pos.z+=Math.sign(dtz) * stepz;
        }
        this.node.setWorldPosition(pos);
        if(done){
            this.delegate?.onNavDoneStepByStep(this,this._curPath,this._curPathIndex);
            this._curPathIndex++;
        }
    }

    //debug
    private drawGizmo() {
        // if (!this._path || this._path.length == 0) {
        //     return;
        // }
        // let startPos = this._path[0];
        // for (let i = 1; i < this._path.length; i++) {
        //     const path1 = this._path[i];
        //     MainCamera.camera.camera.geometryRenderer.addLine(startPos, path1, Color.YELLOW,false);
        //     startPos = path1;
        // }
    }
}

