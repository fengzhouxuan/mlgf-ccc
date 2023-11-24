import { game } from "cc";
//默认帮助类，编辑器下使用
export class PlatformHelper{
    onInit(){}
    onAudioInterruptionEnd(callback:Function){}
    onShow(callback:Function){}
    onHide(callback:Function){
        
    }
    setFrameRate(rate:number){
        game.frameRate=rate;
    }

    loadPackge(name:string,success:Function,fail?:Function,progress?:Function){
        success();
    }

    httpRequest(url:string,data:object,method:string,success:Function,fail:Function){
        success(null);
    }

    login(url:string,success:Function,fail:Function){
        success(null);
    }

    triggerGC(){}

    shareTmplate(callback:Function){
        callback(0);
    }

    share(title?:string,imageUrlId?:string,imageUrl?:string){}
    vibrateShort(){}
    vibrateShortMedium(){}
}