
import { Constructor } from "../../Framework/Script/Base/MlEntry";
import { EntityData } from "../../Framework/Script/EntityComponent/EntityData";
import { EntityLogic } from "../../Framework/Script/EntityComponent/EntityLogic";
import { GameEntry } from "../../GameMain/Script/Base/GameEntry";
import { UIEntity } from "../../GameMain/CustomComponent/UIEntity/UIEntity";
import { UIEntityData } from "../../GameMain/CustomComponent/UIEntity/UIEntityData";

export interface EntityType {
    bundleName: string,
    assetName: string
}


export var EntityConfigData: { [key: number]: EntityType } = {
}

export class EntityManager {

    private static _localSerEntityId: number = 0;

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