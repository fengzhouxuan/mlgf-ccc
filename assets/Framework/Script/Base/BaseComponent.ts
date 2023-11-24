import MlComponent from "./MlComponent";
import MlEntry from "./MlEntry";
import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseComponent')
export default class BaseComponent extends MlComponent{

    protected onLoad(): void {
        super.onLoad();
        director.addPersistRootNode(this.node);
    }

    protected update(dt: number): void {
        MlEntry.update(dt);
    }
}

