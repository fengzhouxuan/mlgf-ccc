import { _decorator, Component, Node } from 'cc';
import { EntityLogic } from './EntityLogic';
import { EntityGroup } from './EntityGroup';
import { ShowEntityInfo } from './ShowEntityInfo';
import { ClassUtils } from '../Utils/ClassUtils';
import { AttachEntityInfo } from './AttachEntityInfo';
const { ccclass, property } = _decorator;

@ccclass('Entity')
export class Entity extends Component{
    private _entityId: number;
    private _entityAssetName:string;
    private _entityGroup:EntityGroup;
    private _entityLogic:EntityLogic;

    
    public get entityId() : number {
        return this._entityId;
    }
    
    public get entityAssetName() : string {
        return this._entityAssetName;
    }
    
    public get entityGroup() : EntityGroup {
        return this._entityGroup;
    }
    
    public get entityNode() : Node {
        return this.node;
    }
    
    public get entityLogic() : EntityLogic {
        return this._entityLogic;
    }
    
    public onInit(entityId:number,entityAssetName:string,entityGroup:EntityGroup,isNewInstance:boolean,userData:object){
        this._entityId = entityId;
        this._entityAssetName = entityAssetName;
        if(isNewInstance){
            this._entityGroup = entityGroup;
        }else{
            if(!this.entityGroup){
                this._entityGroup = entityGroup;
            }
        }
        let showEntityInfo:ShowEntityInfo = userData as ShowEntityInfo;
        let entityLogicType = showEntityInfo.entityLogicType;
        if(entityLogicType==null){
            console.error("EntityLogic 不能为null");
            return;
        }
        if (this._entityLogic!=null){
            if(ClassUtils.GetClassName(this._entityLogic)=== showEntityInfo.entityLogicTypeName){
                //同一个实体脚本
                this._entityLogic.enabled = true;
                return;
            }
            //脚本不一样，移除旧脚本
            this._entityLogic.destroy();
            this._entityLogic = null;
        }
        this._entityLogic = this.node.addComponent(entityLogicType) as EntityLogic;
        this._entityLogic.onInit(showEntityInfo.userData);
    }

    public onRecycle(){
        this._entityLogic.onRecycle();
        this._entityLogic.enabled = false;
        this._entityId = 0;
    }

    public onShow(userData:object){
        let showEntityInfo: ShowEntityInfo = userData as ShowEntityInfo;
        this._entityLogic.onShow(showEntityInfo.userData);
    }

    public onHide(userData:object){
        this._entityLogic.onHide(userData);
    }

    public onChildAttached(childEntity:Entity,userData:object){
        let attachEntityInfo = userData as AttachEntityInfo;
        this._entityLogic.onChildAttached(childEntity.entityLogic,attachEntityInfo.parentNode,attachEntityInfo.userData);
    }

    public onChildDetached(childEntity:Entity,userData:object){
        this._entityLogic.onChildDetached(childEntity.entityLogic,userData);
    }

    public onAttachToParent(parentEntity:Entity,userData:object){
        let attachEntityInfo = userData as AttachEntityInfo;
        this._entityLogic.onAttachToParent(parentEntity.entityLogic,attachEntityInfo.parentNode,attachEntityInfo.userData);
        //TODO:引用池回收attachEntityInfo
    }

    public onDetachFromParent(parentEntity:Entity,userData:object){
        this._entityLogic.onDetachFromParent(parentEntity.entityLogic,userData);
    }

    onUpdate(dt:number){
        this._entityLogic.onUpdate(dt);
    }

}

