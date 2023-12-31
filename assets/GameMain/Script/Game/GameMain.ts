import { Vec3 } from "cc";
import { SpaceShipEntityData } from "../Entity/EntityData/SpaceShipEntityData";
import { UIManager } from "../../../FrameworkUtil/UI/UIManager";
import { EntityUtil } from "../Entity/EntityUtil";
import { UIFormId } from "../UI/UIUtil";

export class GameMain{
    public static Instance:GameMain=null;
    public static Launch():GameMain{
        if(this.Instance){
            return;
        }
        this.Instance = new GameMain();
        this.Instance.init();
        return this.Instance;
    }
    
    public init(){
        UIManager.OpenGameUIForm(UIFormId.GameForm);
        this.showSpaceShip();
    }

    public update(dt:number){

    }

    private showSpaceShip(){
        let data = new SpaceShipEntityData(3);
        data.position = new Vec3(0,-2,0);
        EntityUtil.ShowSpaceShip(data);
    }
}
