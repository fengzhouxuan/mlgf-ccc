import { _decorator, Button, Component, Label, Node } from 'cc';
import { GameFormLogic } from '../../../../Framework/Script/UIComponent/GameFormLogic';
const { ccclass, property } = _decorator;

@ccclass('TestDialogForm')
export class TestDialogForm extends GameFormLogic {
    private _titleLabel:Label;
    public onInit(userData: object): void {
        super.onInit(userData);
        this._titleLabel = this.node.getChildByPath("TopBar/Label").getComponent(Label);
        this.node.getChildByName("Close").on(Button.EventType.CLICK,this.close,this);
    }
    public onOpen(userData: object): void {
        super.onOpen(userData);
        this._titleLabel.string = userData["title"];
    }
}

