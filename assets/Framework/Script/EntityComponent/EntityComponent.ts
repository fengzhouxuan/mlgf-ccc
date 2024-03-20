import { _decorator, AssetManager, Constructor, Node, Prefab, Vec3 } from 'cc';
import { EntityGroupCreateInfo } from './EntityGroupCreateInfo';
import { Entity } from './Entity';
import { EntityInfo, EntityStatus } from './EntityInfo';
import { EntityGroup } from './EntityGroup';
import { ResourceComponent } from '../ResourceComponent/ResourceComponent';
import { EntityHelper } from './EntityHelper';
import { EntityGroupHelper } from './EntityGroupHelper';
import MlComponent from '../Base/MlComponent';
import { ObjectPoolComponent } from '../ObjectPool/ObjectPoolComponent';
import MlEntry from '../Base/MlEntry';
import { StringUtils } from '../Utils/StringUtils';
import { ShowEntityInfo } from './ShowEntityInfo';
import { LoadEntityInfo } from './LoadEntityInfo';
import { EntityInstanceObject } from './EntityInstanceObject';
import { EventComponent } from '../EventComponent/EventComponent';
import { ShowEntitySuccessEventArgs } from './ShowEntitySuccessEventArgs';
import { EntityLogic } from './EntityLogic';
import { HideEntityCompleteEventArgs } from './HideEntityCompleteEventArgs';
import { AttachEntityInfo } from './AttachEntityInfo';
import { ReferenceCollection } from '../ReferencePool/ReferenceCollection';
import { ReferencePool } from '../ReferencePool/ReferencePool';
const { ccclass, property } = _decorator;

@ccclass('EntityComponent')
export class EntityComponent extends MlComponent {
    @property({ type: Node })
    entityInstanceRoot: Node;
    @property({displayName:"实体组",type:[EntityGroupCreateInfo]})
    entityGroupConfigs: EntityGroupCreateInfo[]=[];
    
    private _entityInfos: Map<number, EntityInfo> = new Map<number, EntityInfo>;
    private _entityGroups: Map<string, EntityGroup> = new Map<string, EntityGroup>;
    private _entitiesBeingLoaded: Map<number, number> = new Map<number, number>;
    private _entitiesToReleaseOnLoad: Set<number> = new Set<number>;
    private _recycleQueue: EntityInfo[] = [];
    private _resourceComponent: ResourceComponent = null;
    private _objectPoolComponent: ObjectPoolComponent = null;
    private _eventComponent: EventComponent = null;
    private _entityHelper: EntityHelper = null;

    private _entityInfoReferencePool:ReferenceCollection=null;
    private _showEntitySuccessEventArgsReferencePool: ReferenceCollection=null;
    private _hideEntityCompleteEventArgsReferencePool: ReferenceCollection = null;
    private _loadEntityInfoReferencePool: ReferenceCollection = null;
    private _showEntityInfoReferencePool: ReferenceCollection = null;
    private _attachEntityInfoReferencePool: ReferenceCollection = null;
    private _entityInstanceObjectReferencePool: ReferenceCollection = null;

    private _serId: number = 0;


    public get entityCount(): number {
        return this._entityInfos.size;
    }

    public get entityGroupCount(): number {
        return this._entityGroups.size;
    }

