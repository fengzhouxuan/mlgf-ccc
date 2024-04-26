import MlComponent from "./MlComponent";
import MlEntry from "./MlEntry";
import { _decorator, director, Game, game } from 'cc';
const { ccclass, property } = _decorator;


var timeScale = 1;

//@ts-ignore
game._calculateDT = function (now: number) {
    if (!now) now = performance.now();
    this._deltaTime = now > this._startTime ? (now - this._startTime) / 1000 : 0;
    if (this._deltaTime > Game.DEBUG_DT_THRESHOLD) {
        this._deltaTime = this.frameTime / 1000;
    }
    this._startTime = now;
    return this._deltaTime * timeScale;
};

@ccclass('BaseComponent')
export default class BaseComponent extends MlComponent{

    protected onLoad(): void {
        super.onLoad();
        director.addPersistRootNode(this.node);
    }

    protected update(dt: number): void {
        MlEntry.update(dt);
    }

    public set gameSpeed(v: number) {
        timeScale = v;
    }
    public get gameSpeed(): number {
        return timeScale;
    }
}

