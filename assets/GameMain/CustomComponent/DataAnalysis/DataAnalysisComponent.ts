import { _decorator, Component, Node } from 'cc';
import MlComponent from '../../../Framework/Script/Base/MlComponent';
import { DataAnalysisHelper } from './DataAnalysisHelper';
import { WECHAT } from 'cc/env';
import { WxDataAnalysisHelper } from './WxDataAnalysisHelper';
const { ccclass, property } = _decorator;

@ccclass('DataAnalysisComponent')
export class DataAnalysisComponent extends MlComponent {
    private _helper:DataAnalysisHelper;
    protected onLoad(): void {
        super.onLoad();
        this.init();
    }

    private init(){
        let self = this;
        //不同的平台请在此处替换对应的Helper
        this._helper=WECHAT ? new WxDataAnalysisHelper() : new DataAnalysisHelper();
        this._helper.onInit();
    }

    public customEvent(name:string,data:object){
        this._helper.customEvent(name,data);
    }
}

