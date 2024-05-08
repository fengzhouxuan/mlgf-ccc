import { assetManager } from "cc";

export class EditorResUtil {

    /**
     * 检查指定路径的资源是否存在
     *
     * @param path 资源路径,必须是完整路径，如：assets/xxx/xxx/prefabs/test.prefab
     * @returns 如果资源存在，返回true；否则返回false
     */
    public static async checkAssetExists(path: string): Promise<boolean> {
        const uuid = await EditorResUtil.getAssetUuid(path);
        return uuid !== null && uuid !== undefined;
    }

    /**
     * 加载资源
     *
     * @param path 资源路径,必须是完整路径，如：assets/xxx/xxx/prefabs/test.prefab
     * @returns 返回Promise，表示异步加载资源的结果
     */
    public static async loadAsset(path: string): Promise<any> {
        let uuid;
        try {
            uuid = await this.getAssetUuid(path);
        } catch (err) {
            return Promise.reject(err);
        }
        if (!uuid) {
            return Promise.reject(new Error("uuid is null"));
        }

        return new Promise((resolve, reject) => {
            assetManager.loadAny(uuid, (err: Error | null, asset: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }
    /**
     * 获取指定路径的资产UUID
     *
     * @param path 资产路径,必须是完整路径，如：assets/xxx/xxx/prefabs/test.prefab
     * @returns 返回资产的UUID
     */
    public static async getAssetUuid(path: string): Promise<string> {
        // @ts-ignore
        return await Editor.Message.request(
            "asset-db",
            "query-uuid",
            path
        );
    }
}