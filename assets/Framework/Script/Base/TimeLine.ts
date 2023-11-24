
export class TimeLine {
    private static _timelines: TimeLine[] = [];
    private static _stoppedLines: TimeLine[] = [];
    public static REPEAT_FOREVER = -1;
    private _timeLineItems: TimeLineItem[] = [];
    private _thisArgs: any;
    private _started = false;
    private _index = 0;
    private _completed = false;
    private _stopped = false;
    constructor(thisArgs: any) {
        this._thisArgs = thisArgs;
    }
    public static update(dt: number) {
        this._stoppedLines.length = 0;
        for (let i = 0; i < this._timelines.length; i++) {
            const timeline = this._timelines[i];
            if (!timeline._started) {
                continue;
            }
            if (timeline._stopped || timeline._completed) {
                this._stoppedLines.push(timeline);
                continue;
            }
            timeline.onUpdate(dt);
        }
        for (let i = 0; i < this._stoppedLines.length; i++) {
            const line = this._stoppedLines[i];
            this._timelines.splice(this._timelines.indexOf(line), 1);
        }
        this._stoppedLines.length = 0;
    }

    public static line(thisArgs: any): TimeLine {
        let timeline = new TimeLine(thisArgs);
        return timeline;
    }

    private onUpdate(dt: number) {
        if (this._stopped) {
            return;
        }
        if (this._completed) {
            return;
        }
        if (this._index >= this._timeLineItems.length) {
            this._completed = true;
            return;
        }
        let item = this._timeLineItems[this._index];
        let stopped = item.stopped;
        if (stopped) {
            this._index++;
            return;
        }
        let stop = item.addInterval(dt);
        if (stop) {
            this._index++;
        }
    }

    public add(interval: number, repeat: number, endCallback: (value: TimeLineItem) => void, startCallback?: (value: TimeLineItem) => void, updateCallback?: (value: TimeLineItem,dt:number,elapsedTime:number,interval:number) => void): TimeLine {
        let item = new TimeLineItem(this._thisArgs);
        item.endCallback = endCallback;
        item.startCallback = startCallback;
        item.updateCallback = updateCallback;
        item.interval = interval || 0.01;
        item.repeat = repeat || 1;
        this._timeLineItems.push(item);
        return this;
    }
    public start(): TimeLine {
        this._started = true;
        TimeLine._timelines.push(this);
        return this;
    }

    public stop() {
        this._stopped = true;
    }
}

export class TimeLineItem {
    public interval = 1;
    public repeat = 1;
    public startCallback: (value: TimeLineItem) => void;
    public endCallback: (value: TimeLineItem) => void;
    public updateCallback: (value: TimeLineItem, dt: number, elapsedTime: number, interval: number) => void;
    private _stopped = false;
    private _repeated = 0;
    private _intervalAddOneTurn = 0;
    private _intervalAdd =null;
    private _thisAgrs: any;

    constructor(thisArgs: any) {
        this._thisAgrs = thisArgs;
        this._intervalAdd = null;
    }

    public get elapsedTimeAll(): number {
        return this._intervalAdd;
    }

    public get elapsedTimeOneTurn(): number {
        return this._intervalAddOneTurn;
    }

    public get repeatTimes(): number {
        return this._repeated;
    }


    public addInterval(interval: number): boolean {
        if(this._intervalAdd==null){
            this._intervalAdd=0;
            this.startCallback?.call(this._thisAgrs,this)
        }
        this._intervalAdd += interval;
        this._intervalAddOneTurn += interval;
        this.updateCallback?.call(this._thisAgrs, this, interval, this._intervalAddOneTurn,this.interval);
        if (this._intervalAddOneTurn >= this.interval) {
            this._intervalAddOneTurn = 0;
            this._repeated++;
            this.endCallback?.call(this._thisAgrs, this);
            if (this.repeat !== TimeLine.REPEAT_FOREVER) {
                if (this._repeated >= this.repeat) {
                    this.stop();
                    return true;
                }
            }

            if (this._stopped) {
                return true;
            }
        }
        return false;
    }
    public get stopped(): boolean {
        return this._stopped;
    }

    public stop() {
        this._stopped = true;
    }
}