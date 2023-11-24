
import { Constructor } from "../../../Framework/Script/Base/MlEntry";
import { EntityData } from "../../../Framework/Script/EntityComponent/EntityData";
import { EntityLogic } from "../../../Framework/Script/EntityComponent/EntityLogic";
import { GameEntry } from "../Base/GameEntry";
import { UIEntity } from "../../CustomComponent/UIEntity/UIEntity";
import { UIEntityData } from "../../CustomComponent/UIEntity/UIEntityData";
import { SpaceShipEntityData } from "./EntityData/SpaceShipEntityData";
import { SpaceShipEntity } from "./EntityLogic/SpaceShipEntity";
import { BulletEntityData } from "./EntityData/BulletEntityData";
import { BulletEntity } from "./EntityLogic/BulletEntity";

export interface EntityType {
    bundleName: string,
    assetName: string
}



export var EntityConfigData: { [key: number]: EntityType } = {
    [1000]: { bundleName: "Share", assetName: "Entity/SpaceShip" },
    [2000]: { bundleName: "Share", assetName: "Entity/Bullet" },
}

globalThis.EntityConfigData=EntityConfigData;

export class EntityManager {

    private static _localSerEntityId: number = 0;

    public static ShowSpaceShip(data:SpaceShipEntityData):number{
        let config = EntityConfigData[1000];
        return this.ShowEntityWithConfig(SpaceShipEntity,config,"Default",data);
    }

    public static ShowBullet(data:BulletEntityData):number{
        let config = EntityConfigData[2000];
        return this.ShowEntityWithConfig(BulletEntity,config,"Default",data);
    }

    // public static ShowBlockEnvEntity(name:string,userData:MapItemEntityData):number{
    //     let assetName = `Entity/Env/${name}`;
    //     return this.ShowEntity(BlockDecorateEntity,"Share",assetName,"Decor",userData);
    // }

    // public static ShowBlockDecorateEntity(name:string,userData:MapItemEntityData):number{
    //     let assetName = `Entity/Decor/${name}`;
    //     return this.ShowEntity(BlockDecorateEntity,"Share",assetName,"Decor",userData);
    // }
    // //#region UIEntity
    // public static ShowNumberHud(data:NumberUIEntityData):number{
    //     let entityConfig = EntityConfigData[1];
    //     data.uiGroupName = "Hud";
    //     return this.ShowUIEntity(UINumberHud,entityConfig,data);
    // }
    

    //#endregion UIEntity

    public static ShowUIEntity(entityLogic: Constructor<UIEntity>, config: EntityType, userData: UIEntityData): number {
        return EntityManager.ShowEntityWithConfig(entityLogic, config, "UIEntity", userData);
    }

    public static ShowEntityWithConfig(entityLogic: Constructor<EntityLogic>, config: EntityType, entityGroup: string, userData: EntityData): number {
        return this.ShowEntity(entityLogic, config.bundleName, config.assetName, entityGroup, userData);
    }


    public static ShowEntity(entityLogic: Constructor<EntityLogic>, bundleName: string, assetName: string, entityGroup: string, userData: EntityData): number {
        let entityId = --this._localSerEntityId;
        userData.entityId = entityId;
        GameEntry.entity.showEntity(entityId, entityLogic, bundleName, assetName, entityGroup, userData);
        return entityId;
    }
}