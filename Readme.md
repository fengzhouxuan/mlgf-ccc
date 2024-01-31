
# 前言
因为本人是做Unity开发的，在Unity中使用了一款框架，个人觉得非常好用[GameFramework](https://github.com/EllanJiang/GameFramework)，作者人称E大，这是他的github主页 [EllanJiang](https://github.com/EllanJiang),在下有幸拜读过源码，受益匪浅。

后来公司业务需要，转到了cocos，也没找到好用的框架，于是就把E大的框架移植了过来，当然没有原版强大，做了相对的简化，其中资源模块我直接用了cocos的API封装了一下，原版的资源模块太复杂了，时间又有限，就没做移植，另外数据表模块也没复刻过来，因为需求比较简单就先用json凑合着用了，其他模块都是尽可能的做到和E大一致，这样我用起来也顺手。

强烈推荐去读一读源码 [GameFramework](https://github.com/EllanJiang/GameFramework)



# 框架简介
该框架是在cocos3.7.4上做的开发，理论上讲3.x都可以用，只要cocos的bundle资源加载方式不大改，

目前主要有下面几个模块：
## 数据表DataTableComplete
目前就是解析json文件，分数据表和配置表


加载数据表参考```GameProcedurePreload```类的```loadDataTables```方法  
数据表示例文件在assets/GameMain/Bundes/Share/Config/GameDatatables.json   
配置文件示例见assets/GameMain/Bundles/Share/Config/MainConfig.json

1 调用数据表：   
```ts
    //获取数据表
    let dt = GameEntry.dataTable.getDataTable(DRLevelLoop);
    //获取其中一项
    let dr = loopDt.getRow(e => e.id == 1);
```
数据表需要新建数据类继承DataRowBase，见DRLevelLoop类   


2 调用配置表
```ts
    //获取配置
    let debuLevel = GameEntry.dataTable.getConfig()["debugLevel"];
```
配置表不需要数据类

## 实体组件EntityComponent
一切动态加载的物体都可以叫实体，当前版本主要是3d预制体，2d暂不支持  
控制脚本必须继承GameEntityLogic，提供onInit、onShow、onUpdate、onHide等等生命周期，内部实现了对象池，以及预制资源的自动释放   
在重载生命周期函数时一定要***重写这些周期函数时必须调用父类方法***，  
onInit做初始化，只会调用一次，onShow在实体显示时调用，onHide在调用HideEntity后调用，因为使用了对象池，注意在onHide中重置属性
实体组件已经提供了对象池支持，以实体组为单位，实体组在启动场景的ML/BuiltIn/Entity节点配置，调用示例见EntityManager,
实体加载为异步加载，所以提供了加载完成事件

注册事件：  
```ts
GameEntry.event.on(ShowEntitySuccessEventArgs.EventId, this.onShowEntitySuccess, this);
//在合适的地方注销事件
GameEntry.event.off(ShowEntitySuccessEventArgs.EventId, this.onShowEntitySuccess, this);
```
事件回调  
```ts
private onShowEntitySuccess(sender: object, args: ShowEntitySuccessEventArgs) {
        if (!args) {
            return;
        }
        if (!args.userData) {
            return;
        }
        let entityData = args.userData as EntityData;
        if (!entityData) {
            return;
        }
        if (entityData.shower != this) {
            return;
        }
        let entity = args.entity.entityLogic;
       
    }
```
## UI组件UIComponent
 UI组件，类似EntityComonent,示例见UIManager,可自定义分配UI组，比如默认组，弹窗组，系统消息组，各个组都有自己的层级，层级越高，显示时就在越上层，比如系统消息组会永远在默认组上面，同分组下可通过配置是覆盖还是隐藏上一个界面，被覆盖或者被隐藏了都有生命周期回调
## 事件组件EventComponent
事件不用多说，只不过使用事件前需要创建了一个事件类，可能比较麻烦，使用示例可参考实体组件内的ShowEntitySuccessEventArgs
## 资源加载 ResourceComponent 
就是对assetManager的二次封装，主要给Entity和UI组件使用

## 音频AudioComponent
这个比较简单，详见AudioManager
## 引用池 ReferencePool
框架里的对象池基本只针对资源对象，引用池就是针对js对象，具体用法在实例的BulletEntityData类中有使用，应为BulletEntityData会频繁创建，不过要注意释放时机，实例中是在onHide中释放

## 流程 Procedure
是贯穿游戏运行时整个生命周期的有限状态机。通过流程，将不同的游戏状态进行解耦将是一个非常好的习惯。对于网络游戏，你可能需要如检查资源流程、更新资源流程、检查服务器列表流程、选择服务器流程、登录服务器流程、创建角色流程等流程，而对于单机游戏，你可能需要在游戏选择菜单流程和游戏实际玩法流程之间做切换。如果想增加流程，只要派生自 ProcedureBase 类并实现自己的流程类即可使用。

## 本地存储
这个不多说了

目前就只有这几个模块，demo只展示了部分功能，后续会再完善，这个框架也是边做项目边完善的