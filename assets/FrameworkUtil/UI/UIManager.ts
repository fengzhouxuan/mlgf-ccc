import { GameEntry } from "../../GameMain/Script/Base/GameEntry";

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
    uiFormId: number;
    userData: object;
}


export var UIConfigData: { [key: number]: UIConfig } = {
    // [UIFormId.GameForm]: { bundleName: "Share", group: "Default", assetName: "UI/Form/GameForm", AllowMultiInstance: false, pauseCoveredUIForm: true },
}

export class UIManager {

    public static OpenGameUIForm(uiFormId: number, userData?: object): number {
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

    public static CloseUIForm(uiFormId:number,userData?:object){
        let uiConfig = UIConfigData[uiFormId];
        let uiForm = GameEntry.ui.getUIFormWithAssetName(uiConfig.assetName);
        if (!uiForm) {
            return;
        }
        GameEntry.ui.closeUIForm(uiForm);
    }

    public static CloseGameUIFormBySerId(serId: number, userData?: object) {
        GameEntry.ui.closeUIFormBySerialId(serId, userData);
    }

    public static pushDialog(uiFormId:number,userData?: object){
        let uiConfig = UIConfigData[uiFormId];
        GameEntry.ui.pushPopForm(uiConfig.bundleName, uiConfig.assetName, uiConfig.group, userData);
    }

    public static pauseDialog(pause:boolean){
        
    }
}


