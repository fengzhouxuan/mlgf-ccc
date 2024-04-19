import { _decorator, Component, Node, sys } from 'cc';
import MlComponent from '../Base/MlComponent';
import { HttpHelper } from './HttpHelper';
import { BYTEDANCE, WECHAT } from 'cc/env';
import { WXHttpHelper } from './WXHttpHelper';
import { TTHttpHelper } from './TTHttpHelper';
import { XmlHttpHelper } from './XmlHttpHelper';
const { ccclass, property } = _decorator;

export const enum IHttpMethod {
    GET = "get",
    POST = "post"
}

@ccclass('HttpComponent')
export class HttpComponent extends MlComponent{
    private _helper:HttpHelper;
    protected onLoad(): void {
        super.onLoad();
        if(WECHAT){
            this._helper = new WXHttpHelper();
        }else if(BYTEDANCE){
            this._helper = new TTHttpHelper();
        }else{
            this._helper = new XmlHttpHelper();
        }
        this._helper.init();
    }
    public request(url: string, param: object, method: IHttpMethod,option?:Partial<HttpOption>,success?: (data: any) => void,fail?:(data: any) => void){
        if(method == IHttpMethod.GET){
            this.get(url,param,option,success,fail);
        }else if(method == IHttpMethod.POST){
            this.post(url,param,option,success,fail);
        }
    }

    public get(url: string,param: object,option?:Partial<HttpOption>,success?: (data: any) => void,fail?:(data: any) => void,){
        let assignOption = new HttpOption(option);
        this._helper?.get(url,param,assignOption,success,fail);
    }

    public  post(url: string,param: object,option?:Partial<HttpOption>,success?: (data: any) => void,fail?:(data: any) => void){
        let assignOption = new HttpOption(option);
        this._helper?.post(url,param,assignOption,success,fail);
    }
}

export class HttpOption{
    constructor(option?:Partial<HttpOption>){
        Object.assign(this,option);
    }
    timeout:number=5000;
    header?: Record<string, string>;
}