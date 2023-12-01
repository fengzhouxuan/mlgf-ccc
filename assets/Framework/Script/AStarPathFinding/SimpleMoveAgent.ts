import { _decorator, Component, math, Node, Quat, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
export interface ISimpleMoveDelegate {
    onSimpleMoveComplete(agent: SimpleMoveAgent);
}
@ccclass('SimpleMoveAgent')
export class SimpleMoveAgent extends Component {
    private _moveDuration: number = 1;
    private _curDuration: number = 0;
    private _targetPosition: Vec3;
    private _started = false;
    private _originalPos: Vec3;
    private _midPos = new Vec3();
    private _running = false;
    private _changingPlace=false;
    public delegate: ISimpleMoveDelegate;

    public get running(): boolean {
        return this._running;
    }
    
    public get changingPlace() : boolean {
        return this._changingPlace;
    }
    
    public set moveDuration(v: number) {
        this._moveDuration = v;
    }

    public set targetPosition(v: Vec3) {
        this._targetPosition = v;
    }

    public simpleMove(duration: number, targetPosition: Vec3) {
        this._running = true;
        this._curDuration = 0;
        this._originalPos = this.node.getWorldPosition();
        this._moveDuration = duration;
        this._targetPosition = targetPosition;
        Vec3.subtract(this._midPos, targetPosition, this._originalPos);
        this._midPos.y = 0;
        this._midPos.normalize();

        let tempQuat = new Quat();
        Quat.fromViewUp(tempQuat, this._midPos);
        this.node.setWorldRotation(tempQuat);
        this._started = true;
    }

    public reset() {
        this._started = false;
        this._moveDuration = 0;
        this._curDuration = 0;
        this._targetPosition = null;
        this._originalPos = null;
        this._running=false;
        this._changingPlace=false;
    }

    update(deltaTime: number) {
        if (!this._started) {
            return;
        }
        this._curDuration += deltaTime;
        let t = math.clamp01(this._curDuration / this._moveDuration);
        Vec3.lerp(this._midPos, this._originalPos, this._targetPosition, t);
        this.node.setWorldPosition(this._midPos);
        if (t >= 1) {
            this._started = false;
            this._running = false;
            this.delegate?.onSimpleMoveComplete(this);
        }
    }
}

