import { Component, MeshRenderer, _decorator} from 'cc';
const { ccclass,property } = _decorator;

@ccclass('MeshProgress')
export class MeshProgress extends Component{
    @property
    public get value():number{
        return this._value;
    }

    public set value(value:number){
        this._value = value;
        if(this._mesh){
            let progress:number = this._value / 100;
            this._mesh.setInstancedAttribute('instance_progress',[progress]);
        }
    }
    private _value:number = 0;

    private _mesh:MeshRenderer = null;
    protected onLoad(): void {
        this._mesh = this.getComponent(MeshRenderer);
    }
}

