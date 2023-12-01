import { js } from "cc";
import { ReferenceCollection } from "../ReferencePool/ReferenceCollection";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { StringUtils } from "../Utils/StringUtils";
import { UIForm } from "./UIForm";
import { UIFormInfo } from "./UIFormInfo";
import { UIGroupHelper } from "./UIGroupHelper";

export class UIGroup{

    private _name:string;
    private _depth:number;
    private _paused:boolean;
    private _uiGroupHelper:UIGroupHelper=null;
    private _uiFormInfos:UIFormInfo[]=null;

    private _uiFormInfoReferencePool:ReferenceCollection=null;

    constructor(name:string,depth:number,uiGroupHelper:UIGroupHelper){
        if(StringUtils.IsNullOrEmpty(name)){
            console.error("UIGroup 的名字不能为空");
            return;
        }
        if (!uiGroupHelper){
            console.error("UIGroupHelper 不能为空");
            return;
        }
        this._name = name;
        this._paused = false;
        this._uiGroupHelper = uiGroupHelper;
        this._uiFormInfos=[];
        this._depth = depth;

        this._uiFormInfoReferencePool = ReferencePool.create(UIFormInfo.CustomUnitName);
    }

    
    public get name() : string {
        return this._name;
    }
    
    public get depth() : number {
        return this._depth;
    }
    public set depth(v : number) {
        if(this._depth==v){
            return;
        }
        this._depth= v;
        this._uiGroupHelper.setDepth(v);
        this.refresh();
    }
    
    public get paused() : boolean {
        return this._paused;
    }
    public set paused(v : boolean) {
        if(this._paused==v){
            return;
        }
        this._paused = v;
        this.refresh();
    }
    
    public get uiFormCount() : number {
        return this._uiFormInfos.length;
    }
    
    public get currentUIForm() : UIForm {
        if(this._uiFormInfos.length==0){
            return null;
        }
        let lastUIFormInfo = this._uiFormInfos[0];
        return lastUIFormInfo !=null ? lastUIFormInfo.uiForm :null;
    }
    
    public get uiGroupHelper() : UIGroupHelper {
        return this._uiGroupHelper;
    }
    
    public update(dt:number){
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            if(uiFormInfo.paused){
                break;
            }
            uiFormInfo.uiForm.onUpdate(dt);
        }
    }

    public hasUIForm(serialId:number):boolean{
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            if(uiFormInfo.uiForm.serialId==serialId){
                return true;
            }
        }
        return false;
    }

    public hasUIFormWithAssetName(assetName:string):boolean{
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            if (uiFormInfo.uiForm.uiFormAssetName == assetName) {
                return true;
            }
        }
        return false;
    }

    public getUIForm(serialId:number):UIForm{
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            if (uiFormInfo.uiForm.serialId == serialId) {
                return uiFormInfo.uiForm;
            }
        }
        return null;
    }

    public getUIFormWithAssetName(assetName:string):UIForm{
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            if (uiFormInfo.uiForm.uiFormAssetName == assetName) {
                return uiFormInfo.uiForm;
            }
        }
        return null;
    }

    public getAllUIFormsNoAlloc(results:UIForm[]):UIForm[]{
        if(results==null || results ==undefined){
            console.error(" results为out型的参数，必须先初始化");
            return;
        }
        results.length=0;
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            results.push(uiFormInfo.uiForm);
        }
    }
    public internalGetAllUIForms(results: UIForm[]) {
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            results.push(uiFormInfo.uiForm);
        }
    }

    public internalGetAllUIFormsWithAssetName(assetName:string,results:UIForm[]){
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            if (uiFormInfo.uiForm.uiFormAssetName == assetName) {
                results.push(uiFormInfo.uiForm);
            }
        }
    }

    public addUIForm(uiForm:UIForm){
        let uiFormInfo = this._uiFormInfoReferencePool.acquire(UIFormInfo).initialize(uiForm);
        this._uiFormInfos.unshift(uiFormInfo);
    }

    public removeUIForm(uiForm:UIForm){
        let uiFormInfo = this.getUIFormInfo(uiForm);
        if(!uiFormInfo){
            console.error(`找不到UIForm,id为${uiForm.serialId},资源名为${uiForm.uiFormAssetName}`);
            return;
        }
        if(!uiFormInfo.covered){
            uiFormInfo.covered = true;
            uiForm.onCover();
        }
        if(!uiFormInfo.paused){
            uiFormInfo.paused = true;
            uiForm.onPause();
        }
        js.array.remove(this._uiFormInfos,uiFormInfo);
        this._uiFormInfoReferencePool.release(uiFormInfo);
    }

    public refocusUIForm(uiForm:UIForm){
        let uiFormInfo = this.getUIFormInfo(uiForm);
        if (!uiFormInfo) {
            console.error(`找不到UIForm,id为${uiForm.serialId},资源名为${uiForm.uiFormAssetName}`);
            return;
        }
        js.array.remove(this._uiFormInfos, uiFormInfo);
        this._uiFormInfos.unshift(uiFormInfo);
    }

    public refresh(){
        let pause = this._paused;
        let cover = false;
        let depth = this.uiFormCount;
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const current = this._uiFormInfos[i];
            if(!current){
                return;
            }
            current.uiForm.onDepthChanged(this.depth,depth--);
            if (!current) {
                return;
            }
            if(pause){
                if(!current.covered){
                    current.covered = true;
                    current.uiForm.onCover();
                    if (!current) {
                        return;
                    }
                }
                if(!current.paused){
                    current.paused = true;
                    current.uiForm.onPause();
                    if (!current) {
                        return;
                    }
                }

            }else{
                if(current.paused){
                    current.paused =false;
                    current.uiForm.onResume();
                    if (!current) {
                        return;
                    }
                }
                if(current.uiForm.pauseCoveredUIForm){
                    pause=true;
                }
                if(cover){
                    if(!current.covered){
                        current.covered =true;
                        current.uiForm.onCover();
                        if (!current) {
                            return;
                        }
                    }
                }else{
                    if(current.covered){
                        current.covered = false;
                        current.uiForm.onReveal();
                        if (!current) {
                            return;
                        }
                    }
                    cover = true;
                }
            }
        }
    }

    private getUIFormInfo(uiForm:UIForm):UIFormInfo{
        if(!uiForm){
            console.error("UIForm 不能为空");
            return null;
        }
        for (let i = 0; i < this._uiFormInfos.length; i++) {
            const uiFormInfo = this._uiFormInfos[i];
            if (uiFormInfo.uiForm == uiForm) {
                return uiFormInfo;
            }
        }
        return null;
    }
}