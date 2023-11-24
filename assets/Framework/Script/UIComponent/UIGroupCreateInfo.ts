import { CCInteger, _decorator} from 'cc';
const { ccclass, property } = _decorator;
@ccclass("UIGroupCreateInfo")
export class UIGroupCreateInfo{
    @property({ displayName :"UI组名字"})
    groupName:string="Default";
    @property({ displayName: "层级",type:CCInteger })
    depth: number = 60;
}