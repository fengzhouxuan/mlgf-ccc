
import MlEntry from "./MlEntry";

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MlComponent')
export default class MlComponent extends Component {

    protected onLoad(): void {
        MlEntry.regisiterComponent(this);
    }

    onUpdate(dt:number){

    }
}
