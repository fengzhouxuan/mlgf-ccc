import { _decorator, Button, Component, Node } from 'cc';
import { GameFormLogic } from '../../../../Framework/Script/UIComponent/GameFormLogic';
import { UIManager } from '../../../../FrameworkUtil/UI/UIManager';
import { UIFormId } from '../UIUtil';
const { ccclass, property } = _decorator;

@ccclass('GameForm')
export class GameForm extends GameFormLogic {
    private _popFormBtn:Node;
    public onInit(userData: object): void {
        super.onInit(userData);
        this._popFormBtn = this.node.getChildByName("PopForm");
        this._popFormBtn.on(Button.EventType.CLICK,this.onPopFormClick,this);
    }
    public onOpen(userData: object): void {
        super.onOpen(userData);
    }

    private onPopFormClick(){

        let pop1= {title:"弹窗1"};
        UIManager.pushDialog(UIFormId.TestDialog,pop1);

        let pop2= {title:"弹窗2"};
        UIManager.pushDialog(UIFormId.TestDialog,pop2);

        let pop3= {title:"弹窗3"};
        UIManager.pushDialog(UIFormId.TestDialog,pop3);

        let pop4= {title:"弹窗4"};
        UIManager.pushDialog(UIFormId.TestDialog,pop4);

        let pop5= {title:"弹窗5"};
        UIManager.pushDialog(UIFormId.TestDialog,pop5);
    }
}

