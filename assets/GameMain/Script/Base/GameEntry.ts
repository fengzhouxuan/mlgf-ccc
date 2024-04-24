
import MlEntry from '../../../Framework/Script/Base/MlEntry';
import BaseComponent from '../../../Framework/Script/Base/BaseComponent';
import { ResourceComponent } from '../../../Framework/Script/ResourceComponent/ResourceComponent';
import { ObjectPoolComponent } from '../../../Framework/Script/ObjectPool/ObjectPoolComponent';
import { EventComponent } from '../../../Framework/Script/EventComponent/EventComponent';
import { EntityComponent } from '../../../Framework/Script/EntityComponent/EntityComponent';
import { UIComponent } from '../../../Framework/Script/UIComponent/UIComponent';
import { AStarPathFindComponent } from '../../../Framework/Script/AStarPathFinding/AStarPathFindComponent';
import { DataTableComponent } from '../../../Framework/Script/DataTableComponent/DataTableComponent';
import { GameMain } from '../Game/GameMain';
import { CCCTimer } from '../../../Framework/Script/Base/CCCTimer';
import { TimeLine } from '../../../Framework/Script/Base/TimeLine';
import { UIEntityComponent } from '../../CustomComponent/UIEntity/UIEntityComponent';
import { UserComponent } from '../../CustomComponent/User/UserComponent';
import { SettingComponent } from '../../../Framework/Script/SettingComponent/SettingComponent';
import { AudioComponent } from '../../../Framework/Script/Audio/AudioComponent';
import { AudioManager } from '../../../FrameworkUtil/Audio/AudioManager';
import { AdComponent } from '../../../Framework/Script/Ad/AdComponent';
import { PlatformComponent } from '../../CustomComponent/Platform/PlatformComponent';
import {Component, Game, _decorator,director, macro,game } from "cc";
import { UIManager } from '../../../FrameworkUtil/UI/UIManager';
import { ProcedureComponent } from '../../../Framework/Script/Procedure/ProcedureComponent';
import { NodeClicker } from '../../../FrameworkUtil/NodeTouch/NodeClicker';
import { DataAnalysisComponent } from '../../CustomComponent/DataAnalysis/DataAnalysisComponent';
import { HttpComponent } from '../../../Framework/Script/Http/HttpComponent';
import { AppComponent } from '../../../Framework/Script/App/AppComponent';
import { UserDataComponent } from '../../../Framework/Script/UserData/UserDataComponent';
const { ccclass, property } = _decorator;
var timeScale = 1;

//@ts-ignore
game._calculateDT = function (now: number) {
    if (!now) now = performance.now();
    this._deltaTime = now > this._startTime ? (now - this._startTime) / 1000 : 0;
    if (this._deltaTime > Game.DEBUG_DT_THRESHOLD) {
        this._deltaTime = this.frameTime / 1000;
    }
    this._startTime = now;
    return this._deltaTime * timeScale;
};

@ccclass('GameEntry')
export class GameEntry extends Component {

    public static end=false;

    //框架模块
    public static base: BaseComponent;
    public static procedure:ProcedureComponent;
    public static res: ResourceComponent;
    public static objectPool: ObjectPoolComponent;
    public static entity: EntityComponent;
    public static ui: UIComponent;
    public static pathFind: AStarPathFindComponent;
    public static dataTable: DataTableComponent;
    public static event: EventComponent;
    public static setting: SettingComponent;
    public static audio: AudioComponent;
    public static ad: AdComponent;
    public static http:HttpComponent;
    public static app:AppComponent;
    //自定义
    public static platform: PlatformComponent;
    public static uiEntity: UIEntityComponent;
    public static user: UserDataComponent;
    public static dataAnalysis:DataAnalysisComponent;

    public static game: GameMain;

    public static set gameSpeed(v: number) {
        timeScale = v;
    }
    public static get gameSpeed(): number {
        return timeScale;
    }

    //自定义管理器
    start() {

        macro.ENABLE_MULTI_TOUCH = false;   //关闭多点触控
        GameEntry.base = MlEntry.getComponent(BaseComponent);
        GameEntry.procedure = MlEntry.getComponent(ProcedureComponent);
        GameEntry.res = MlEntry.getComponent(ResourceComponent);
        GameEntry.objectPool = MlEntry.getComponent(ObjectPoolComponent);
        GameEntry.event = MlEntry.getComponent(EventComponent);
        GameEntry.entity = MlEntry.getComponent(EntityComponent);
        GameEntry.ui = MlEntry.getComponent(UIComponent);
        GameEntry.pathFind = MlEntry.getComponent(AStarPathFindComponent);
        GameEntry.dataTable = MlEntry.getComponent(DataTableComponent);
        GameEntry.setting = MlEntry.getComponent(SettingComponent);
        GameEntry.audio = MlEntry.getComponent(AudioComponent);
        GameEntry.ad = MlEntry.getComponent(AdComponent);
        GameEntry.http = MlEntry.getComponent(HttpComponent);
        GameEntry.app = MlEntry.getComponent(AppComponent);

        GameEntry.platform = MlEntry.getComponent(PlatformComponent);
        GameEntry.uiEntity = MlEntry.getComponent(UIEntityComponent);
        GameEntry.user = MlEntry.getComponent(UserDataComponent);
        GameEntry.dataAnalysis =MlEntry.getComponent(DataAnalysisComponent);


        this.initManager();

        CCCTimer.init();
        // this.node.addComponent(NodeClicker);
        // GameEntry.platform.setFrameRate(30);
        GameEntry.platform.onAudioInterruptionEnd(() => {
            AudioManager.resumeMusic();
            console.log("音频打断恢复");
        });
    }

    private initManager() {
        let node = this.node.getChildByName("Managers");
    }

    protected update(dt: number): void {

        TimeLine.update(dt);
    }
    
}
//只用作方便在控制台调试,不建议在业务代码中使用
globalThis.gameEntry = GameEntry;


