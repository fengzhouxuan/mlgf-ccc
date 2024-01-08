import { UIConfigData } from "../../../FrameworkUtil/UI/UIManager";


export enum UIFormId {
    HomeForm = 1,
    GameForm=2,
    TestDialog=100
}
UIConfigData[UIFormId.GameForm] = { bundleName: "Share", group: "Default", assetName: "UI/Form/GameForm", AllowMultiInstance: false, pauseCoveredUIForm: true };
UIConfigData[UIFormId.TestDialog] = { bundleName: "Share", group: "Dialog", assetName: "UI/Form/Dialog", AllowMultiInstance: true, pauseCoveredUIForm: true };