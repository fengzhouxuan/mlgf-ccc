import { AssetManager, EventTarget, Scene, SceneAsset, assetManager, director } from "cc";
import { GameEntry } from "../../GameMain/Script/Base/GameEntry";
import { DRLevel } from "../../GameMain/Script/DataTable/DRLevel";

export class SceneManager{
    private static _inited:boolean;
    private static _event:EventTarget;

    public static ProgressEvent: string = "loadSceneProgressEvent";
    public static CompleteEvent: string = "loadSceneCompleteEvent";
    private static initEvent(){
        if(this._inited){
            return;
        }
        this._inited = true;
        this._event = new EventTarget();
    }
    private static Emit(eventType: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any){
        this.initEvent();
        this._event.emit(eventType,arg0,arg1,arg2,arg3,arg4);
    }
    public static AddLoadSceneProgressEvent(callback: (cur: number, all: number) => void, thisArg?:any){
        this.initEvent();
        this._event.on(this.ProgressEvent,callback,thisArg);
    }
    public static AddLoadSceneCompleteEvent(callback: () => void, thisArg?: any, once?: boolean) {
        this.initEvent();
        this._event.on(this.CompleteEvent, callback, thisArg, once);
    }

    public static RemoveAllOnThis(thisArg:any){
        this.initEvent();
        this._event.removeAll(this);
    }

    public static OpenScene(sceneId: number){

        let sceneData = GameEntry.dataTable.getDataTable(DRLevel).getRow(e=>e.id==sceneId);
        GameEntry.res.LoadSceneInBundle(sceneData.bundle,sceneData.levelConfig, null, (f:number,t:number,item:AssetManager.RequestItem)=>{
            this.Emit(this.ProgressEvent,f,t);
        },
        (err: Error, res: SceneAsset) => {
            director.runScene(res, () => {

            }, () => {
                let d = Date.now();
                this.Emit(this.CompleteEvent);
            });
        }, null);
    }
}