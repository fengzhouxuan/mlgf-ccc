import { BulletEntityData } from "./EntityData/BulletEntityData";
import { BulletEntity } from "./EntityLogic/BulletEntity";
import { EntityConfigData, EntityManager } from "./EntityManager";

EntityConfigData[2001]=  { bundleName: "Share", assetName: "Entity/Bullet" };

export class EntityExtension{
    static ShowBullet1(data:BulletEntityData):number{
        return EntityManager.ShowEntityWithConfig(BulletEntity,EntityConfigData[2001],"Default",data);
    }
}