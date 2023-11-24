import { Constructor } from "cc";

export class UserDataMerger {
    private static _arrayConstructors;
    public static setArrayConstructs(constructors: { [key: string]: any }) {
        this._arrayConstructors = constructors;
    }

    public static deepMerge(target: any, source: any, constructors: { [key: string]: any }): any {
        this.setArrayConstructs(constructors);
        return this.internalMerge(target, source);
    }

    private static internalMerge(target: any, source: any): any {
        if (!source) {
            return target;
        }
        if (!target) {
            target = {};
        }
        for (let name in source) {
            let targetV = target[name];
            let sourceV = source[name];
            if (sourceV != undefined) {
                if (Array.isArray(sourceV)) {
                    //数组
                    if (sourceV.length > 0) {
                        let arrayCtor = this._arrayConstructors[name];
                        if (arrayCtor) {
                            let mergedArray = [];
                            for (let i = 0; i < sourceV.length; i++) {
                                const newSource = sourceV[i];
                                let newTarget = new this._arrayConstructors[name]();
                                let mergedItem = this.internalMerge(newTarget, newSource);
                                mergedArray.push(mergedItem);
                            }
                            target[name] = mergedArray;
                        } else {
                            target[name] = sourceV;
                        }
                    }
                } else if (typeof sourceV == 'object') {
                    //对象
                    targetV = targetV ? targetV : {};
                    target[name] = this.internalMerge(targetV, sourceV);
                }
                else if (sourceV != undefined) {
                    target[name] = sourceV;
                }
            }
        }
        return target;
    }
}