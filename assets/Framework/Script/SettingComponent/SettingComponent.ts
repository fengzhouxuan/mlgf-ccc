import { _decorator, Component, Node, sys } from 'cc';
import MlComponent from '../Base/MlComponent';
const { ccclass, property } = _decorator;

@ccclass('SettingComponent')
export class SettingComponent extends MlComponent {
    set(key: string, value: any) {
        var keywords = key;

        if (null == key) {
            console.error("存储的key不能为空");
            return;
        }

        if (null == value) {
            console.warn("存储的值为空，则直接移除该存储");
            this.remove(key);
            return;
        }
        if (typeof value === 'function') {
            console.error("储存的值不能为方法");
            return;
        }
        if (typeof value === 'object') {
            try {
                value = JSON.stringify(value);
            }
            catch (e) {
                console.error(`解析失败，str = ${value}`);
                return;
            }
        }
        else if (typeof value === 'number') {
            value = value + "";
        }

        sys.localStorage.setItem(keywords, value);
    }

    get(key: string, defaultValue: any = ""): string {
        if (null == key) {
            console.error("存储的key不能为空");
            return null!;
        }

        key = key;

        let str: string | null = sys.localStorage.getItem(key);

        if (null === str) {
            return defaultValue;
        }
        return str;
    }

    /** 获取指定关键字的数值 */
    getNumber(key: string, defaultValue: number = 0): number {
        var r = this.get(key);
        if (r == "0") {
            return Number(r);
        }
        return Number(r) || defaultValue;
    }

    /** 获取指定关键字的布尔值 */
    getBoolean(key: string): boolean {
        var r = this.get(key);
        return Boolean(r) || false;
    }

    /** 获取指定关键字的JSON对象 */
    getJson(key: string, defaultValue?: any): any {
        var r = this.get(key);
        return (r && JSON.parse(r)) || defaultValue;
    }

    remove(key: string) {
        if (null == key) {
            console.error("存储的key不能为空");
            return;
        }

        var keywords =key;

        sys.localStorage.removeItem(keywords);
    }

    clear() {
        sys.localStorage.clear();
    }
}


