import { Node, Vec3, _decorator} from 'cc';
import { EntityData } from '../../../Framework/Script/EntityComponent/EntityData';
const { ccclass } = _decorator;

@ccclass('UIEntityData')
export class UIEntityData extends EntityData{
    public uiGroupName:string;
    public target3d:Node;
    public targetd3dPosition:Vec3;
    public offset:Vec3=new Vec3();
}

