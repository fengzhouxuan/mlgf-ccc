import { _decorator, Camera, Component, Node } from 'cc';
import MlComponent from '../../../Framework/Script/Base/MlComponent';
const { ccclass, property } = _decorator;

@ccclass('UIEntityComponent')
export class UIEntityComponent extends MlComponent {
    private _mainCamera:Camera=null;

    get mainCamera():Camera{
        return this._mainCamera ||null;
    }

    public set mainCamera(v: Camera) {
        this._mainCamera = v;
    }
}

