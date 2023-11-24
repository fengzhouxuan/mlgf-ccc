import { ISchedulable, Scheduler, director, macro } from "cc";

export class CCCTimer implements ISchedulable {
    private static _instance;
    public static init() {
        if (!this._instance) {
            this._instance = new CCCTimer();
            Scheduler.enableForTarget(this._instance);
        }
    }
    public static schedule(callback, interval = 0, repeat: number = macro.REPEAT_FOREVER, delay = 0) {
        interval = interval || 0;
        repeat = Number.isNaN(repeat) ? macro.REPEAT_FOREVER : repeat;
        delay = delay || 0;
        const scheduler = director.getScheduler();
        const paused = false;
        scheduler.schedule(callback, this._instance, interval, repeat, delay, paused);
    }

    public static scheduleOnce(callback, delay = 0) {
        this.schedule(callback, 0, 0, delay);
    }

    public static unschedule(callback_fn) {
        if (!callback_fn) {
            return;
        }
        director.getScheduler().unschedule(callback_fn, this._instance);
    }
}
