import { UIConfigData } from "../../../FrameworkUtil/UI/UIManager";


export enum UIFormId {
    HomeForm = 1,
    GameForm=2,
}
UIConfigData[UIFormId.GameForm] = { bundleName: "Share", group: "Default", assetName: "UI/Form/GameForm", AllowMultiInstance: false, pauseCoveredUIForm: true };