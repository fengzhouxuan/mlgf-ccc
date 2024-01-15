import { Component, Node, _decorator } from "cc";
import { UIGroup } from "./UIGroup";
import { UIFormLogic } from "./UIFormLogic";
const { ccclass } = _decorator;

@ccclass('UIForm')
export class UIForm extends Component {
    
    private _serialId:number;
    private _uiFormAssetName:string;
    private _pauseCoveredUIForm:boolean;
    private _uiGroup:UIGroup;
    private _depthInUIGroup:number;
    private _uiFormLogic:UIFormLogic;
    public get serialId() : number {
        return this._serialId;
    }
    
    public get uiFormAssetName() : string {
        return this._uiFormAssetName;
    }

    public get uiFormNode(): Node {
        return this.node;
    }
    
    public get pauseCoveredUIForm() : boolean {
        return this._pauseCoveredUIForm;
    }
    
    public get uiGroup() : UIGroup {
        return this._uiGroup;
    }
    
    public get depthInUIGroup() : number {
        return this._depthInUIGroup;
    }
    
    public get uiFormLogic() : UIFormLogic {
        return this._uiFormLogic;
    }
    
    onInit(serialId: number, uiFormAssetName: string, uiGroup: UIGroup, pauseCoveredUIForm: boolean, isNewInstance: boolean, userData: object) {
        this._serialId = serialId;
        this._uiFormAssetName = uiFormAssetName;
        this._uiGroup = uiGroup;
        this._pauseCoveredUIForm = pauseCoveredUIForm;
        this._depthInUIGroup=0;
        if(!isNewInstance){
            return;
        }
        //TODO:这里的报错是ccc的bug，这是报错不影响运行时
        //@ts-ignore
        this._uiFormLogic = this.node.getComponent(UIFormLogic);
        if(!this.uiFormLogic){
            console.error("UI节点没有绑定GameFormLogic脚本");
            return;
        }
        this._uiFormLogic.onInit(userData);
    }

    public onRecycle(){
        this._uiFormLogic.onRecycle();
        this._serialId =0;
        this._depthInUIGroup=0;
        this._pauseCoveredUIForm = true;   
    }

    onOpen(userData: object) {
        this._uiFormLogic.onOpen(userData);
    }

    onClose(userData: object) {
        this._uiFormLogic.onClose(userData);
    }
    
    public onUpdate(dt:number){
        this._uiFormLogic.onUpdate(dt);
    }

    public onCover(){
        this._uiFormLogic.onCover();
    }

    public onReveal(){
        this._uiFormLogic.onReveal();
    }

    public onRefocus(userData: object) {
       this._uiFormLogic.onRefocus(userData);
    }

    public onPause(){
        this._uiFormLogic.onPause();
    }

    public onResume(){
        this._uiFormLogic.onResume();
    }

    public onDepthChanged(uiGroupDepth:number,depthInUIGroup:number){
        this._depthInUIGroup = depthInUIGroup;
        this.node.setSiblingIndex(depthInUIGroup-1);
        this._uiFormLogic.onDepthChanged(uiGroupDepth,depthInUIGroup);
    }
}