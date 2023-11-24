import { AssetManager, CCFloat, CCInteger, Canvas, Node, Prefab, UITransform, Vec3, Widget, _decorator, view ,screen, ResolutionPolicy, Camera} from "cc";
import MlComponent from "../Base/MlComponent";
import { UIGroup } from "./UIGroup";
import { UIForm } from "./UIForm";
import { ResourceComponent } from "../ResourceComponent/ResourceComponent";
import { ObjectPoolComponent } from "../ObjectPool/ObjectPoolComponent";
import { EventComponent } from "../EventComponent/EventComponent";
import { UIFormHelper } from "./UIFormHelper";
import { ReferenceCollection } from "../ReferencePool/ReferenceCollection";
import MlEntry from "../Base/MlEntry";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { OpenUIFormSuccessEventArgs } from "./OpenUIFormSuccessEventArgs";
import { CloseUIFormCompleteEventArgs } from "./CloseUIFormCompleteEventArgs";
import { ObjectPool } from "../ObjectPool/ObjectPool";
import { UIFormInstanceObject } from "./UIFormInstanceObject";
import { StringUtils } from "../Utils/StringUtils";
import { UIGroupHelper } from "./UIGroupHelper";
import { LoadUIFormInfo } from "./LoadUIFormInfo";
import { UIGroupCreateInfo } from "./UIGroupCreateInfo";
const { ccclass, property} = _decorator;

@ccclass('UIComponent')
export class UIComponent extends MlComponent{
    private _uiGroups: Map<string, UIGroup> = new Map<string, UIGroup>;
    private _uiFormBeingLoaded: Map<number, string> = new Map<number, string>;
    private _uiFormsToReleaseonLoad:Set<number> =new Set<number>;
    private _recycleQueue:UIForm[]=[];
    private _resourceComponent: ResourceComponent = null;
    private _objectPoolComponent: ObjectPoolComponent = null;
    private _eventComponent: EventComponent = null;
    private _instancePool:ObjectPool<UIFormInstanceObject>=null;
    private _uiFormHelper:UIFormHelper=null;
    private _serialId:number;
    private _uiCamera:Camera;
    
    private _openUIFormSuccessEventArgsReferencePool: ReferenceCollection = null;
    private _closeUIFormCompleteEventArgsReferencePool: ReferenceCollection = null;
    private _loadUIFormReferencePool: ReferenceCollection = null;
    private _uiFormInstanceReferencePool: ReferenceCollection = null;

    @property({ type: Node })
    uiInstanceRoot:Node;
    @property({ type: CCInteger })
    instanceCapacity: number;
    @property({type:CCFloat})
    instanceAutoReleaseInterval:number;
    @property({ type: CCFloat })
    instanceExpireTime: number;

    @property({displayName:"UI组",type:[UIGroupCreateInfo]})
    uiGroupConfigs: UIGroupCreateInfo[]=[];

    protected onLoad(): void {
        super.onLoad();
        this.canvasScaler();
        this._uiCamera = this.getComponentInChildren(Camera);
        view.setResizeCallback(()=>{
            this.canvasScaler();
        });
    }

    private canvasScaler() {
        let designSize = view.getDesignResolutionSize();
        let winSize = screen.windowSize;
        if (winSize.width / designSize.width < winSize.height / designSize.height) {
            view.setDesignResolutionSize(designSize.width, designSize.height, ResolutionPolicy.FIXED_WIDTH);
        } else {
            view.setDesignResolutionSize(designSize.width, designSize.height, ResolutionPolicy.FIXED_HEIGHT);
        }
    }

