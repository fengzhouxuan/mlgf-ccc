import { Node, Prefab, instantiate } from "cc";
import { EntityGroup } from "./EntityGroup";
import { Entity } from "./Entity";

export class EntityHelper{
    public instantiateEntity(entityAsset: object): object{
        let prefab = entityAsset as Prefab;
        prefab.addRef();
        let ins = instantiate(prefab);
        return ins;
    }

    public createEntity(entityInstance:object,entityGroup:EntityGroup,userData:object):Entity{
        if (entityInstance==null){
            console.error(`实体节点为空`);
            return null;
        }
        let entityNode = entityInstance as Node;
        entityNode.setParent(entityGroup.helper.node);
        return entityNode.getOrAddComponent(Entity);
    }

    public releaseEntity(entityAsset:object,entityNode:object){
        let prefab = entityAsset as Prefab;
        prefab.decRef();
        let node = entityNode as Node;
        node?.destroy();
    }
}