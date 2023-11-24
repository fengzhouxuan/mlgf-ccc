import { _decorator, Camera, Component, Node } from 'cc';
import MlComponent from '../../../Framework/Script/Base/MlComponent';
const { ccclass, property } = _decorator;

@ccclass('UIEnittyComponent')
export class UIEntityComponent extends MlComponent {
    private _mainCamea:Camera=null;

    get mainCamera():Camera{
        return this._mainCamea ||null;
    }

    public set mainCamera(v: Camera) {
        this._mainCamea = v;
    }
}

