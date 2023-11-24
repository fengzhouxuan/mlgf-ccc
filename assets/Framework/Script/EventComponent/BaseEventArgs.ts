import { MlEventArgs } from "../Base/MlEventArgs";
import { IReference } from "../ReferencePool/IReference";

export abstract class BaseEventArgs extends MlEventArgs implements IReference{
    clear() {

    }
    get customUnitName(): string {
        return this.eventId;
    }
    public abstract get eventId():string;
}