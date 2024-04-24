export interface UserDataServerDelegate{
    getUserId(appid:string,code:string,anonymousCode:string,callback:(userIdInfo:UserIdInfo)=>void):void;
    saveUserData(appid:string,userId:string,settingKey:string,userData: object,callback?:(data:object)=>void): void;
    loadUserData(appid:string,userId:string,settingKey:string,callback:(data:object)=>void);
}

export interface UserIdInfo{
    openId:string;
    anonymousOpenId?:string;
}

export class DefaultUserDataServerDelegate implements UserDataServerDelegate{
    getUserId(appid: string, code: string, anonymousCode: string, callback: (userIdInfo: UserIdInfo) => void): void {
        setTimeout(() => {
            callback && callback({
                openId: "123456789"
            });
        }, 0);
    }
    saveUserData(appid: string, userId: string, settingKey: string, userData: object,callback?:(data:object)=>void): void {
        setTimeout(() => {
            callback && callback({});
        }, 0);
    }
    loadUserData(appid: string, userId: string, settingKey: string, callback: (data: object) => void) {
        setTimeout(() => {
            callback && callback({});
        }, 0);
    }

}