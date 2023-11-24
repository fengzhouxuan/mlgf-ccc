import { Constructor } from "../Base/MlEntry";
import { Fsm } from "./Fsm";

export abstract class FsmState<T> {
    protected _cachedFsm: Fsm<T>;
    protected _cachedOwner: T;
    public OnInit(fsm: Fsm<T>) {
        this._cachedFsm = fsm;
        this._cachedOwner = fsm.owner;
    }
    public onEnter(fsm: Fsm<T>) {

    }

    public onUpdate(fsm: Fsm<T>, dt: number) {

    }
    public onLeave(fsm: Fsm<T>, isShutdown: boolean) {

    }

    public onDestroy(fsm: Fsm<T>) {

    }
    protected changeState(fsm: Fsm<T>, state: Constructor<FsmState<T>>) {
        if (!fsm) {
            console.error("fsm 不能为空");
            return;
        }
        if (!state) {
            console.error("fsmState不能为空");
            return;
        }
        fsm.changeState(state);
    }

    public subScrip<TFunction extends (...any: any[]) => void>(type: number | string, callback: TFunction, thisArg?: any) {
        this._cachedFsm.subScrip(type, callback, thisArg);
    }

    public unSubScrip<TFunction extends (...any: any[]) => void>(type: number | string, callback: TFunction, thisArg?: any) {
        this._cachedFsm.unSubScrip(type, callback, thisArg);
    }
}