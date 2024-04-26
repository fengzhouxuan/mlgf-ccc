import { _decorator, Component, math, Node, random, Vec3 } from 'cc';
import { PerlinNoise } from './PerlinNoise';
const { ccclass, property } = _decorator;

@ccclass('DoShake')
export class DoShake extends Component {
    private _maximumTranslationShake: Vec3 = new Vec3(0.4, 0.2, 0.4);
    private _maximumAngularShake: Vec3 = new Vec3(1, 1, 1);
    private _frequency = 20;  //频率
    private _recoverySpeed = 2;   //恢复速度
    private _traumaExponent = 2;  //强度

    private _seed = 0;
    private _trauma = 0;
    private _time = 0;

    private _originalPosition:Vec3;
    protected onLoad(): void {
        this._seed = math.random();
    }

    public shake() {
        if(this._trauma<=0){
            this._originalPosition = this.node.getPosition();
        }
        this._trauma = 1;
    }

    protected update(dt: number): void {
        if (this._trauma <= 0) {
            return;
        }
        this._time+=dt;
        this._trauma = math.clamp01(this._trauma-this._recoverySpeed*dt);
        this.shakePosition();
    }

    private _outPosition=new Vec3();
    private shakePosition() {
        let shake = Math.pow(this._trauma, this._traumaExponent);
        let x = PerlinNoise.noise(this._seed,this._time*this._frequency,0,-1,1);
        let y = PerlinNoise.noise(this._seed+1,this._time*this._frequency,0,-1,1);
        let Z = PerlinNoise.noise(this._seed+2,this._time*this._frequency,0,-1,1);
        this._outPosition.x = x*this._maximumTranslationShake.x*shake+this._originalPosition.x;
        this._outPosition.y = y*this._maximumTranslationShake.y*shake+this._originalPosition.y;
        this._outPosition.z = Z*this._maximumTranslationShake.z*shake+this._originalPosition.z;
        this.node.setPosition(this._outPosition);
    }
}


