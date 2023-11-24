export class AssetUtil{
    static getSpfName(name:string):string{
        return `UI/UISprite/${name}/spriteFrame`;
    }
    static getMatName(name:string):string{
        return`Mat/${name}`;
    }

    static getConfigName(name:string):string{
        return`Config/${name}`;
    }
}