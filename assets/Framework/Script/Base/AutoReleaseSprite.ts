import { _decorator, AssetManager, assetManager, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AutoReleaseSprite')
export class AutoReleaseSprite extends Sprite {
    private _loadedSpfs:SpriteFrame[]=[];
    private _curLoadingSpdName="";
    load(bundleName:string,assetName:string){
        let self =this;
        let loadingAssetSerialName = `${bundleName}+${assetName}`;
        this._curLoadingSpdName = loadingAssetSerialName;
        assetManager.loadBundle(bundleName,(err:Error,Bundle:AssetManager.Bundle)=>{
            if(err){
                return;
            }
            Bundle.load(assetName,(err:Error,spf:SpriteFrame)=>{
                if(err){
                    return;
                }
                let loadingAssetSerialName = `${bundleName}+${assetName}`;
                if(!this || !this.isValid || self._curLoadingSpdName!=loadingAssetSerialName){
                    spf.addRef();
                    spf.decRef();
                }else{
                    self._loadedSpfs.push(spf);
                    spf.addRef();
                    self.spriteFrame = spf;
                }
                // console.log(`引用计数：${spf.refCount}`);
                // console.log(bundleName+"-"+assetName);
            });
        });
    }

    release(){
        for (let i = 0; i < this._loadedSpfs.length; i++) {
            let spf = this._loadedSpfs[i];
            if(!spf){
                continue;
            }
            spf.decRef();
            spf=null;
        }
        this._loadedSpfs.length=0;
    }

    onDestroy(): void {
     super.onDestroy();
        this.release();
    }
}

