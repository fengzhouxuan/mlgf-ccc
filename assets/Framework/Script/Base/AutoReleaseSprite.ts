import { _decorator, AssetManager, assetManager, ImageAsset, Sprite, SpriteFrame, Texture2D, UITransform } from 'cc';
import { ImageLoader } from '../ResourceComponent/ImageLoader';
import { StringUtils } from '../Utils/StringUtils';
const { ccclass, property } = _decorator;

@ccclass('AutoReleaseSprite')
export class AutoReleaseSprite extends Sprite {
    private _curLoadingUrl = "";

    private _lastSpf: SpriteFrame;
    private _originalSpf:SpriteFrame;
    private _curLoadedSpf:SpriteFrame;
    onLoad(): void {
        super.onLoad();
        this._originalSpf = this.spriteFrame;
    }

    load(bundleName: string, assetName: string) {
        let self = this;
        let loadingAssetSerialName = `${bundleName}+${assetName}`;
        this._curLoadingUrl = loadingAssetSerialName;
        assetManager.loadBundle(bundleName, (err: Error, Bundle: AssetManager.Bundle) => {
            if (err) {
                return;
            }
            Bundle.load(assetName, (err: Error, spf: SpriteFrame) => {
                if (err) {
                    return;
                }
                let loadingAssetSerialName = `${bundleName}+${assetName}`;
                if (!this || !this.isValid || self._curLoadingUrl != loadingAssetSerialName) {
                    spf.addRef();
                    spf.decRef();
                    return;
                }
                if (this._lastSpf) {
                    if (ImageLoader.isRemoteAsset(this._lastSpf)) {
                        ImageLoader.release(this._lastSpf);
                    } else {
                        this._lastSpf.decRef();
                    }
                }
                spf.addRef();
                self.spriteFrame = spf;
                self._curLoadedSpf = spf;
                this._lastSpf = spf;

            });
        });
    }
    private _ttImage = null;
    loadRemote(url: string) {
        if(StringUtils.IsNullOrEmpty(url)){
            return;
        }
        let self = this;
        this._curLoadingUrl = url;
        if (window["tt"]) {
            let tt = window["tt"];
            if (!this._ttImage) {
                this._ttImage = tt.createImage();
                this._ttImage.width = this.getComponent(UITransform).contentSize.width;
                this._ttImage.height = this.getComponent(UITransform).contentSize.height;
                this._ttImage.addEventListener("load", (res) => {
                    if (!self || !self.isValid || self._curLoadingUrl != url) {
                        return;
                    }
                    let imageAsset = new ImageAsset(this._ttImage);
                    let tex = new Texture2D();
                    let spf = new SpriteFrame();
                    tex.image = imageAsset;
                    spf.texture = tex;
                    self.spriteFrame = spf;
                });
                this._ttImage.addEventListener("error", (err) => {
                    console.log("ttImageErr:", err);
                });
            }
            this._ttImage.src = url;
            return;
        }
        ImageLoader.loadRemote(url, ".png", (spriteFrame: SpriteFrame) => {
            if (!this || !this.isValid || self._curLoadingUrl != url) {
                ImageLoader.release(spriteFrame);
                return;
            }
            if (this._lastSpf) {
                if (ImageLoader.isRemoteAsset(this._lastSpf)) {
                    ImageLoader.release(this._lastSpf);
                } else {
                    this._lastSpf.decRef();
                }
            }
            self.spriteFrame = spriteFrame;
            self._curLoadedSpf = spriteFrame;
            this._lastSpf = spriteFrame;
        });
    }

    release() {
        if(!this._curLoadedSpf){
            return;
        }
        // let spf =this.spriteFrame;
        if(ImageLoader.isRemoteAsset(this._curLoadedSpf)){
            ImageLoader.release(this._curLoadedSpf);
        }else{
            this._curLoadedSpf.decRef();
        }
        // this.spriteFrame = this._originalSpf;
        this._lastSpf=null;
    }

    onDestroy(): void {
        // this.spriteFrame  = this._originalSpf;
        super.onDestroy();
        this.release();
    }
}

