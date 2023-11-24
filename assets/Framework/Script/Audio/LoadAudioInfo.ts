import { IReference } from "../ReferencePool/IReference";

export class LoadAudioInfo implements IReference{
    public static CustoemUniName = "LoadAudioInfo";
    private _isMusic:boolean;
    private _assetName:string;
    private _seralId:number;
    private _volume:number;

    get serlId():number{
        return this._seralId;
    }

    public get assetName() : string {
        return this._assetName;
    }
    
    public get isMusic() : boolean {
        return this._isMusic;
    }
    
    public get volume() : number {
        return this._volume;
    }
    
    get customUnitName(): string {
        return LoadAudioInfo.CustoemUniName;
    }
    
    constructor(){
        this.clear();
    }

    public init(serialId:number,assetName:string,volume:number,isMusic:boolean):LoadAudioInfo{
        this._seralId = serialId;
        this._assetName = assetName;
        this._isMusic = isMusic;
        this._volume = volume;
        return this;
    }

    clear() {
        this._isMusic = false;
        this._assetName=null
        this._seralId = 0;
    }





}