    protected start(): void {
        this._objectPoolComponent = MlEntry.getComponent(ObjectPoolComponent);
        this._resourceComponent = MlEntry.getComponent(ResourceComponent);
        this._eventComponent = MlEntry.getComponent(EventComponent);
        this._uiFormHelper = new UIFormHelper();
        this._serialId=0;
        this._instancePool = this._objectPoolComponent.createObjectPool("uiInstancePool",this.instanceAutoReleaseInterval,this.instanceExpireTime,this.instanceCapacity);
        this._openUIFormSuccessEventArgsReferencePool = ReferencePool.create(OpenUIFormSuccessEventArgs.EventId);
        this._closeUIFormCompleteEventArgsReferencePool = ReferencePool.create(CloseUIFormCompleteEventArgs.EventId);
        this._loadUIFormReferencePool = ReferencePool.create(LoadUIFormInfo.CustomUnitName);
        this._uiFormInstanceReferencePool = ReferencePool.create(UIFormInstanceObject.CustomUnitName);

        if(!this.uiInstanceRoot){
            console.error("uiIntaneRoot 不存在，请先设置uiIntaneRoot，必须包含Canvas组件");
            return;
        }
        if(!this.uiInstanceRoot.getComponent(Canvas)){
            console.error("uiIntaneRoot必须包含Canvas组件");
            return;
        }
        for (let i = 0; i < this.uiGroupConfigs.length; i++) {
            const uiGroupConfig = this.uiGroupConfigs[i];
            if(!this.addUIGroup(uiGroupConfig.groupName,uiGroupConfig.depth)){
                console.error(`创建UIGroup ${uiGroupConfig.groupName} 失败`);
                continue;
            }
        }
    }
    
    public get uiGroupCount(){
        return this._uiGroups.size;
    }
    
    public get uiCamera() : Camera {
        return this._uiCamera;
    }
    
    onUpdate(dt: number): void {
        while (this._recycleQueue.length > 0) {
            let uiForm = this._recycleQueue.shift();
            uiForm.onRecycle();
            this._instancePool.unSpawnWithObject(uiForm.uiFormNode);
        }
        for (const [key, value] of this._uiGroups) {
            value.update(dt);
        }
    }

    public hasUIGroup(name:string):boolean{
        if(StringUtils.IsNullOrEmpty(name)){
            console.error("UIGroup name 不能为空");
            return;
        }
        return this._uiGroups.has(name);
    }

    public getUIGroup(name:string):UIGroup{
        if (StringUtils.IsNullOrEmpty(name)) {
            console.error("UIGroup name 不能为空");
            return;
        }
        if (this._uiGroups.has(name)){
            return this._uiGroups.get(name);
        }
        return null;
    }

    public getAllUIGroupsNoAlloc(results:UIGroup[]):UIGroup[]{
        if(!results){
            console.error("results为out类型的参数，必须初始化");
            return;
        }
        results.length=0;
        for (const [key, value] of this._uiGroups) {
            results.push(value);
        }
    }

    public addUIGroup(name:string,uiGroupDepth:number):boolean{
        if (StringUtils.IsNullOrEmpty(name)) {
            console.error("UI组名不能为空");
            return false;
        }
 
        if(this.hasUIGroup(name)){
            console.error("UI组已存在");
            return false;
        }
        let uiGroupHelper = new Node(`UIGroup-${name}`).getOrAddComponent(UIGroupHelper);
        if (uiGroupHelper == null) {
            console.error("entityGroupHelper不能为空");
            return false;
        }
        uiGroupHelper.addComponent(UITransform);
        let widget = uiGroupHelper.addComponent(Widget);
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.left=0;
        widget.right=0;
        widget.top=0;
        widget.bottom=0;
        uiGroupHelper.node.setParent(this.uiInstanceRoot);
        uiGroupHelper.node.setScale(Vec3.ONE);
       return this.internalAddUIGroup(name,uiGroupDepth,uiGroupHelper);
    }

    private internalAddUIGroup(name:string,uiGroupDepth:number,uiGroupHelper:UIGroupHelper):boolean{
        if(!uiGroupHelper){
            console.error("uiGroupHelper 不能为空");
            return false;
        }
        this._uiGroups.set(name,new UIGroup(name,uiGroupDepth,uiGroupHelper));
        return true;
    }

    public hasUIForm(serialId:number):boolean{
        for (const [key, value] of this._uiGroups) {
            if(value.hasUIForm(serialId)){
                return true;
            }
        }
        return false;
    }

    public hasUIFormWithAssetName(assetName:string):boolean{
        for (const [key, value] of this._uiGroups) {
            if (value.hasUIFormWithAssetName(assetName)) {
                return true;
            }
        }
        return false;
    }

    public getUIForm(serialId:number):UIForm{
        for (const [key, value] of this._uiGroups) {
            let uiForm = value.getUIForm(serialId);
            if (uiForm) {
                return uiForm;
            }
        }
        return null;
    }

