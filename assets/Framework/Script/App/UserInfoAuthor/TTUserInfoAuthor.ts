import { _decorator } from 'cc';
import { UserInfoAuthor } from './UserInfoAuthor';
import { GetUserInfoOption, UserInfo } from '../AppComponent';
import { TTApiUtils, TTAuthKey } from '../../Env/TTApiUtils';
const { ccclass } = _decorator;

@ccclass('TTUserInfoAuthor')
export class TTUserInfoAuthor extends UserInfoAuthor {
    protected onInit() {

    }
    public authorUserInfo(option: GetUserInfoOption, success: (userInfo: UserInfo) => void, fail: () => void) {
        //依赖登录
        TTApiUtils.login(
            (res) => {
                //成功
                TTApiUtils.getUserInfo(
                    (res) => {
                        let userInfo: UserInfo = {
                            nickName: res.userInfo.nickName,
                            avatarUrl: res.userInfo.avatarUrl
                        };
                        success && success(userInfo);
                    },
                    () => {
                        fail && fail();
                    });
            },
            () => {
                fail && fail();
            });
    }
    public shutdown() {

    }
    public isNeedUserButton(): boolean {
        return false;
    }

}

