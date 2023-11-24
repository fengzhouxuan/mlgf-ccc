import { debug } from "cc";

export default class CloneUtil {
    public static isPlainObject1(obj) {
        if (!obj || typeof obj !== 'object' || obj.nodeType) {
            return false;
        }
        let con =obj.constructor;
        let own = !CloneUtil.hasOwnProperty.call(obj, 'constructor');
        let objOwn = !CloneUtil.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');
        // if (obj.constructor && !CloneUtil.hasOwnProperty.call(obj, 'constructor') && !CloneUtil.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        //     return false;
        // }
        if(con && own && objOwn){
            return false;
        }
        var key;
        for (key in obj) { }
        return key === undefined || CloneUtil.hasOwnProperty.call(obj, key)
    };

    public static isPlainObject(obj){
        let isObj = typeof obj==='object';
        let protoObj = Object.prototype.toString.call(obj)==='[object Object]';
        return obj && isObj && protoObj;
    }

    public static extend(args1: any, ...args2: any[]) {
        /*
      *target被扩展的对象
      *length参数的数量
      *deep是否深度操作
      */
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
        // deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
        // 然后把第二个参数赋值给target
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};

            // 将i赋值为2，跳过前两个参数
            i = 2;
        }

        // target既不是对象也不是函数则把target设置为空对象。
        if (typeof target !== "object" && !(typeof target == 'function')) {
            target = {};
        }

        // 如果只有一个参数，则把jQuery对象赋值给target，即扩展到jQuery对象上
        if (length === i) {
            target = this;

            // i减1，指向被扩展对象
            --i;
        }

        // 开始遍历需要被扩展到target上的参数

        for (; i < length; i++) {
            // 处理第i个被扩展的对象，即除去deep和target之外的对象
            if ((options = arguments[i]) != null) {
                // 遍历第i个对象的所有可遍历的属性
                for (name in options) {
                    // 根据被扩展对象的键获得目标对象相应值，并赋值给src
                    src = target[name];
             
                    // 得到被扩展对象的值
                    copy = options[name];

                    // 比较target和copy，解决在深复制中的存在环的问题，如果存在环会造成栈溢出
                    if (target === copy) {
                        continue;
                    }

                    if(name=="levels"){
                        console.log("");
                    }

                    // 当用户想要深度操作时，递归合并
                    // copy是纯对象或者是数组
                    if (deep && copy && (CloneUtil.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        // 如果是数组
                        if (copyIsArray) {
                            // 将copyIsArray重新设置为false，为下次遍历做准备。
                            copyIsArray = false;
                            // 判断被扩展的对象中src是不是数组
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            // 判断被扩展的对象中src是不是纯对象
                            clone = src && CloneUtil.isPlainObject(src) ? src : {};
                        }

                        // 递归调用extend方法，继续进行深度遍历
                        target[name] = CloneUtil.extend(deep, clone, copy);

                        // 如果不需要深度复制，则直接把copy（第i个被扩展对象中被遍历的那个键的值）
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // 原对象被改变，因此如果不想改变原对象，target可传入{}
        return target;
    }

    public static clone(obj) {
        var buf;
        if (obj instanceof Array) {
            buf = [];
            var i = obj.length;
            while (i--) {
                buf[i] = CloneUtil.clone(obj[i]);
            }
            return buf;
        } else if (obj instanceof Object) {
            buf = {};
            for (var k in obj) {
                buf[k] = CloneUtil.clone(obj[k]);
            }
            return buf;
        } else {
            return obj;
        }
    }
}