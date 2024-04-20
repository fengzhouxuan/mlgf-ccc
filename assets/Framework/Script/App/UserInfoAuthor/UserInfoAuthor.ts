import { _decorator} from 'cc';
import { GetUserInfoOption, UserInfo } from '../AppComponent';
const { ccclass } = _decorator;

@ccclass('UserInfoAuthor')
export abstract class UserInfoAuthor{
    public init(){

    }
    protected abstract onInit();
    public abstract authorUserInfo(option:GetUserInfoOption,success:(userInfo:UserInfo)=>void,fail:()=>void);
    public abstract shutdown();
    public abstract isNeedUserButton():boolean;
}

