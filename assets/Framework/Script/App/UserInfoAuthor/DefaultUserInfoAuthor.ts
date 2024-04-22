import { _decorator} from 'cc';
import { UserInfoAuthor } from './UserInfoAuthor';
import { GetUserInfoOption, UserInfo } from '../AppComponent';
const { ccclass } = _decorator;

@ccclass('DefaultUserInfoAuthor')
export class DefaultUserInfoAuthor extends UserInfoAuthor{
    protected onInit() {

    }
    public authorUserInfo(option: GetUserInfoOption, success: (userInfo: UserInfo) => void, fail: () => void) {
        setTimeout(() => {
            success && success({
                nickName: '测试昵称',
                avatarUrl: ""
            });
        }, 1);
    }
    public shutdown() {

    }
    public isNeedUserButton(): boolean {
        return false;
    }
    
}

