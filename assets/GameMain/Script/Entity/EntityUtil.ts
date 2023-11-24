import { BulletEntityData } from "./EntityData/BulletEntityData";
import { SpaceShipEntityData } from "./EntityData/SpaceShipEntityData";
import { BulletEntity } from "./EntityLogic/BulletEntity";
import { SpaceShipEntity } from "./EntityLogic/SpaceShipEntity";
import { EntityConfigData, EntityManager } from "../../../FrameworkUtil/Entity/EntityManager";


EntityConfigData[1000]=  { bundleName: "Share", assetName: "Entity/SpaceShip" };
EntityConfigData[2000]=  { bundleName: "Share", assetName: "Entity/Bullet" };

export class EntityUtil{
    static ShowBullet(data:BulletEntityData):number{
        return EntityManager.ShowEntityWithConfig(BulletEntity,EntityConfigData[2000],"Default",data);
    }

    static ShowSpaceShip(data:SpaceShipEntityData):number{
        return EntityManager.ShowEntityWithConfig(SpaceShipEntity,EntityConfigData[1000],"Default",data);
    }
}