    public getUIFormWithAssetName(assetName:string):UIForm{
        for (const [key, value] of this._uiGroups) {
            let uiForm = value.getUIFormWithAssetName(assetName);
            if (uiForm) {
                return uiForm;
            }
        }
        return null;
    }

    public getUIForms(assetName:string,results:UIForm[]):UIForm[]{
        if (!results) {
            console.error("results为out类型的参数，必须初始化");
            return;
        }
        results.length = 0;
        for (const [key, value] of this._uiGroups) {
            value.internalGetAllUIFormsWithAssetName(assetName,results);
        }
    }

    public getAllLoadedUIForms():UIForm[]{
        let results:UIForm[]=[];
        for (const [key, value] of this._uiGroups) {
            value.internalGetAllUIForms(results);
        }
        return results;
    }
    public getAllLoadingUIFromSerialIds():number[]{
        let results:number[]=[];
        for (const [key, value] of this._uiFormBeingLoaded) {
            results.push(key);
        }
        return results;
    }

    public isLoadingUIForm(serialId:number):boolean{
        return this._uiFormBeingLoaded.has(serialId);
    }

    public isLoadingUIFormWithAssetName(assetName:string):boolean{
        for (const [key, value] of this._uiFormBeingLoaded) {
            if(value==assetName){
                return true;
            }
        }
        return false;
    }

    public isValidUIForm(uiForm:UIForm):boolean{
        if(!uiForm){
            return false;
        }
        return this.hasUIForm(uiForm.serialId);
    }

    public openUIForm(bundleName: string, assetName: string, groupName: string, pauseCoveredUIForm:boolean,userData:object):number{
        if(StringUtils.IsNullOrEmpty(bundleName)){
            console.error("bundleName 不能为空");
            return;
        }
        if (StringUtils.IsNullOrEmpty(assetName)) {
            console.error("assetName 不能为空");
            return;
        }
        if (StringUtils.IsNullOrEmpty(groupName)) {
            console.error("groupName 不能为空");
            return;
        }

        let uiGroup = this.getUIGroup(groupName);
        if(!uiGroup){
            console.error("uiGroup 不存在");
            return;
        }
        let serialId = ++this._serialId;
        let uiFormInstanceObject = this._instancePool.spawn(assetName);
        if(!uiFormInstanceObject){
            this._uiFormBeingLoaded.set(serialId,assetName);
            let loadUIFormInfo = this._loadUIFormReferencePool.acquire(LoadUIFormInfo).initialize(serialId,assetName,uiGroup,pauseCoveredUIForm,userData);
            this._resourceComponent.LoadResInBundle(bundleName, assetName, Prefab, null, this.loadAssetProgressCallback.bind(this), this.loadAssetCompleteCallback.bind(this),loadUIFormInfo);
        }else{
            this.internalOpenUIForm(serialId,assetName,uiGroup,uiFormInstanceObject.target,pauseCoveredUIForm,false,0,userData);
        }
        return serialId;
    }

    public closeUIFormBySerialId(serialId:number,userData:object){
        if(this.isLoadingUIForm(serialId)){
            this._uiFormsToReleaseonLoad.add(serialId);
            this._uiFormBeingLoaded.delete(serialId);
            return;
        }
        let uiForm = this.getUIForm(serialId);
        if(!uiForm){
            console.error("要关闭的UIFrom找不到");
            return;
        }
        this.closeUIForm(uiForm,userData);
    }

    public closeUIForm(uiForm:UIForm,userData?:object){
        if(!uiForm){
            console.error("要关闭的UIFrom找不到");
            return;
        }
        let uiGroup = uiForm.uiGroup;
        if(!uiGroup){
            console.error("要关闭的UIFrom的UIGroup找不到");
            return;
        }
        uiGroup.removeUIForm(uiForm);
        uiForm.onClose(userData);
        uiGroup.refresh();

        let closeUIFormCompleteEventArgs = this._closeUIFormCompleteEventArgsReferencePool.acquire(CloseUIFormCompleteEventArgs).initialize(uiForm.serialId,uiForm.uiFormAssetname,uiGroup,userData);
        this._eventComponent.emit(this,closeUIFormCompleteEventArgs);
        // this._closeUIFormCompleteEventArgsReferencePool.release(closeUIFormCompleteEventArgs);
        this._recycleQueue.push(uiForm);
    }

