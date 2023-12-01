import { _decorator, Camera, Component, EventTouch, geometry, Input, input, Node, physics, PhysicsSystem } from 'cc';
import { NodeClickable } from './NodeClickable';
const { ccclass, property } = _decorator;

@ccclass('NodeClicker')
export class NodeClicker extends Component {
    private _ray: geometry.Ray = new geometry.Ray();
    private _touchId: number = null;
    private _mainCamera:Camera=null;

    get mainCamera():Camera{
        return this._mainCamera ||null;
    }

    public set mainCamera(v: Camera) {
        this._mainCamera = v;
    }
    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    private onTouchStart(event: EventTouch) {

        let touchId = event.touch.getID();
        this._touchId = touchId;
    }

    private onTouchEnd(event: EventTouch) {

        this.onSingleClick(event);
        this._touchId = null;
    }

    private onSingleClick(event: EventTouch) {
        const touch = event.touch!;
        this.mainCamera?.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this._ray);
        //检测最近的
        if (PhysicsSystem.instance.raycastClosest(this._ray)) {
            const raycastResult = PhysicsSystem.instance.raycastClosestResult;
            //点击到了NodeSelectable
            this.handleClickable(raycastResult,true);
        }
    }

    private handleClickable(raycastResult: physics.PhysicsRayResult,success:boolean){
        if(!success){
            return;
        }
        let clickable = raycastResult.collider.node.getComponent(NodeClickable);
        if(!clickable){
            return;
        }
        if(!clickable.canClick()){
            return;
        }
        clickable.onClick();
    }
}

