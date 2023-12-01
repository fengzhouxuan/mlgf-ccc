import { _decorator } from "cc";
import { ProcedureHelper } from "../../../Framework/Script/Procedure/ProcedureHelper";
import { Constructor } from "../../../Framework/Script/Base/MlEntry";
import { ProcedureBase } from "../../../Framework/Script/Procedure/ProcedureBase";
import { GameProcedureInit } from "./GameProcedureInit";
import { GameProcedureDownLoadPackge } from "./GameProcedureDownLoadPackge";
import { GameProcedurePreload } from "./GameProcedurePreload";
import { GameProcedureMainGame } from "./GameProcedureMainGame";

const { ccclass, property } = _decorator;
@ccclass("GameProcedureHelper")
export class GameProcedureHelper extends ProcedureHelper{
    get startProcedure(): Constructor<ProcedureBase> {
        return GameProcedureInit;
    }
    get procedures(): Constructor<ProcedureBase>[] {
        return [
            GameProcedureInit,
            GameProcedureDownLoadPackge,
            GameProcedurePreload,
            GameProcedureMainGame
        ];
    }

}