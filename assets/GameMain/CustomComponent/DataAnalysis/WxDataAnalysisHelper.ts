import { DataAnalysisHelper } from "./DataAnalysisHelper";
let wx = window["wx"];
export class WxDataAnalysisHelper extends DataAnalysisHelper{
    public onInit(){

    }
    public customEvent(name:string,data:object){
        wx?.reportEvent(name,data);
    }
}