import { _decorator, Component, EventTouch, Input, input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputTest')
export class InputTest extends Component {
    protected onEnable(): void {
        // input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart1, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouch, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouch, this);

    }

    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    protected onTouchStart (event: EventTouch) {
        console.log('onTouchStart--', event);
        event.propagationStopped=false;
    }

    protected onTouchStart1 (event: EventTouch) {
        console.log('onTouchStart1--', event);
        event.propagationStopped=false;
        event.preventSwallow =true;
    }

    protected onTouch (event: EventTouch) {
        event.propagationStopped=false;
        event.preventSwallow =true;
    }

    private onButtonClick(){
        console.log('onButtonClick--');
    }
}