    protected start(): void {
        this._objectPoolComponent = MlEntry.getComponent(ObjectPoolComponent);
        this._resourceComponent = MlEntry.getComponent(ResourceComponent);
        this._eventComponent = MlEntry.getComponent(EventComponent);
        this._entityHelper = new EntityHelper();

        this._entityInfoReferencePool = ReferencePool.create(EntityInfo.CustomUniName);
        this._showEntitySuccessEventArgsReferencePool = ReferencePool.create(ShowEntitySuccessEventArgs.EventId);
        this._hideEntityCompleteEventArgsReferencePool = ReferencePool.create(HideEntityCompleteEventArgs.EventId);
        this._loadEntityInfoReferencePool = ReferencePool.create(LoadEntityInfo.CustomUnitName);
        this._showEntityInfoReferencePool = ReferencePool.create(ShowEntityInfo.CustomUnitName);
        this._attachEntityInfoReferencePool = ReferencePool.create(AttachEntityInfo.CustomUnitName);
        this._entityInstanceObjectReferencePool = ReferencePool.create(EntityInstanceObject.CustomUnitName);

        if(this.entityInstanceRoot==null){
            this.entityInstanceRoot = new Node("EntityInstanceRoot");
            this.entityInstanceRoot.setParent(this.node);
            this.entityInstanceRoot.setScale(Vec3.ONE);
        }

        for (let i = 0; i < this.entityGroupConfigs.length; i++) {
            const entityGroupConfig = this.entityGroupConfigs[i];
            this.addEntityGroup(entityGroupConfig.groupName,entityGroupConfig.instanceAutoReleaseInterval,entityGroupConfig.instanceExpireTIme,entityGroupConfig.instanceCapacity);
        }
    }

    onUpdate(dt: number): void {
        while (this._recycleQueue.length > 0) {
            let entityInfo = this._recycleQueue.shift();
            let entity = entityInfo.entity;
            let entityGroup = entity.entityGroup;
            if (entityGroup == null) {
                console.error("实体组不存在");
                return;
            }
            entityInfo.entityStatus = EntityStatus.WillRecycle;
            entity.onRecycle();
            entityInfo.entityStatus = EntityStatus.Recycled;
            entityGroup.unSpawnEntity(entity);

            this._entityInfoReferencePool.release(entityInfo);
        }
        for (const [key, value] of this._entityGroups) {
            value.update(dt);
        }
    }

    public hasEntityGroup(name: string): boolean {
        if (StringUtils.IsNullOrEmpty(name)) {
            return false;
        }
        return this._entityGroups.has(name);
    }

    public getEntityGroup(name: string): EntityGroup {
        if (this.hasEntityGroup(name)) {
            return this._entityGroups.get(name);
        }
        return null;
    }

    public getAllEntityGroups(): EntityGroup[] {
        let results: EntityGroup[] = [];
        for (const [key, value] of this._entityGroups) {
            results.push(value);
        }
        return results;
    }

    public addEntityGroup(name: string, instanceAutoReleaseInterval: number, instanceExpireTime: number, instanceCapacity: number): boolean {
        if (StringUtils.IsNullOrEmpty(name)) {
            console.error("实体组名不能为空");
            return false;
        }
        if (this.hasEntityGroup(name)) {
            return false;
        }

        let entityGroupHelper = new Node(`EntityGroup-${name}`).getOrAddComponent(EntityGroupHelper);
        if (entityGroupHelper == null) {
            console.error("entityGroupHelper不能为空");
            return false;
        }
        entityGroupHelper.node.setParent(this.entityInstanceRoot);
        entityGroupHelper.node.setScale(Vec3.ONE);
        this._entityGroups.set(name, new EntityGroup(name, instanceAutoReleaseInterval, instanceExpireTime, instanceCapacity, entityGroupHelper, this._objectPoolComponent));
        return true;
    }

    public hasEntity(entityId: number): boolean {
        return this._entityInfos.has(entityId);
    }

    public getEntity(entityId: number): Entity {
        if (this.hasEntity(entityId)) {
            return this._entityInfos.get(entityId).entity;
        }
        return null;
    }

    public getAllLoadedEntities(): Entity[] {
        let results: Entity[] = [];
        for (const [key, value] of this._entityInfos) {
            results.push(value.entity);
        }
        return results;
    }
    public getAllLoadingEntityIds(): number[] {
        let results: number[] = [];
        for (const [key, value] of this._entitiesBeingLoaded) {
            results.push(key);
        }
        return results;
    }

    public IsEntityInLoading(entityId: number): boolean {
        return this._entitiesBeingLoaded.has(entityId);
    }

    public IsEntityValid(entity: Entity): boolean {
        if (entity == null) {
            return false;
        }
        return this.hasEntity(entity.entityId);
    }

