import { _decorator, Button, Color, Component, Graphics, Node, Vec3 } from 'cc';
import { GameFormLogic } from '../../../../Framework/Script/UIComponent/GameFormLogic';
import { UIManager } from '../../../../FrameworkUtil/UI/UIManager';
import { UIFormId } from '../UIUtil';
import { UserInfoAuthButton } from '../../../../FrameworkUtil/UI/Component/UserInfoAuthButton';
import { UserInfo } from '../../../../Framework/Script/App/AppComponent';
import { BezierUtil } from '../../../../Framework/Script/Utils/BezierUtil';
const { ccclass, property } = _decorator;

@ccclass('GameForm')
export class GameForm extends GameFormLogic {
    private _popFormBtn:Node;
    private _graphics:Graphics;
    public onInit(userData: object): void {
        super.onInit(userData);
        this._popFormBtn = this.node.getChildByName("PopForm");
        this._popFormBtn.on(Button.EventType.CLICK,this.onPopFormClick,this);
        this._graphics = this.node.getChildByName("Graphics").getComponent(Graphics);
    }
    public onOpen(userData: object): void {
        super.onOpen(userData);
        let auth = this.getComponentInChildren(UserInfoAuthButton);
        auth.auth(this.onAuthSuccess.bind(this), this.onAuthFail.bind(this));
        this.drawBezier();
    }
    onAuthFail() {
        console.log("auth fail");
    }
    onAuthSuccess(userInfo:UserInfo) {
        console.log("auth success:",userInfo);
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

    private drawBezier(){
        const g = this._graphics;
        let points= [new Vec3(0,0,0),new Vec3(50,50,0),new Vec3(100,0,0),new Vec3(150,-50,0),new Vec3(200,0,0),new Vec3(0,300,0),new Vec3(100,400,0)];
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            g.fillColor = Color.RED;
            g.strokeColor =Color.BLACK;
            g.lineWidth = 4;
            g.circle(p.x,p.y,8);
            g.fill();
            // g.stroke();
        }
        let count = 50;
        let bezier = new BezierUtil(points);
        for (let index = 0; index < count; index++) {
            let e = bezier.uniform_point(index/(count-1));
            g.fillColor = Color.WHITE;
            // g.strokeColor =Color.BLACK;
            g.lineWidth = 4;
            g.circle(e.x,e.y,5);
            g.fill();
            // g.stroke();
        }

        for (let index = 0; index < count; index++) {
            let e = bezier.point(index/(count-1));
            g.fillColor = Color.GREEN;
            // g.strokeColor =Color.BLACK;
            g.lineWidth = 4;
            g.circle(e.x,e.y,5);
            g.fill();
            // g.stroke();
        }
    }
}

