import { Node, Quat, Tween, Vec3, tween } from "cc";
import { EntityData } from "./EntityData";
import { EntityLogic } from "./EntityLogic";

export abstract class GameEntityLogic extends EntityLogic {
    private _entityData: EntityData;

    
    public get entityId() : number {
        return this.entity.entityId;
    }
    
    onInit(userData: object): void {
        super.onInit(userData);
    }

    onShow(userData: object): void {
        super.onShow(userData);
        this._entityData = userData as EntityData;
        if (this._entityData == null) {
            return;
        }
        this.nodeName = `[Entity_${this._entityData.entityId}]`;
        this.node.setPosition(this._entityData.position);
        this.node.setRotation(this._entityData.rotation);
        this.node.setScale(Vec3.ONE);
    }

    onRecycle(): void {
        super.onRecycle();
    }

    onHide(userData: object): void {
        super.onHide(userData);
        Tween.stopAllByTarget(this.node);
    }

    onChildAttached(childEntity: EntityLogic, attachedNode: Node, userData: object): void {
        super.onChildAttached(childEntity,attachedNode,userData);
    }

    onChildDetached(childEntity: EntityLogic, userData: object): void {
        super.onChildDetached(childEntity,userData);
    }

    onAttachToParent(parentEntity: EntityLogic, parentNode: Node, userData: object): void {
        super.onAttachToParent(parentEntity,parentNode,userData);
    }

    onDetachFromParent(parentEntity: EntityLogic, userData: object): void {
        super.onDetachFromParent(parentEntity,userData);
    }

    onUpdate(dt: number): void {
        super.onUpdate(dt);
    }

    public rotateTo(dir:Vec3){
        let startQut = new Quat();
        let endQut = new Quat();
        let nowQut = new Quat();
        Quat.fromViewUp(endQut,dir);
        this.node.getRotation(startQut);
        tween(this.node)
        .to(0.3,{}
            ,{
                onUpdate:(target, ratio)=> {
                    Quat.slerp(nowQut,startQut,endQut,ratio);
                    this.node.setRotation(nowQut);
                },
            })
        .start();
    }

    public rotateToQut(qut:Quat){
        let startQut = new Quat();
        let endQut = qut;
        let nowQut = new Quat();
        this.node.getRotation(startQut);
        tween(this.node)
        .to(0.1,{}
            ,{
                onUpdate:(target, ratio)=> {
                    Quat.slerp(nowQut,startQut,endQut,ratio);
                    this.node.setRotation(nowQut);
                },
            })
        .start();
    }

}