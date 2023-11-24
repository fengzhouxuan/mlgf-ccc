import { _decorator} from 'cc';
const { ccclass, property } = _decorator;
@ccclass("EntityGroupCreateInfo")
export class EntityGroupCreateInfo {
    @property({ displayName :"实体组名字"})
    groupName:string="Default";
    @property({ displayName: "实体组容量" })
    instanceCapacity: number = 60;
    @property({ displayName: "对象池自动释放间隔" })
    instanceAutoReleaseInterval: number= 60;
    @property({ displayName: "实体失效时间" })
    instanceExpireTIme: number = 60;
}