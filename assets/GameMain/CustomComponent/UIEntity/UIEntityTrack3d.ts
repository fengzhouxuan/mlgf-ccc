import { _decorator, Component, Node } from 'cc';
import { UIEntity } from './UIEntity';
import { UI3dTracker } from './UI3dTracker';
import MlEntry from '../../../Framework/Script/Base/MlEntry';
import { UIEntityComponent } from './UIEntityComponent';
const { ccclass, property } = _decorator;

@ccclass('UIEntityTrack3d')
export class UIEntityTrack3d extends UIEntity {
    protected _tracker: UI3dTracker;
    private _stopTrack:boolean=false;
    onInit(userData: object): void {
        super.onInit(userData);
        this._tracker = this.node.getOrAddComponent(UI3dTracker);
    }
    onShow(userData: object): void {
        super.onShow(userData);
        this._stopTrack =false;
        this._tracker.d3Camera = MlEntry.getComponent(UIEntityComponent).mainCamera;
        this._tracker.d3Target = this._entityData.target3d;
        this._tracker.offset = this._entityData.offset;
        if (this._entityData.target3d) {
            this._tracker.Track();
        } else {
            let pos = this._tracker.getUIPositionForm3dPosition(this._entityData.target3dPosition);
            pos.z = 0;
            this.node.setPosition(pos);
        }
    }

    public stopTrack(){
        this._stopTrack=true;
    }

    protected lateUpdate(dt: number): void {
        if (this._entityData.target3d || !this._stopTrack) {
            this._tracker.Track();
        }
    }
}

