import { ImageAsset, SpriteFrame, Texture2D, assetManager } from "cc";

export class ImageLoader {
  private static _remoteAssets: Map<string, SpriteFrame> = new Map<string, SpriteFrame>;

  public static loadRemote(url: string, ext: string, complete: (spf: SpriteFrame) => void) {
    let cachedImage = assetManager.assets.get(url);
    // console.log("缓存：",cachedImage);
    if (cachedImage && cachedImage.isValid) {
      //查找sp
      let spf = this._remoteAssets.get(cachedImage.uuid);
      if (!spf && spf.isValid) {
        spf.addRef();
        setTimeout(() => {
          complete && complete(spf);
        }, 1);
        return;
      }
    }
    assetManager.loadRemote(url, { ext: ext }, (err, asset) => {
      if (err) {
        return;
      }
      const img = asset as ImageAsset;
      let spf = new SpriteFrame();
      const texture = new Texture2D();
      texture.image = img;
      spf.texture = texture;
      texture.addRef();
      img.addRef();
      this._remoteAssets.set(img.uuid, spf);
      // let spf = this._remoteAssets.get(img.uuid);
      // if(!spf || !spf.isValid || !spf.texture.isValid){
      // }
      spf.addRef();
      complete && complete(spf);
    });
  }

  public static release(spf: SpriteFrame) {
    for (const [key, value] of this._remoteAssets) {
      if (value != spf) {
        return;
      }
    }
    spf.decRef(false);
    if (spf.refCount <= 0) {
      let texture = spf.texture as Texture2D;
      // 如果已加入动态合图，必须取原始的Texture2D
      if (spf.packable) {
        texture = spf.original?._texture as Texture2D;
      }
      if (texture) {
        texture.decRef();
        texture.image?.decRef();
        // texture.image?.destroy();
        // texture.destroy();
      }
      this._remoteAssets.delete(texture.image.uuid);
      spf.destroy();
    }
  }

  public static isRemoteAsset(spf: SpriteFrame) {
    for (const [key, value] of this._remoteAssets) {
      if (value == spf) {
        return true;
      }
    }
    return false;
  }
}

globalThis["MLImageLoader"] = ImageLoader;