    public showEntity(entityId: number, entityLogicType: Constructor<EntityLogic>, bundleName: string, assetName: string, entityGroupName: string, userData: object) {
        if (entityLogicType == null) {
            console.error("entityLogicType 不能为空")
            return;
        }
        if (this._resourceComponent == null) {
            console.error("资源组件为null，组件还未注册");
            return;
        }
        if (this._entityHelper == null) {
            console.error("实体帮助类null，组件还未注册");
            return;
        }
        if (StringUtils.IsNullOrEmpty(assetName)) {
            console.error("实体资源名不能为空");
            return;
        }
        if (StringUtils.IsNullOrEmpty(entityGroupName)) {
            console.error("实体组名不能为空");
            return;
        }
        if (this.hasEntity(entityId)) {
            console.error(`id为${entityId}的实体已存在`);
            return;
        }
        if (this.IsEntityInLoading(entityId)) {
            console.error(`id为${entityId}的实体正在加载中`);
            return;
        }
        let entityGroup = this.getEntityGroup(entityGroupName);
        if (entityGroup == null) {
            console.error(`名为${entityGroupName}的实体组不存在`);
            return;
        }
        let showEntityInfo = ShowEntityInfo.create(entityLogicType, userData);
        let entityInstanceObject = entityGroup.spawnEntityInstanceObject(assetName);
        if (entityInstanceObject == null) {
            let serialId = ++this._serId;
            this._entitiesBeingLoaded.set(entityId, serialId);
            let loadEntityInfo = this._loadEntityInfoReferencePool.acquire(LoadEntityInfo).initialize(serialId, entityId, assetName, entityGroup, showEntityInfo);
            this._resourceComponent.LoadResInBundle(bundleName, assetName, Prefab, null, this.loadAssetProgressCallback.bind(this), this.loadAssetCompleteCallback.bind(this), loadEntityInfo);
        } else {
            this.internalShowEntity(entityId, assetName, entityGroup, entityInstanceObject.target, false, 0, showEntityInfo);
        }
    }

    public hideEntity(entityId: number, userData?: object) {
        if (this.IsEntityInLoading(entityId)) {
            this._entitiesToReleaseOnLoad.add(this._entitiesBeingLoaded.get(entityId));
            this._entitiesBeingLoaded.delete(entityId);
            return;
        }

        let entityInfo = this.getEntityInfo(entityId);
        if (entityInfo == null) {
            console.error(`找不到实体 ${entityId}`);
            return;
        }
        this.internalHideEntity(entityInfo, userData);
    }

    public hideAllLoadedEntities(userData?:object){
        while (this._entityInfos.size>0) {
            const [key, value] = this._entityInfos.entries().next().value;
            this.internalHideEntity(value,userData);
        }
    }

    public hideAllLoadingEntities(){
        for (const [key, value] of this._entitiesBeingLoaded) {
            this._entitiesToReleaseOnLoad.add(value);
        }
        this._entitiesBeingLoaded.clear();
    }

    public getParentEntity(childEntityId:number):Entity{
        let childEntityInfo = this.getEntityInfo(childEntityId);
        if(childEntityInfo==null){
            console.error(`找不到子实体${childEntityId}`);
            return null;
        }
        return childEntityInfo.parentEntity;
    }

    public getChildEntityCount(parentEntityId:number):number{
        let parentEntityInfo = this.getEntityInfo(parentEntityId);
        if (parentEntityInfo == null) {
            console.error(`找不到父实体${parentEntityId}`);
            return 0;
        }
        return parentEntityInfo.childCount;
    }

    public getChildEntity(parentEntityId:number):Entity{
        let parentEntityInfo = this.getEntityInfo(parentEntityId);
        if (parentEntityInfo == null) {
            console.error(`找不到父实体${parentEntityId}`);
            return null;
        }
        return parentEntityInfo.getChildEntity();
    }

    public getChildEntities(parentEntityId: number):Entity[]{
        let parentEntityInfo = this.getEntityInfo(parentEntityId);
        if (parentEntityInfo == null) {
            console.error(`找不到父实体${parentEntityId}`);
            return null;
        }
        let childEntities = [];
        parentEntityInfo.getChildEntities(childEntities);
        return childEntities;
    }

