import { _decorator, Component, Node, view ,screen, Widget} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIAdapter')
export class UIAdapter extends Component {
    @property
    adapterTop=false;
    @property
    topOffset = 0;
    @property
    adapterBottom=false;
    @property
    bottomOffset = 0;

    Adaper(){
        this._adapter();
    }

    private _adapter() {
        const widget = this.node.getComponent(Widget) as Widget;
        let pos = this.node.getWorldPosition();
        let designSize = view.getDesignResolutionSize();
        let winSize = screen.windowSize;
        if (winSize.width / designSize.width < winSize.height / designSize.height) {
            //窄屏
            if(this.adapterTop){
                if(widget){
                    widget.top += this.topOffset;
                }else{
                    pos.y = pos.y + this.topOffset;
                    this.node.setWorldPosition(pos);
                }
            }
            if(this.adapterBottom){
                if(widget){
                    widget.top += this.bottomOffset;
                }else{
                    pos.y = pos.y + this.bottomOffset;
                    this.node.setWorldPosition(pos);
                }
            }
        } else {
            //宽屏
        }
    }
}

