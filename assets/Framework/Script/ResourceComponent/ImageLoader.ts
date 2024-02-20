import { ImageAsset, SpriteFrame, Texture2D, assetManager } from "cc";

export class ImageLoader{
    private static _remoteAssets:Map<SpriteFrame,string>=new Map<SpriteFrame,string>;
    public static loadRemote(url:string,ext:string,complete:(spf:SpriteFrame)=>void){
        let cachedImage = assetManager.assets.get(url);
        // console.log("缓存：",cachedImage);
        if(cachedImage && cachedImage.isValid){
            //查找sp
            let spf = this.getSpf(url);
            if(spf && spf.isValid){
                spf.addRef();
                setTimeout(() => {
                    complete && complete(spf);
                }, 1);
                return;
            }
        }
        assetManager.loadRemote(url,{ext:ext},(err,asset)=>{
            if(err){
                return;
            }
            const img =asset as ImageAsset;
            let spf = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = img;
            spf.texture = texture;
            texture.addRef();
            img.addRef();
            this._remoteAssets.set(spf,img.uuid);
            spf.addRef();
            complete && complete(spf);
        });
    }

    public static release(spf:SpriteFrame){
       let remote = this.isRemoteAsset(spf);
       if(!remote){
            return;
       }
        spf.decRef();
        if(spf.refCount<=0){
            let texture = spf.texture as Texture2D;
            // 如果已加入动态合图，必须取原始的Texture2D
            if (spf.packable) {
                texture = spf.original?._texture as Texture2D;
            }
            if (texture) {
                texture.decRef();
                if(texture.refCount<=0){
                    texture.image?.decRef();
                }
            }
            this._remoteAssets.delete(spf);
            spf.destroy();
        }
    }

    public static isRemoteAsset(spf:SpriteFrame){
        for (const [key, value] of this._remoteAssets) {
            if(key==spf){
                return true;
            }
        }
        return false;
    }

    private static getSpf(url:string):SpriteFrame{
        for (const [key, value] of this._remoteAssets) {
            if(value==url){
                return key;
            }
        }
    }
}

globalThis["MLImageLoader"] = ImageLoader;