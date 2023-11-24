import { js } from "cc";
import { Constructor } from "../Base/MlEntry";

export class ClassUtils{
    public static GetClassName(objOrCtor:any):string{
        return js.getClassName(objOrCtor);
    }
    public static GetClassByName(ctorName:string):Constructor{
        return js.getClassByName(ctorName);
    }
}