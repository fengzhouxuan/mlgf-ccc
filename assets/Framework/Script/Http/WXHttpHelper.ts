import { _decorator} from 'cc';
import { HttpHelper } from './HttpHelper';
import { WXApiUtils } from '../Env/WXApiUtils';
import { HttpOption } from './HttpComponent';
const { ccclass } = _decorator;

@ccclass('WXHttpHelper')
export class WXHttpHelper extends HttpHelper{
    protected onInit() {

    }
    public get(url: string, param: object,option?:Partial<HttpOption>, success?: (data: any) => void,fail?:(data: any) => void) {
        WXApiUtils.request(url, 'GET', param, success, fail);
    }
    public post(url: string, param: object,option?:Partial<HttpOption>, success?: (data: any) => void,fail?:(data: any) => void) {
        WXApiUtils.request(url, 'POST', param, success, fail);
    }
    
}

