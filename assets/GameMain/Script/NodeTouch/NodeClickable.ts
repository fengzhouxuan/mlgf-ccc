import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export interface INodeClickable {
    onNodeClick(node: Node);
    canNodeClick?(node: Node): boolean;
}

@ccclass('NodeClickable')
export class NodeClickable extends Component {
    public delegete: INodeClickable;
    onClick() {
        this.delegete?.onNodeClick(this.node);
    }

    canClick() {
        if (this.delegete?.canNodeClick) {
            return this.delegete.canNodeClick(this.node);
        }
        return true;
    }
}

