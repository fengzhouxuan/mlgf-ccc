import { __private, _decorator, Asset, assetManager, AssetManager, Component, Constructor, error, ImageAsset, log, Node, resources, Scene, SceneAsset } from 'cc';
import MlComponent from '../Base/MlComponent';
const { ccclass, property } = _decorator;

type ProgressCallback = (finish: number, total: number, item: AssetManager.RequestItem) => void;
type CompleteCallback<T> = (err: Error | null, data: T | T[], userData: object | null) => void;

interface IRemoteOptions {
    [k: string]: any;
    ext?: string;
}
interface IBundleOptions {
    [k: string]: any;
    version?: string;
}
@ccclass('ResourceComponent')
export class ResourceComponent extends MlComponent {

    public LoadRemote<T extends Asset>(url: string, options?: IRemoteOptions | null, onComplete?: CompleteCallback<T> | null, userData?: object): void;
    public LoadRemote<T extends Asset>(url: string, onComplete?: CompleteCallback<T> | null, userData?: object): void;
    public LoadRemote<T extends Asset>(url: string, ...args: any): void {
        var options: IRemoteOptions | null = null;
        var onComplete: CompleteCallback<T> | null = null;
        let userData: object = null;
        if (args.length == 3) {
            userData = args[2];
            options = args[0];
            onComplete = args[1];
        }
        else if (args.length == 2) {
            onComplete = args[0];
            userData = args[1];
        } else {
            onComplete = args[0];
        }
        assetManager.loadRemote<T>(url, options, (error: Error, res: T) => {
            if (onComplete) {
                onComplete(error, res, userData);
            }
        });
    }

    public LoadResInBundle<T extends Asset>(
        bundleNameOrUrl: string,
        resPath: string,
        type: Constructor<T> | null,
        bundleOptions: IBundleOptions | null,
        onProgress: ProgressCallback | null,
        onComplete: CompleteCallback<T> | null,
        userData?: object | null): void {
        this.LoadBundle(bundleNameOrUrl, bundleOptions, (err: Error, bundle: AssetManager.Bundle) => {
            this.LoadResFromBundle(bundle, resPath, type, onProgress, onComplete, userData);
        });
    }

    public LoadResArrInBundle<T extends Asset>(
        bundleNameOrUrl: string,
        resPath: string[],
        type: Constructor<T> | null,
        bundleOptions: IBundleOptions | null,
        onProgress: ProgressCallback | null,
        onComplete: CompleteCallback<T> | null,
        userData?: object | null): void {
        this.LoadBundle(bundleNameOrUrl, bundleOptions, (err: Error, bundle: AssetManager.Bundle) => {
            this.LoadResArrFromBundle(bundle, resPath, type, onProgress, onComplete, userData);
        });
    }

    public LoadBundle(nameOrUrl: string, options: IBundleOptions | null, onComplete?: CompleteCallback<AssetManager.Bundle> | null, userData?: object | null): void;
    public LoadBundle(nameOrUrl: string, onComplete?: CompleteCallback<AssetManager.Bundle> | null, userData?: object | null): void;
    public LoadBundle(
        nameOrUrl: string,
        options?: IBundleOptions | CompleteCallback<AssetManager.Bundle> | null,
        onComplete?: CompleteCallback<AssetManager.Bundle> | null,
        userData?: CompleteCallback<AssetManager.Bundle> | object | null): void {
        // if (assetManager.bundles.has(nameOrUrl)) {
        //     var bundle = assetManager.getBundle(nameOrUrl);
        //     if (onComplete) {
        //         onComplete(null, bundle, userData);
        //     }
        //     return;
        // }
        assetManager.loadBundle(nameOrUrl, options, (error: Error, res: AssetManager.Bundle) => {
            if (onComplete) {
                onComplete(error, res, userData);
            }
        });
    }

    public LoadResFromBundle<T extends Asset>(
        bundle: AssetManager.Bundle,
        path: string,
        type: Constructor<T> | null,
        onProgress: ProgressCallback | null,
        onComplete: CompleteCallback<T> | null,
        userData: object | null
    ): void {
        if (!bundle) {
            return;
        }
        bundle.load(path, type, onProgress, (error: Error, res: T) => {
            if (onComplete) {
                onComplete(error, res, userData);
            }
        });
    }
    public LoadResArrFromBundle<T extends Asset>(
        bundle: AssetManager.Bundle,
        path: string[],
        type: Constructor<T> | null,
        onProgress: ProgressCallback | null,
        onComplete: CompleteCallback<T> | null,
        userData: object | null
    ): void {
        if (!bundle) {
            return;
        }
        bundle.load(path, type, onProgress, (error: Error, res: T[]) => {
            if (onComplete) {
                onComplete(error, res, userData);
            }
        });
    }

    public LoadSceneInBundle(
        bundleNameOrUrl: string,
        sceneName: string,
        bundleOptions: IBundleOptions | null,
        onProgress: ProgressCallback | null,
        onComplete: CompleteCallback<SceneAsset> | null,
        userData?: object | null): void {
        let dres1 = Date.now();
        this.LoadBundle(bundleNameOrUrl, bundleOptions, (err: Error, bundle: AssetManager.Bundle) => {
            let dres2 = Date.now();
            console.log("----load res time: " + (dres2 - dres1) + " ms----");
            this.LoadSceneFormBundle(bundle, sceneName, bundleOptions, onProgress, onComplete, userData);
        });
        
    }

    public LoadSceneFormBundle(bundle: AssetManager.Bundle, sceneName: string, bundleOptions: IBundleOptions | null,
        onProgress: ProgressCallback | null,
        onComplete: CompleteCallback<SceneAsset> | null, userData: object) {
        let dres1 = Date.now();
        bundle.loadScene(sceneName, bundleOptions, onProgress, (error: Error, res: SceneAsset) => {
            let dres2 = Date.now();
            console.log("----load scene time: " + (dres2 - dres1) + " ms----");
            if (onComplete) {
                onComplete(error, res, userData);
            }
        });
    }
}

