import { _decorator, Component, Node } from 'cc';
import MlComponent from '../Base/MlComponent';
import { BaseEventArgs } from './BaseEventArgs';
import { EventNode } from './EventNode';
import { ReferencePool } from '../ReferencePool/ReferencePool';
const { ccclass, property } = _decorator;

export type ListenerFunc = (sender:object, args: BaseEventArgs) => void
class EventHandler{
    listener:ListenerFunc;
    context:object;
    constructor(listener:ListenerFunc,context:object){
        this.listener = listener;
        this.context = context;
    }
}
@ccclass('EventComponent')
export class EventComponent extends MlComponent {
    private _events: Map<string, EventHandler[]> = new Map<string, EventHandler[]>();
    private _eventNodes:EventNode[]=[];
    public on(eventId:string,listener:ListenerFunc,context:object){
        let hasEvent = this._events.has(eventId);
        if (!hasEvent){
            this.addNewEvent(eventId);
        }
        let handlers = this.getEventHandlers(eventId);
        if(handlers.length==0){
            handlers.push(new EventHandler(listener, context));
            return;
        }
        let hasSameListenerAndContext = handlers.find(e => e.context == context && e.listener == listener) != null;
        if (hasSameListenerAndContext){
            console.warn(`对象《${context.constructor.name}》--重复注册了事件--《${eventId}》`);
            return;
        }
        handlers.push(new EventHandler(listener, context));
    }

    public off(eventId: string, listener: ListenerFunc, context: object){
        if(!this.hasEvent(eventId)){
            console.warn(`对象《${context.constructor.name}》--注销了不存在的事件--《${eventId}》`);
            return;
        }
        let handlers = this.getEventHandlers(eventId);
        let targetHandler = handlers.find(e => e.context == context && e.listener == listener);
        if(!targetHandler){
            console.warn(`对象《${context.constructor.name}》--并没有注册事件--《${eventId}》`);
            return;
        }
        let index = handlers.indexOf(targetHandler);
        handlers.splice(index,1);
        if(handlers.length==0){
            this.removeEvent(eventId);
        }
    }

    public emit(sender: object, args: BaseEventArgs){
        this._eventNodes.push(EventNode.create(sender,args));
    }

    private handleEvent(sender: object, args: BaseEventArgs){
        if(!this.hasEvent(args.eventId)){
            return;
        }
        let handlers = this.getEventHandlers(args.eventId);
        for (let index = handlers.length-1; index >=0; index--) {
            let handler = handlers[index];
            handler.listener.call(handler.context,sender,args);
        }
    }

    private getEventHandlers(eventId:string):EventHandler[]{
        return this._events.get(eventId);
    }

    private addNewEvent(eventId:string){
        let handlers: EventHandler[]=[];
        this._events.set(eventId,handlers);
    }
   
    private hasEvent(eventId:string):boolean{
        return this._events.has(eventId);
    }

    private removeEvent(eventId:string){
        this._events.delete(eventId);
    }

    onUpdate(dt: number): void {

        while (this._eventNodes.length>0) {
            let event =this._eventNodes.shift();
            this.handleEvent(event.sender,event.args);
            ReferencePool.release(event.args);
            ReferencePool.release(event);
        }
    }
}

