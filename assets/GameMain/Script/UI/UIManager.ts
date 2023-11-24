import { Sprite, SpriteFrame } from "cc";
import { GameEntry } from "../Base/GameEntry";
import { AssetUtil } from "../Utils/AssetUtil";
import { CloseUIFormCompleteEventArgs } from "../../../Framework/Script/UIComponent/CloseUIFormCompleteEventArgs";
import { UIFormLogic } from "../../../Framework/Script/UIComponent/UIFormLogic";
import { OpenUIFormSuccessEventArgs } from "../../../Framework/Script/UIComponent/OpenUIFormSuccessEventArgs";

export interface UIConfig {
    /** bundle包名 */
    bundleName: string;
    /** 界面组 */
    group: string;
    /** 预制资源相对路径 */
    assetName: string;
    AllowMultiInstance?: boolean;
    pauseCoveredUIForm?: boolean;
}

export interface DialogData {
    uifromId: UIFormId;
    userData: object;
}

export enum UIFormId {
    HomeForm = 1,
    GameForm=2,
}

export var UIConfigData: { [key: number]: UIConfig } = {
    [UIFormId.GameForm]: { bundleName: "Share", group: "Default", assetName: "UI/Form/GameForm", AllowMultiInstance: false, pauseCoveredUIForm: true },
}

export class UIManager {

    public static OpenGameUIForm(uiFormId: UIFormId, userData?: object): number {
        let uiConfig = UIConfigData[uiFormId];
        if (!uiConfig.AllowMultiInstance) {
            if (GameEntry.ui.isLoadingUIFormWithAssetName(uiConfig.assetName)) {
                return null;
            }
            if (GameEntry.ui.getUIFormWithAssetName(uiConfig.assetName)) {
                return null;
            }
        }
        return GameEntry.ui.openUIForm(uiConfig.bundleName, uiConfig.assetName, uiConfig.group, uiConfig.pauseCoveredUIForm, userData);
    }

    public static CloseUIForm(uiFormId:UIFormId,userData?:object){
        let uiConfig = UIConfigData[uiFormId];
        let uiform = GameEntry.ui.getUIFormWithAssetName(uiConfig.assetName);
        if (!uiform) {
            return;
        }
        GameEntry.ui.closeUIForm(uiform);
    }

    public static CloseGameUIFormBySerId(serId: number, userData?: object) {
        GameEntry.ui.closeUIFormBySerialId(serId, userData);
    }

    public static LoadSpf(name: string, sprite: Sprite) {
        GameEntry.res.LoadResInBundle("Share", AssetUtil.getSpfName(name), SpriteFrame, null, null, (err, spf: SpriteFrame, userData) => {
            if (!err) {
                let sp = userData as Sprite;
                sp.spriteFrame = spf;
            }
        }, sprite);
    }
    public static LoadSpfWithBundle(bundleName: string, name: string, sprite: Sprite) {
        GameEntry.res.LoadResInBundle(bundleName, AssetUtil.getSpfName(name), SpriteFrame, null, null, (err, spf: SpriteFrame, userData) => {
            if (!err) {
                let sp = userData as Sprite;
                sp.spriteFrame = spf;
            }
        }, sprite);
    }

    private static _dialogs: DialogData[] = [];
    private static _curDialogSerid = 0;
    private static _curDialog:UIFormLogic;
    private static _paused=false;
    static init() {
        GameEntry.event.on(CloseUIFormCompleteEventArgs.EventId, this.onCloseUIForm, this);
        GameEntry.event.on(OpenUIFormSuccessEventArgs.EventId,this.onOpenUIForm,this);
    }

    private  static _intervalAdd=0;
    static update(dt:number){
        this._intervalAdd+=dt;
        if(this._intervalAdd>=0.5){
            this.onUpdateInSec();
        }
    }

    private static onUpdateInSec(){
        this.tryShowDialog();
    }

    public static pushDialog(dialogData: DialogData) {
        this._dialogs.push(dialogData);
        // this.tryShowDialog();
    }

    public static pauseDialog(pause:boolean){
        this._paused= pause;
        if(this._curDialog){
            this._curDialog.visible = !pause;
        }
    }

    private static tryShowDialog() {
        if (this._curDialogSerid != 0) {
            let isLoading = GameEntry.ui.isLoadingUIForm(this._curDialogSerid);
            let form = GameEntry.ui.getUIForm(this._curDialogSerid);
            if(!isLoading && !form){
                this._curDialogSerid=0;
            }else{
                return;
            }
        }
        if (this._dialogs.length == 0) {
            return;
        }
        let dialog = this._dialogs.shift();
        this._curDialogSerid = this.OpenGameUIForm(dialog.uifromId, dialog.userData);
    }

    private static onCloseUIForm(sender: object, args: CloseUIFormCompleteEventArgs) {
        if (!args) {
            return;
        }
        if (args.serialId != this._curDialogSerid) {
            return;
        }
        this._curDialogSerid = 0;
    }

    private static onOpenUIForm(sender:object,args:OpenUIFormSuccessEventArgs){
        if (!args) {
            return;
        }
        if (args.uiForm.serialId != this._curDialogSerid) {
            return;
        }
        this._curDialog = args.uiForm.uiFormLogic;
        if(this._paused){
            this._curDialog.visible =false;
        }
    }
}

