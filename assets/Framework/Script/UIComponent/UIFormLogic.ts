import { _decorator, Component, Node } from 'cc';
import { UIForm } from './UIForm';
import { UIAdapter } from '../Utils/UIAdapter';
const { ccclass, property } = _decorator;

@ccclass('UIFormLogic')
export abstract class UIFormLogic extends Component {
    private _available: boolean;
    private _visible: boolean;
    private _uiForm:UIForm;
    private _originalLayer:number;

    
    public get uiForm() : UIForm {
        return this._uiForm;
    }

    public get nodeName() : string {
        return this.node.name;
    }
    
    public set nodeName(v : string) {
        this.node.name = v;
    }
    
    public get available(): boolean {
        return this._available;
    }
    public get visible(): boolean {
        return this._visible && this._available;
    }
    public set visible(value: boolean) {
        
        if(!this._available){
            return;
        }
        if(this.visible==value){
            return;
        }
        this._visible = value;
       this.internalSetVisible(value);
    }

    public onInit(userData:object){
        this._uiForm = this.getComponent(UIForm);
        this._originalLayer = this.node.layer;
        let adapters = this.node.getComponentsInChildren(UIAdapter);
        adapters.forEach(element => {
            element.Adaper();
        });
    }

    public onOpen(userData:object){
        this._available = true;
        this.visible = true;
    }

    public onClose(userData:object){
        this.node.layer = this._originalLayer;
        this.visible = false;
        this._available = false;
    }

    public onPause(){
        this.visible = false;
    }

    public onResume(){
        this.visible = true;
    }

    public onRecycle(){}
    public onCover(){}
    public onReveal(){}
    public onRefocus(userData:object){}
    public onUpdate(dt:number){}
    public onDepthChanged(uiGroupDepth:number,depthInUIGroup:number){}

    public internalSetVisible(visible:boolean){
        this.node.active = visible;
    }
}


