import { EventTarget } from "cc";
import { Constructor } from "../Base/MlEntry";
import { ClassUtils } from "../Utils/ClassUtils";
import { FsmState } from "./FsmState";

export class Fsm<T>{
    private _name:string;
    private _owner:T=null;
    private _states:Map<Constructor<FsmState<T>>,FsmState<T>>;
    private _data:Map<string,object>;
    private _currentState:FsmState<T>=null;
    private _currentStateTime:number=0;
    private _isDestroyed:boolean=false;
    
    private _event:EventTarget;
    constructor(){
        this._name = null;
        this._owner=null;
        this._states = new Map<Constructor<FsmState<T>>,FsmState<T>>;
        this._data = new Map<string,object>;
        this._currentState = null;
        this._currentStateTime=0;
        this._isDestroyed = false;
        this._event =new EventTarget();
    }

    public get name() : string {
        return this._name;
    }
    
    protected set name(v : string) {
        this._name = v;
    }
    
    public get owner() : T {
        return this._owner;
    }
    
    public get currentState() : FsmState<T> {
        return this._currentState;
    }

    public get currentStateCtor(): Constructor<FsmState<T>>{
        for (const [key, value] of this._states) {
            if(value==this.currentState){
             return key;
            }
         }
         return null;
    }

    public get currentStateTime():number{
        return this._currentStateTime;
    }

    public get fsmStateCount():number{
        return this._states.size;
    }

    public get isRunning():boolean{
        return this._currentState!=null;
    }
    public get isDestroy():boolean{
        return this._isDestroyed;
    }

    public Init(name:string,owner:T,stateCtors:Constructor<FsmState<T>>[]){
        this._name = name;
        this._owner = owner;
        this._isDestroyed = false;
        for (let i = 0; i < stateCtors.length; i++) {
            const state = stateCtors[i];
            let stateInstance = new state();
            this._states.set(state,stateInstance);
            stateInstance.OnInit(this);
        }
    }

    public start(stateCtor:Constructor<FsmState<T>>){
        if(this.isRunning){
            console.warn(`状态机${this.name}已经开始了`)
            return;
        }
        let state = this.getState(stateCtor);
        if(!state){
            console.error(`状态机 ${this.name} 的启动状态不存在`);
            return;
        }
        this._currentStateTime=0;
        this._currentState = state;
        this._currentState.onEnter(this);
    }

    public hasState(stateCtor:Constructor<FsmState<T>>):boolean{
        return this._states.has(stateCtor);
    }

    public hasStateInstance(state:FsmState<T>):boolean{
        for (const [key, value] of this._states) {
           if(value==state){
            return true;
           }
        }
        return false;
    }

    public getState(stateCtor:Constructor<FsmState<T>>):FsmState<T>{
        if(!this._states.has(stateCtor)){
            return null;
        }
        return this._states.get(stateCtor);
    }

    public getStateInstance(state:FsmState<T>):FsmState<T>{
        for (const [key, value] of this._states) {
            if(value==state){
             return value;
            }
         }
         return null;
    }

    public hasData(key:string):boolean{
        return this._data.has(key);
    }

    public getData(key:string):any{
        return this._data.get(key);
    }
    public setData(key:string,value:any){
        this._data.set(key,value);
    }

    public removeDate(key:string):boolean{
       return this._data.delete(key);
    }
    
    public update(dt:number){
        if(!this._currentState){
            return;
        }
        this._currentStateTime+=dt;
        this._currentState.onUpdate(this,dt);
    }

    public shutdown(){
        if(this.currentState){
            this.currentState.onLeave(this,true);
        }
        for (const [key, value] of this._states) {
            value.onDestroy(this);
         }
         this._name=null;
         this._owner=null;
         this._states.clear();
         this._data.clear();
         this._currentState = null;
         this._currentStateTime=0;
         this._isDestroyed=true;
    }
    
    public changeState(state:Constructor<FsmState<T>>){
        if(!this._currentState){
            console.warn(`状态机${this.name}的当前状态不存在，请查看状态机是否调用了start方法`);
            return;
        }
        let stateInstance = this.getState(state);
        if(!stateInstance){
            console.warn(`状态机${this.name}不存在状态${ClassUtils.GetClassName(state)}`);
            return;
        }
        this._currentState.onLeave(this,false);
        this._currentStateTime=0;
        this._currentState = stateInstance;
        this._currentState.onEnter(this);
    }

    public emit(type: number|string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any){
        this._event.emit(type,arg0,arg1,arg2,arg3,arg4);
    }

    public subScrip<TFunction extends (...any: any[]) => void>(type: number|string,callback: TFunction, thisArg?: any){
        this._event.on(type,callback,thisArg);
    }

    public unSubScrip<TFunction extends (...any: any[]) => void>(type: number|string,callback: TFunction, thisArg?: any){
        this._event.off(type,callback,thisArg);
    }
}