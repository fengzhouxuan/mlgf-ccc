import { _decorator } from "cc";
import { HttpOption, IHttpMethod } from "./HttpComponent";
import { HttpHelper } from "./HttpHelper";
const { ccclass, property } = _decorator;

@ccclass("XmlHttpHelper")
export class XmlHttpHelper extends HttpHelper{
    protected onInit(){

    }
    public get(url: string,param:object,option?:Partial<HttpOption>,success?: (data: any) => void,fail?:(data: any) => void){
        if (param) {
            let s = "?";
            for (let key in param) {
                url += `${s}${key}=${param[key]}`;
                s = '&';
            }
        }
        console.log(`http send:${url}`);
        let request = new XMLHttpRequest();
        request.open("GET", url, true);
        if (option.header) {
            for (const key in option.header) {
                request.setRequestHeader(key, option.header[key]);
            }
        }
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    success(request.responseText);
                } else {
                    console.log(`url:(${url}) request error. status:(${request.status})`);
                    fail(null);
                }
            }
        };
        request.send();
    }
    public post(url: string,param:object,option?:Partial<HttpOption>,success?: (data: any) => void,fail?:(data: any) => void){
        let paramStr = JSON.stringify(param);
        let request = new XMLHttpRequest();
        request.open("POST", url);
        if (option.header) {
            for (const key in option.header) {
                request.setRequestHeader(key, option.header[key]);
            }
        }
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    success && success(request.responseText);
                } else {
                    console.log(`${url}请求失败:${request.status}`);
                    fail && fail(null);
                }
            }
        };
        request.send(paramStr);
    }

    private setRequestHeader(request: XMLHttpRequest,header:{key:string,value:string}[]): void {
        for (let i = 0; i < header.length; i++) {
            const h = header[i];
            request.setRequestHeader(h.key, h.value);
        }
        // request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }
}