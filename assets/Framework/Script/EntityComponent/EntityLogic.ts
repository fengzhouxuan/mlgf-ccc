import { Component, Node, Quat, Vec3 } from "cc";
import { Entity } from "./Entity";
import { GameEntry } from "../../../GameMain/Script/Base/GameEntry";

export abstract class EntityLogic extends Component{
    private _available:boolean;
    private _visible:boolean;
    private _orignalLayer:number;
    private _orignalParentNode:Node;
    private _entity:Entity;

    
    public get entityId() : number {
        return this.entity.entityId;
    }
    
    public get entity() : Entity {
        return this._entity;
    }
    
    public get nodeName() : string {
        return this.node.name;
    }
    
    public set nodeName(v : string) {
        this.node.name = v;
    }
    
    public get available() : boolean {
        return this._available;
    }
    
    public get visible() : boolean {
        return this._visible && this._available;
    }
    
    public get orignalParentNode() : Node {
        return this._orignalParentNode;
    }
    

    
    public set visible(v : boolean) {
        if(!this._available){
            return;
        }
        if(this._visible==v){
            return;
        }
        this._visible =v;
        this.internalSetVisible(v);
    }

    onInit(userData:object){
        this._entity = this.getComponent(Entity);
        this._orignalLayer = this.node.layer;
        this._orignalParentNode = this.node.parent;
    }

    onRecycle(){}

    onShow(userData:object){
        this._available = true;
        this.visible = true;
       
    }

    onUpdate(dt:number){

    }

    onHide(userData:object){
        this.node.layer = this._orignalLayer;
        this.visible = false;
        this._available = false;
    }

    /**
     * 被附加子实体
     * @param childEntity 
     * @param attachedNode 
     * @param userData 
     */
    onChildAttached(childEntity:EntityLogic,attachedNode:Node,userData:object){

    }
    /**
     * 子实体被解除
     * @param childEntity 
     * @param userData 
     */
    onChildDetached(childEntity:EntityLogic,userData:object){

    }
    /**
     * 附加到父实体
     * @param parentEntity 
     * @param parentNode 
     * @param userData 
     */
    onAttachToParent(parentEntity:EntityLogic,parentNode:Node,userData:object){
        this.node.setParent(parentNode,true);
        // this.node.setPosition(new Vec3(0,0,0));
        // this.node.setRotation(new Quat());
    }
    /**
     * 从父实体上解除
     * @param parentEntity 
     * @param userData 
     */
    onDetachFromParent(parentEntity: EntityLogic, userData: object){
        this.node.setParent(this._orignalParentNode,true);
    }

    private internalSetVisible(visible:boolean){
        this.node.active = visible;
    }    

    public hideSelf(){
        GameEntry.entity.hideEntity(this.entityId);
    }   
}