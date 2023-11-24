import { _decorator, Color, color, Component, GeometryRenderer, math, Node, Vec3 } from 'cc';
import MlComponent from '../Base/MlComponent';
import { CccAstarAgent } from './CccAstarAgent';
import { AStarGrid } from './AStarGrid';
import { ReferenceCollection } from '../ReferencePool/ReferenceCollection';
import { ReferencePool } from '../ReferencePool/ReferencePool';
import { RequestPathInfo } from './RequestPathInfo';
import { IPoint } from './AStarNode';
import { AStarObstacle } from './AStarObstacle';
const { ccclass, property } = _decorator;

@ccclass('AStarPathFindComponent')
export class AStarPathFindComponent extends MlComponent {

    @property
    maxFinderRequestOneTime = 1;

    private _agents: Array<CccAstarAgent> = [];
    private _obstacle: Array<AStarObstacle> = [];
    private _requestPathQueue: RequestPathInfo[] = [];
    private _gridWidth: number;
    private _gridHeight: number;
    private _coordinateOrigin: Vec3;
    private _grid: AStarGrid = null;
    private _defaultAgentSize = 1;
    private _defaultGridNodeSize = 1;

    private _gridReferencePool: ReferenceCollection;
    private _requestReferencePool: ReferenceCollection;

    protected onLoad(): void {
        super.onLoad();
        this._gridReferencePool = ReferencePool.create(AStarGrid.CustomUnitName);
        this._requestReferencePool = ReferencePool.create(RequestPathInfo.CustomUnitName);
    }

    public reset(){
        if(this._grid){
            this._gridReferencePool.release(this._grid);
        }
        this._grid=null;
        this._agents.length=0;
        this._obstacle.length=0;
        this._requestPathQueue.length=0;
    }
    public get gridWidth(): number {
        return this._gridWidth;
    }

    public get gridHeight(): number {
        return this._gridHeight;
    }

    public get coordinateOrigin(): Vec3 {
        return this._coordinateOrigin;
    }

    public createGrid(id: number, width: number, height: number, coordinateOrigin: Vec3) {
        let grid = this._gridReferencePool.acquire(AStarGrid).create(id, width, height);
        this._grid = grid;
        this._coordinateOrigin = coordinateOrigin;
    }

    public registerAgent(agent: CccAstarAgent) {
        this._agents.push(agent);
    }

    public removeAgent(agent: CccAstarAgent) {
        this._agents.splice(this._agents.indexOf(agent), 1);
    }

    public addObstacle(obstacle: AStarObstacle){
        this._obstacle.push(obstacle);
        let point =obstacle.point;
        let node =this._grid.getNodeAt(point);
            if(!node){
                return;
            }

        node.addObstacle();
    }

    public removeObstacle(obstacle: AStarObstacle){
        this._obstacle.splice(this._obstacle.indexOf(obstacle),1);
        let point = obstacle.point;
        let node =this._grid.getNodeAt(point);
            if(!node){
                return;
            }

        node.subObstacle();

    }

    public addRequestPathQueue(agent: CccAstarAgent, endPosition: Vec3,userData:object) {
        let info = this._requestReferencePool.acquire(RequestPathInfo).create(agent, endPosition,userData);
        this._requestPathQueue.push(info);
    }

    public getIndexInGrid(wPos:Vec3){
        if(!this._grid){
            return;
        }
        return this.position2Point(wPos);
    }

    public canWalkInIndex(index:IPoint):boolean{
        let node =this._grid.getNodeAt(index);
        return node.walkable;
    }

    onUpdate(dt: number): void {
        this.loopRequestPathQueue();
        this.drawGizmo();
    }

    private loopRequestPathQueue() {
        if(!this._grid){
            return;
        }
        if (this._requestPathQueue.length == 0) {
            return;
        }
        let count = Math.min(this._requestPathQueue.length, this.maxFinderRequestOneTime);
        for (let i = 0; i < count; i++) {
            let info = this._requestPathQueue.shift();
            if (!info) {
                return;
            }
            let agent = info.agent;
            let targetPosition = info.targetPosition;

            let startPoint = agent.pointInGrid;
            let endPoint = this.position2Point(targetPosition);
            let path = this.getNavPath(agent,startPoint,endPoint);
            if(path.path.length!=0){
                let cccPath = this.points2Positions(path.path);
                targetPosition.y=0;
                cccPath.push(targetPosition);
                agent.onPathFind(cccPath,path.complete,info.userData);
            }else{
                agent.onPathFind([],path.complete,info.userData);
            }
            this._requestReferencePool.release(info);
        }
    }

    public getNavPath(agent:CccAstarAgent,startPoint:IPoint,endPoint:IPoint):{path:IPoint[],complete:boolean}{
        let path = agent.aStarPathFinder.findPath(this._grid, startPoint, endPoint,agent.includeStartNode,agent.includeEndNode);
        return path;
    }

    public position2Point(pos: Vec3): IPoint {
        let localPosition:Vec3=new Vec3();
        Vec3.subtract(localPosition,pos,this._coordinateOrigin);
        let x = Math.floor(localPosition.x / this._defaultGridNodeSize);
        let y = Math.floor(localPosition.z / this._defaultGridNodeSize);
        return { x: x, y: y };
    }

    private points2Positions(points:IPoint[]):Vec3[]{
        let positions:Vec3[]=[];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            let pos =this.point2Position(point);
            positions.push(pos);
        }
        return positions;
    }

    public point2Position(point: IPoint): Vec3 {
        let x = point.x * this._defaultGridNodeSize + this._coordinateOrigin.x;
        let z = point.y * this._defaultGridNodeSize + this._coordinateOrigin.z;
        return new Vec3(x,0,z);
    }

    //debug
    private drawGizmo(){
        return;
        if(!this._grid){
            return;
        }
        // for (let i = 0; i < this._grid.nodes.length; i++) {
        //     for (let j = 0; j < this._grid.nodes[i].length; j++) {
        //         const node = this._grid.nodes[i][j];
        //         let pos = this.point2Position(node.position);
        //         pos.y =0.1;
        //         MainCamera.camera?.camera.geometryRenderer?.addCircle(pos, 0.5, node.walkable ? Color.GREEN :Color.RED, 6,false);
        //     }            
        // }
    }
}

