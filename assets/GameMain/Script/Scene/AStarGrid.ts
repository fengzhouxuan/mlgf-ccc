import { _decorator, Component, Node, Vec2 } from 'cc';
import { GameEntry } from '../Base/GameEntry';
const { ccclass, property } = _decorator;

@ccclass('AStarGrid')
export class AStarGrid extends Component {
    @property({ type: Node })
    gridRootPosition: Node;
    @property({ type: Vec2 })
    gridSize:Vec2;
    start() {
        GameEntry.pathFind.createGrid(0,this.gridSize.x,this.gridSize.y,this.gridRootPosition.worldPosition);
    }

    update(deltaTime: number) {
        
    }
}