    public getChildEntitiesNoAlloc(parentEntityId: number,results:Entity[]){
        results.length=0;
        let parentEntityInfo = this.getEntityInfo(parentEntityId);
        if (parentEntityInfo == null) {
            console.error(`找不到父实体${parentEntityId}`);
            return null;
        }
        parentEntityInfo.getChildEntities(results);
    }

    public attachChildEntity(childEntityId:number,parentEntityId:number,parentNode:Node,userData:object){
        let childEntityInfo = this.getEntityInfo(childEntityId);
        if (childEntityInfo == null) {
            console.error(`找不到子实体${childEntityId}`);
            return ;
        }
        let parentEntityInfo = this.getEntityInfo(parentEntityId);
        if (parentEntityInfo == null) {
            console.error(`找不到父实体${parentEntityId}`);
            return null;
        }
        let childEntity = childEntityInfo.entity;
        let parentEntity = parentEntityInfo.entity;
        //先从就父实体解除
        this.detachChildEntity(childEntityId, userData);
        childEntityInfo.parentEntity = parentEntity;
        parentEntityInfo.addChildEntity(childEntity);
        if (parentNode==null){
            parentNode = parentEntity.node;
        }
        let attachEntityInfo = this._attachEntityInfoReferencePool.acquire(AttachEntityInfo).initialize(parentNode,userData);
        parentEntity.onChildAttached(childEntity, attachEntityInfo);
        childEntity.onAttachToParent(parentEntity, attachEntityInfo);
        this._attachEntityInfoReferencePool.release(attachEntityInfo);
    }

    public detachChildEntity(childEntityId:number,userData:object){
        let childEntityInfo = this.getEntityInfo(childEntityId);
        if(childEntityInfo==null){
            console.error(`找不到子实体${childEntityId}`);
            return;
        }
        let parentEntity = childEntityInfo.parentEntity;
        if(parentEntity == null){
            return;
        }
        let parentEntityInfo = this.getEntityInfo(parentEntity.entityId);
        if(parentEntityInfo==null){
            console.error(`找不到父实体${parentEntity.entityId}`);
            return;
        }
        let childEntity = childEntityInfo.entity;
        childEntityInfo.parentEntity=null;
        parentEntityInfo.removeChildEntity(childEntity);
        parentEntity.onChildDetached(childEntity,userData);
        childEntity.onDetachFromParent(parentEntity,userData);
    }

    public detachAllChildEntities(parentEntityId:number,userData:object){
        let parentEntityInfo = this.getEntityInfo(parentEntityId);
        if (parentEntityInfo == null) {
            console.error(`找不到父实体${parentEntityId}`);
            return null;
        }
        while (parentEntityInfo.childCount>0) {
            let childEntity = parentEntityInfo.getChildEntity();
            this.detachChildEntity(childEntity.entityId,userData);
        }
    }

    private getEntityInfo(entityId: number): EntityInfo {
        let entityInfo = this._entityInfos.get(entityId);
        if (entityInfo) {
            return entityInfo;
        }
        return null;
    }

