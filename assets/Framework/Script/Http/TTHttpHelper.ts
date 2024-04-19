import { _decorator} from 'cc';
import { HttpHelper } from './HttpHelper';
import { TTApiUtils } from '../Env/TTApiUtils';
import { HttpOption } from './HttpComponent';
const { ccclass } = _decorator;

@ccclass('TTHttpHelper')
export class TTHttpHelper extends HttpHelper{
    protected onInit() {

    }
    public get(url: string, param: object,option?:Partial<HttpOption>, success?: (data: any) => void, fail?: (data: any) => void) {
        TTApiUtils.request(url, param, 'GET', success, fail);
    }
    public post(url: string, param: object,option?:Partial<HttpOption>, success?: (data: any) => void, fail?: (data: any) => void, header?: { key: string; value: string; }[]) {
        TTApiUtils.request(url, param, 'POST', success, fail);
    }
    
}

