import { _decorator, CCString, Component, Node } from 'cc';
import { Constructor } from '../Base/MlEntry';
import { ProcedureBase } from './ProcedureBase';
const { ccclass, property } = _decorator;

@ccclass('ProcedureHelper')
export abstract class ProcedureHelper{
    abstract get startProcedure():Constructor<ProcedureBase>;
    abstract get procedures():Constructor<ProcedureBase>[];
}


