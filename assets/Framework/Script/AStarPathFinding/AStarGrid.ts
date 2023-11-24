import { IReference } from "../ReferencePool/IReference";
import { ReferenceCollection } from "../ReferencePool/ReferenceCollection";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { AStarNode, IPoint } from "./AStarNode";

export class AStarGrid implements IReference{
    public static CustomUnitName: string = "AStarGrid";
    private _id:number;
    private _width: number = 0;
    private _height: number = 0;
    private _nodes: AStarNode[][];

    private _aStarNodeReferencePool :ReferenceCollection;
    constructor() {
        this._id = -10000;
        this._width = 0;
        this._height = 0;
        this._nodes = [];
    }
    
    public create(id: number, width: number, height: number): AStarGrid{
        this._id = id;
        this._width = width;
        this._height = height;
        this._aStarNodeReferencePool = ReferencePool.create(AStarNode.CustomUnitName);
        this.createNodes();
        return this;
    }

    clear() {
        this._id=-10000;
        this._width = 0;
        this._height = 0;
        for (let i = 0; i < this._nodes.length; i++) {
            for (let j = 0; j < this._nodes[i].length; j++) {
                const n = this._nodes[i][j];
                this._aStarNodeReferencePool.release(n);
            }
        }
        this._nodes = [];
    }
    get customUnitName(): string {
        return AStarGrid.CustomUnitName;
    }

    public get id() : number {
        return this._id;
    }
    
    public get nodes() : AStarNode[][] {
        return this._nodes;
    }

    public getNodeAt(position: IPoint): AStarNode {
        if (!this.isInGrid(position)) {
            return null;
        }
        return this._nodes[position.y][position.x];
    }

    public isWalkAbleAt(position: IPoint): boolean {
        let node = this.getNodeAt(position);
        if (!node) {
            return false;
        }
        return node.walkable;
    }

    public getNeighborNodes(currentPosition: IPoint,out?:AStarNode[]): AStarNode[] {
        let neighbors=out;
        if(!neighbors){
            neighbors = [];
        }
        const minX = currentPosition.x - 1;
        const maxX = currentPosition.x + 1;
        const minY = currentPosition.y - 1;
        const maxY = currentPosition.y + 1;
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                if (x !== currentPosition.x || y !== currentPosition.y) {
                    if (this.isInGrid({ x: x, y: y }) && this.isWalkAbleAt({ x: x, y: y })) {
                        if (x == currentPosition.x || y == currentPosition.y) {
                            neighbors.push(this.getNodeAt({ x: x, y: y }));
                        }
                    }
                }
            }
        }
        return neighbors;
    }

    public isInGrid(position: IPoint): boolean {
        return (position.x >= 0 && position.x < this._width && position.y >= 0 && position.y < this._height);
    }

    // public setWalkableAt(position:IPoint,walkable:boolean){
    //     let node = this.getNodeAt(position);
    //     if(!node){
    //         return;
    //     }
    //     node.walkable = walkable;
    // }

    private createNodes() {
        let id =0;
        for (let y = 0; y < this._height; y++) {
            this._nodes[y] = [];
            for (let x = 0; x < this._width; x++) {
                let node = this._aStarNodeReferencePool.acquire(AStarNode).create({ x: x, y: y });
                node.id=id;
                this._nodes[y][x] = node;
                id++;
            }
        }
    }

    find1(){
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                let node = this._nodes[y][x];
                if(node["_obstacleCount"]>0){
                    console.log(`大于1 ${x}-${y}=${node["_obstacleCount"]}`);
                }
                if(node["_obstacleCount"]<0){
                    console.log(`小于1 ${x}-${y}=${node["_obstacleCount"]}`);
                }
            }
        }
    }
}
