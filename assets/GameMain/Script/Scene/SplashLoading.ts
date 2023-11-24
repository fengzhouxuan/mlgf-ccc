import { _decorator, Component, Label, Node, ProgressBar, ResolutionPolicy, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SplashLoading')
export class SplashLoading extends Component {
    // private _progressBar:ProgressBar;
    private _tiplabel:Label;
    private _simuValue:number=0;
    private _realValue:number=0;
    private  static _contentString:string;
    private readonly _maxSimuValue=0.9;
    private static _instance:SplashLoading;
    private static _destroyed:boolean;
    
    public static isDesroyed() : boolean {
        return SplashLoading._destroyed;
    }
    
    protected onLoad(): void {
        SplashLoading._instance=this;
        // this._progressBar = this.node.getComponentInChildren(ProgressBar);
        this._tiplabel = this.node.getComponentInChildren(Label);
        SplashLoading._contentString = "正在加载...";
    }
    protected onEnable(): void {
        // this._progressBar.progress=0;
        this._tiplabel.string="";
    }

    protected update(dt: number): void {
        if(SplashLoading._destroyed){
            return;
        }
        let simu = this._simuValue +this._maxSimuValue/2*dt;
        simu = Math.min(simu,this._maxSimuValue);
        this._simuValue = simu;
        let progress = Math.round(Math.max(this._simuValue,this._realValue)*100);
        this._tiplabel.string = `${SplashLoading._contentString}${progress}%`;
    }

    protected onDisable(): void {
        this._simuValue = 0;
        // this._progressBar.progress = 0;
    }

    public static Active(active:boolean,content?:string){
        if(this._destroyed){
            return;
        }
        this._instance.node.active = active;
        if(content){
            this._contentString = content;
            this.SetContent(content);
        }
    }

    public static SetProgress(v:number){
        if(this._destroyed){
            return;
        }
        this._instance._realValue=v;
    }

    public static SetContent(content:string){
        this._contentString = content;
    }

    public static Destroy(){
        if(this._destroyed){
            return;
        }
        this._instance.node.destroy();
        this._destroyed=true;
        this._instance=null;
    }
}

