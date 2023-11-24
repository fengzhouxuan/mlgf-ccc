import MlComponent from "./MlComponent";

export declare type Constructor<T = unknown> = new (...args: any[]) => T;

export default class MlEntry {
    private static _compoents: MlComponent[] = []

    public static regisiterComponent(component: MlComponent): void {
        this._compoents.push(component);
    }

    public static getComponent<T extends MlComponent>(type: Constructor<T>): T |null {
        for (const component of MlEntry._compoents) {
            if (component instanceof type) {
                return component;
            }
        }
        return null;
    }

    public static update(dt:number){
        for (let i = 0; i < this._compoents.length; i++) {
            const component = this._compoents[i];
            component.onUpdate(dt);
            
        }
    }
}
//只用作方便在控制台调试,不建议在业务代码中使用
globalThis.ml = MlEntry;