    public closeAllLoadedUIForm(userData?:object){
        let uiForms = this.getAllLoadedUIForms();
        for (let i = 0; i < uiForms.length; i++) {
            const uiForm = uiForms[i];
            if(!this.hasUIForm){
                continue;
            }
            this.closeUIForm(uiForm,userData);
        }
    }

    public closeAllLoadingUIForms(){
        for (const [key, value] of this._uiFormBeingLoaded) {
            this._uiFormsToReleaseonLoad.add(key);
        }
        this._uiFormBeingLoaded.clear();
    }

    public refocusUIForm(uiForm:UIForm,userData?:object){
        if(!uiForm){
            console.error("refocusUIForm 找不到UIForm");
            return;
        }
        if(!uiForm.uiGroup){
            console.error("refocusUIForm 找不到uiGroup");
            return;
        }
        uiForm.uiGroup.refocusUIForm(uiForm);
        uiForm.uiGroup.refresh();
        uiForm.onRefocus(userData);
    }

    private loadAssetCompleteCallback(err: Error | null, uiFormAsset: Prefab, userData: object | null) {
        let loadUIFormInfo = userData as LoadUIFormInfo;
        if(!loadUIFormInfo){
            console.error("显示UIForm信息为null");
            return;
        }
        if(err){
            console.log(`UIForm资源加载失败,${err.message}`);
            if(this._uiFormsToReleaseonLoad.has(loadUIFormInfo.serialId)){
                this._uiFormsToReleaseonLoad.delete(loadUIFormInfo.serialId);
                return;
            }
            this._uiFormBeingLoaded.delete(loadUIFormInfo.serialId);
            return;
        }

        if(this._uiFormsToReleaseonLoad.has(loadUIFormInfo.serialId)){
            this._uiFormsToReleaseonLoad.delete(loadUIFormInfo.serialId);
            this._loadUIFormReferencePool.release(loadUIFormInfo);
            this._uiFormHelper.releaseUIForm(uiFormAsset,null);
            return;
        }

        this._uiFormBeingLoaded.delete(loadUIFormInfo.serialId);
        let uiFormAssetName = loadUIFormInfo.uiFormAssetName;
        let uiFormInstanceObject = this._uiFormInstanceReferencePool.acquire(UIFormInstanceObject).initialize(uiFormAssetName,uiFormAsset,this._uiFormHelper.instantiateUIForm(uiFormAsset),this._uiFormHelper);
        this._instancePool.register(uiFormInstanceObject,true);
        this.internalOpenUIForm(loadUIFormInfo.serialId,uiFormAssetName,loadUIFormInfo.uiGroup,uiFormInstanceObject.target,loadUIFormInfo.pauseCoveredUIForm,true,0,loadUIFormInfo.userData);
        this._loadUIFormReferencePool.release(loadUIFormInfo);
    }

    private loadAssetProgressCallback(finish: number, total: number, item: AssetManager.RequestItem) {

    }

    private internalOpenUIForm(serialId:number,uiFormAssetName:string,uiGroup:UIGroup,uiFormInstance:object,pauseCoveredUIForm:boolean,isNewInstance:boolean,duration:number,userData:object){
        let uiFrom = this._uiFormHelper.createUIForm(uiFormInstance,uiGroup,userData);
        if(!uiFrom){
            console.error("创建UIForm失败");
            return;
        }
        uiFrom.onInit(serialId,uiFormAssetName,uiGroup,pauseCoveredUIForm,isNewInstance,userData);
        uiGroup.addUIForm(uiFrom);
        uiFrom.onOpen(userData);
        uiGroup.refresh();

        let openIOFormSuccessEventArgs= this._openUIFormSuccessEventArgsReferencePool.acquire(OpenUIFormSuccessEventArgs).initialize(uiFrom,duration,userData);
        this._eventComponent.emit(this, openIOFormSuccessEventArgs);
        // this._openUIFormSuccessEventArgsReferencePool.release(openIOFormSuccessEventArgs);

    }
}