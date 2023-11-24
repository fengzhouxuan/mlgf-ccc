import { _decorator, Component, Node } from 'cc';
import { UIFormLogic } from './UIFormLogic';
import { GameEntry } from '../../../GameMain/Script/Base/GameEntry';
const { ccclass, property } = _decorator;

@ccclass('GameFormLogic')
export class GameFormLogic extends UIFormLogic {

    public close(ignoreFade?:boolean){
        //TODO:UI渐隐
        GameEntry.ui.closeUIForm(this.uiForm,null);
    }

    public onInit(userData: object): void {
        super.onInit(userData);
    }

    public onRecycle(): void {
        super.onRecycle();
    }

    public onOpen(userData: object): void {
        super.onOpen(userData);
        //TODO:UI渐现
    }

    public onClose(userData: object): void {
        super.onClose(userData);
    }

    public onPause(): void {
        super.onPause();
    }

    public onResume(): void {
        super.onResume();
    }

    public onCover(): void {
        super.onCover();
    }

    public onReveal(): void {
        super.onReveal();
    }

    public onRefocus(userData: object): void {
        super.onRefocus(userData);
    }

    public onUpdate(dt: number): void {
        super.onUpdate(dt);
    }

    public onDepthChanged(uiGroupDepth: number, depthInUIGroup: number): void {
        //TODO let oldDepth =
        super.onDepthChanged(uiGroupDepth,depthInUIGroup);
        //TODO:设置层级 
    }
}


