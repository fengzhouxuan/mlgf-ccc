import { HttpOption } from "./HttpComponent";

export abstract class HttpHelper{
    public init(){
        this.onInit();
    }
    protected abstract onInit();
    public abstract get(url: string,param:object,option?:Partial<HttpOption>,success?: (data: any) => void,fail?:(data: any) => void,header?:{key:string,value:string}[]);
    public abstract post(url: string,param:object,option?:Partial<HttpOption>,success?: (data: any) => void,fail?:(data: any) => void,header?:{key:string,value:string}[]);
}