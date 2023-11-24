import { IReference } from "../ReferencePool/IReference";
import { ReferenceCollection } from "../ReferencePool/ReferenceCollection";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { AStarGrid } from "./AStarGrid";
import { AStarNode, IPoint } from "./AStarNode";

export class AStarFGHCost implements IReference {
    public static CustomUnitName: string = "AStarFGHCost";

    private _gCost: number;
    private _hCost: number;
    private _node: AStarNode = null;
    private _inCloseList: boolean = false;
    private _inOpenList: boolean = false;
    private _parent: AStarFGHCost = null;
    constructor() {
        this._gCost = 0;
        this._hCost = 0;
        this._node = null;
        this._inCloseList = false;
        this._inOpenList = false;
        this._parent = null;
    }
    public get parent(): AStarFGHCost {
        return this._parent;
    }
    public set parent(v: AStarFGHCost) {
        this._parent = v;
    }

    public get node(): AStarNode {
        return this._node;
    }
    public set node(value: AStarNode) {
        this._node = value;
    }

    public get hCost(): number {
        return this._hCost;
    }
    public set hCost(value: number) {
        this._hCost = value;
    }
    public get fCost(): number {
        return this._gCost + this._hCost;
    }

    public get gCost(): number {
        return this._gCost;
    }
    public set gCost(value: number) {
        this._gCost = value;
    }

    public get inOpenList(): boolean {
        return this._inOpenList;
    }
    public set inOpenList(v: boolean) {
        this._inOpenList = v;
    }

    public get inCloseList(): boolean {
        return this._inCloseList;
    }
    public set inCloseList(v: boolean) {
        this._inCloseList = v;
    }

    clear() {
        this._gCost = 0;
        this._hCost = 0;
        this._node = null;
        this._inCloseList = false;
        this._inOpenList = false;
        this._parent = null;
    }

    get customUnitName(): string {
        return AStarFGHCost.CustomUnitName;
    }
}

export class AStarPathFinder implements IReference {
    public static CustomUnitName: string = "AStarPathFinder";

    private _closeList: AStarFGHCost[] = [];
    private _openList: AStarFGHCost[] = [];
    private _weight: number = 1;
    private _nodeCosts: AStarFGHCost[] = [];
    private _aStarFGHCostReferencePool: ReferenceCollection;
    constructor() {
        this._closeList.length = 0;
        this._openList.length = 0;
        this._nodeCosts.length = 0;
    }
    clear() {
        this._closeList.length = 0;
        this._openList.length = 0;
        this._nodeCosts.length = 0;
        this.releaseNodeCosts();
    }
    get customUnitName(): string {
        return AStarPathFinder.CustomUnitName;
    }

    public create(): AStarPathFinder {
        this._aStarFGHCostReferencePool = ReferencePool.create(AStarFGHCost.CustomUnitName);
        return this;
    }

    private _outNeighbors=[];
    public findPath(grid: AStarGrid, startPosition: IPoint, endPosition: IPoint, includeStartNode=false, includeEndNode=false):{path:IPoint[],complete:boolean} {
        if (!grid.isWalkAbleAt(startPosition) || !grid.isWalkAbleAt(endPosition)) {
            return {path:[],complete:false};
        }

        this._closeList = [];
        this._openList = [];
        let startNode = grid.getNodeAt(startPosition);
        let endNode = grid.getNodeAt(endPosition);

        for (let y = 0; y < grid.nodes.length; y++) {
            for (let x = 0; x < grid.nodes[y].length; x++) {
                let costNode = this._aStarFGHCostReferencePool.acquire(AStarFGHCost);
                let node = grid.nodes[y][x];
                let gCost = 0;
                let hCost = 0;
                let inCloseList = false;
                if (!node.walkable) {
                    gCost = hCost = 0;
                    inCloseList = true;
                    this._closeList.push(costNode);
                } else {
                    hCost = this.calculateHeuristic(node.position, endNode.position);
                }
                costNode.gCost = gCost;
                costNode.hCost = hCost;
                costNode.node = node;
                costNode.inCloseList = inCloseList;
                if (node.id === startNode.id) {
                    costNode.inOpenList = true;
                    this._openList.push(costNode);
                }
                this._nodeCosts.push(costNode);
            }
        }

        while (this._openList.length > 0) {
            const currentNode = this._openList.reduce((minNode, node) => (node.fCost < minNode.fCost ? node : minNode));
            currentNode.inOpenList = false;
            this._openList.splice(this._openList.indexOf(currentNode), 1);
            currentNode.inCloseList = true;
            this._closeList.push(currentNode);

            if (currentNode.node.id === endNode.id) {
                let path = this.backTree(currentNode, includeStartNode, includeEndNode);
                this.releaseNodeCosts();
                return {path:path,complete:true};
            }
            this._outNeighbors.length=0;
            grid.getNeighborNodes(currentNode.node.position,this._outNeighbors);
            for (const i in this._outNeighbors) {
                const neighbor = this.getCostNodeByGridNode(this._outNeighbors[i]);
                if (neighbor.inCloseList) {
                    continue;
                }
                let newGCost = currentNode.gCost + this._weight;

                if (!neighbor.inOpenList || newGCost < neighbor.gCost) {
                    neighbor.gCost = newGCost;
                    neighbor.parent = currentNode;

                    if (!neighbor.inOpenList) {
                        neighbor.inOpenList = true;
                        this._openList.push(neighbor);
                    }
                }
            }
        }
        // let path = this.backTree(this._closeList[this._closeList.length - 1], includeStartNode, includeEndNode);
        this.releaseNodeCosts();
        return {path:[],complete:false};
    }

    private getCostNodeByGridNode(node: AStarNode): AStarFGHCost {
        for (let i = 0; i < this._nodeCosts.length; i++) {
            const costNode = this._nodeCosts[i];
            if (node.id === costNode.node.id) {
                return costNode;
            }
        }
        return null;
    }

    private releaseNodeCosts(){
        for (let i = 0; i < this._nodeCosts.length; i++) {
            const costNode = this._nodeCosts[i];
           this._aStarFGHCostReferencePool.release(costNode);
        }
        this._nodeCosts.length=0;
    }

    private calculateHeuristic(pos0: IPoint, pos1: IPoint): number {
        const dx = Math.abs(pos1.x - pos0.x);
        const dy = Math.abs(pos1.y - pos0.y);
        // return (dx + dy) * this._weight;

        // const dx = (pos1.x - pos0.x);
        // const dy = (pos1.y - pos0.y);
        // return (dx*dx+dy*dy)*this._weight;

        // return Math.max(dx, dy) * this._weight;
        return dy*this._weight;
    }

    private backTree(endNode: AStarFGHCost, includeStartNode, includeEndNode): IPoint[] {
        const path: IPoint[] = [];
        let node:AStarFGHCost=null;
        if (!endNode.parent){
            node = endNode;
        }else{
            node = includeEndNode ? endNode:endNode.parent;
        }
        while (node.parent) {
            path.unshift(node.node.position);
            node = node.parent;
        }
        if (includeStartNode) {
            path.unshift(node.node.position);
        }
        return path;
    }
}