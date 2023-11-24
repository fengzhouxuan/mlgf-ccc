import { _decorator, Component, Node, Vec3 } from 'cc';
import { EntityLogic } from '../../../Framework/Script/EntityComponent/EntityLogic';
import { UIEntityData} from './UIEntityData';
import { UIGroup } from '../../../Framework/Script/UIComponent/UIGroup';
import { GameEntry } from '../../Script/Base/GameEntry';
const { ccclass, property } = _decorator;

@ccclass('UIEntity')
export class UIEntity extends EntityLogic {
    protected _entityData:UIEntityData;
    private _uiGroupNode:Node=null;
    onShow(userData: object): void {
        super.onShow(userData);
        this._entityData = userData as UIEntityData;
        if (this._entityData == null) {
            return;
        }
        this.nodeName = `[UIEntity_${this._entityData.entityId}]`;
        this._uiGroupNode = GameEntry.ui.getUIGroup(this._entityData.uiGroupName).uiGroupHelper.node;
        this.node.setParent(this._uiGroupNode);
    }
}

