import { Camera, Component, Vec3, _decorator,Node, UITransform} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI3dTracker')
export class UI3dTracker extends Component{
    @property(Node)
    d3Target: Node = null!;
    @property(Vec3)
    offset=new Vec3();
    @property(Camera)
    d3Camera: Camera = null!;
    @property
    distance = 0;
    @property
    useScale=false;
    @property
    trackOnLoad=false;

    private _lastWPos: Vec3 = new Vec3();
    private _lastCameraPos:Vec3 = new Vec3();
    private _trackedPos: Vec3 = new Vec3();
    private _trackedScale:Vec3 = new Vec3();

    protected lateUpdate(dt: number): void {
        if(this.trackOnLoad){
            this.Track();
        }
    }
    
    public Track(force?:boolean){
        if(!this.d3Target){
            return;
        }
        const wpos = this.d3Target.worldPosition;
        const camerawPos = this.d3Camera.node.worldPosition;
        // @ts-ignore
        if (!this.d3Camera!._camera || (this._lastWPos.equals(wpos) && this._lastCameraPos.equals(camerawPos))) {
            if(!force){
                return;
            }
        }

        this._lastWPos.set(wpos);
        this._lastCameraPos.set(camerawPos);
        const camera = this.d3Camera!;
        // [HACK]
        // @ts-ignore
        camera._camera.update();
        camera.convertToUINode(Vec3.add(this._trackedPos,wpos,this.offset), this.node.parent!, this._trackedPos);
        this.node.setPosition(this._trackedPos);
        if(!this.useScale){
            return;
        }
        // @ts-ignore
        Vec3.transformMat4(this._trackedPos, this.d3Target.worldPosition, camera._camera!.matView);

        const ratio = this.distance / Math.abs(this._trackedPos.z);

        const value = Math.floor(ratio * 100) / 100;
        this._trackedScale.x=value;
        this._trackedScale.y=value;
        this._trackedScale.z=1;
        this.node.setScale(value, value, 1);
    }

    public getUIPositionForm3dPosition(position:Vec3):Vec3{
        let pos: Vec3 = new Vec3();
        const camera = this.d3Camera!;
         // @ts-ignore
        camera._camera.update();
        camera.convertToUINode(position, this.node.parent!, pos);
        return pos;
    }
}

