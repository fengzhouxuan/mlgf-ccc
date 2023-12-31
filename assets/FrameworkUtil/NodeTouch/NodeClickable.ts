import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export interface INodeClickable {
    onNodeClick(node: Node);
    canNodeClick?(node: Node): boolean;
}

@ccclass('NodeClickable')
export class NodeClickable extends Component {
    public delegate: INodeClickable;
    onClick() {
        this.delegate?.onNodeClick(this.node);
    }

    canClick() {
        if (this.delegate?.canNodeClick) {
            return this.delegate.canNodeClick(this.node);
        }
        return true;
    }
}