    public preloadEntity(entityAssetName:string,entityAsset:Prefab,entityGroupName:string){
        let entityInstanceObject = this._entityInstanceObjectReferencePool.acquire(EntityInstanceObject).initialize(entityAssetName, entityAsset, this._entityHelper.instantiateEntity(entityAsset), this._entityHelper);
        let group =  this.getEntityGroup(entityGroupName);
        group.registerEntityInstanceObject(entityInstanceObject, false);
    }
    private loadAssetCompleteCallback(err: Error | null, entityAsset: Prefab, userData: object | null) {
        let loadEntityInfo = userData as LoadEntityInfo;
        if (loadEntityInfo == null) {
            console.error("显示实体信息为null");
            return;
        }
        if (err) {
            console.log(`实体资源加载失败,${err.message}`);
            if (this._entitiesToReleaseOnLoad.has(loadEntityInfo.serialId)) {
                this._entitiesToReleaseOnLoad.delete(loadEntityInfo.serialId);
                return;
            }
            this._entitiesBeingLoaded.delete(loadEntityInfo.entityId);
            // console.warn(`实体加载失败 ${err.message}`);
            return;
        }

        //如果在加载完成之前已经被hide，那么直接release,停止创建实体
        if (this._entitiesToReleaseOnLoad.has(loadEntityInfo.serialId)) {
            this._entitiesToReleaseOnLoad.delete(loadEntityInfo.serialId);

            this._loadEntityInfoReferencePool.release(loadEntityInfo);
            // this._entityHelper.releaseEntity(entityAsset, null);
            return;
        }
        this._entitiesBeingLoaded.delete(loadEntityInfo.entityId);
        //实例化实体
        let entityAssetName = loadEntityInfo.entityAssetName;
        let entityInstanceObject = this._entityInstanceObjectReferencePool.acquire(EntityInstanceObject).initialize(entityAssetName, entityAsset, this._entityHelper.instantiateEntity(entityAsset), this._entityHelper);
        loadEntityInfo.entityGroup.registerEntityInstanceObject(entityInstanceObject, true);
        this.internalShowEntity(loadEntityInfo.entityId, entityAssetName, loadEntityInfo.entityGroup, entityInstanceObject.target, true, 0, loadEntityInfo.userData);
        
        this._loadEntityInfoReferencePool.release(loadEntityInfo);
    }
    private loadAssetProgressCallback(finish: number, total: number, item: AssetManager.RequestItem) {

    }

    private internalShowEntity(entityId: number, entityAssetName: string, entityGroup: EntityGroup, entityInstance: object, isNewInstance: boolean, duration: number, userData: object) {
        let entity = this._entityHelper.createEntity(entityInstance, entityGroup, userData);
        if (entity == null) {
            console.error(`entityHelper 无法创建 Entity 对象,entityId=${entityId} entityAssetName=${entityAssetName} entityGroup=${entityGroup.name}`);
            return;
        }
        let entityInfo = this._entityInfoReferencePool.acquire(EntityInfo);
        entityInfo.initialize(entity);

        this._entityInfos.set(entityId, entityInfo);
        entityInfo.entityStatus = EntityStatus.WillInit;
        entity.onInit(entityId, entityAssetName, entityGroup, isNewInstance, userData);
        entityInfo.entityStatus = EntityStatus.Inited;
        entityGroup.addEntity(entity);
        entityInfo.entityStatus = EntityStatus.WillShow;
        entity.onShow(userData);
        entityInfo.entityStatus = EntityStatus.Showed;
        let showEntitySuccessArgs = this._showEntitySuccessEventArgsReferencePool.acquire(ShowEntitySuccessEventArgs).initialize(entity, duration, userData);
        this._eventComponent.emit(this, showEntitySuccessArgs);
        this._showEntityInfoReferencePool.release(userData as ShowEntityInfo);
    }

    private internalHideEntity(entityInfo: EntityInfo, userData: object) {
        //先执行所有子实体的hide
        while (entityInfo.childCount > 0) {
            let childEntity = entityInfo.getChildEntity();
            this.hideEntity(childEntity.entityId, userData);
        }
        if(entityInfo.entityStatus == EntityStatus.Hidden){
            return;
        }
        let entity = entityInfo.entity;
        //从父实体上解除
        this.detachChildEntity(entity.entityId,userData);
        entityInfo.entityStatus = EntityStatus.WillHide;
        entity.onHide(userData);
        entityInfo.entityStatus = EntityStatus.Hidden;

        let entityGroup = entity.entityGroup;
        if(entityGroup==null){
            console.error("找不到实体组");
            return;
        }
        entityGroup.removeEntity(entity);
        if(!this._entityInfos.delete(entity.entityId)){
            console.error(`实体${entity.entityId}不在entityComponent中`);
            return;
        }
        let hideEntityCompleteEventArgs = this._hideEntityCompleteEventArgsReferencePool.acquire(HideEntityCompleteEventArgs).initialize(entity.entityId, entity.entityAssetName,entityGroup,userData);
        this._eventComponent.emit(this,hideEntityCompleteEventArgs);
        this._recycleQueue.push(entityInfo);
    }

}

