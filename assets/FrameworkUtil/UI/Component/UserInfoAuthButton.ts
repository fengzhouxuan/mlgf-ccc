import { _decorator, Button, Component, Node, UITransform, view } from 'cc';
import { GameEntry } from '../../../GameMain/Script/Base/GameEntry';
import { GetUserInfoOption, UserInfo } from '../../../Framework/Script/App/AppComponent';
const { ccclass, property } = _decorator;

@ccclass('UserInfoAuthButton')
export class UserInfoAuthButton extends Component {
    private _btn:Node;
    private _btnUITransform:UITransform;

    private _success:(userInfo:UserInfo)=>void;
    private _fail:()=>void;
    protected onLoad(): void {
        this._btn = this.getComponentInChildren(Button).node;
        this._btnUITransform = this._btn.getComponent(UITransform);
        this._btn.on(Button.EventType.CLICK, this.onBtnClick, this);
    }

    public auth(success:(userInfo:UserInfo)=>void,fail:()=>void){
        this._success = success;
        this._fail = fail;
        let needBtn = GameEntry.app.isNeedNativeButtonToGetUsrInfo();
        if(needBtn){
            let btnPos = this._btn.getWorldPosition();
            let btnSize = this._btnUITransform.contentSize;
            let visibleSize = view.getVisibleSize();
            let appScreenSize = GameEntry.app.getAppScreenSize();
            let size_scale_width = appScreenSize.width / visibleSize.width;

            let x = (btnPos.x - btnSize.width / 2) * size_scale_width;
              let y = (visibleSize.height- btnPos.y- btnSize.height / 2) * size_scale_width;
              let width = btnSize.width * size_scale_width;
              let height = btnSize.height * size_scale_width;
              let option:GetUserInfoOption = {
                  left: x,
                  top: y,
                  width: width,
                  height: height,
              }
            GameEntry.app.getUserInfo(option,(userInfo)=>{
                success && success(userInfo)
            },
            ()=>{
                fail && fail();
            });
        }
    }

    public shutdown(){
        GameEntry.app.shutdownGetUserInfo();
        this._success=null;
        this._fail=null;
    }

    private onBtnClick(){
        let needBtn = GameEntry.app.isNeedNativeButtonToGetUsrInfo();
        if(!needBtn){
            GameEntry.app.getUserInfo({force:true},(userInfo)=>{
                this._success && this._success(userInfo)
            },
            ()=>{
                this._fail && this._fail();
            });
        }
    }
}

