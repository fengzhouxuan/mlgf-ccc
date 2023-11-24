1.Cocos版本:3.7.3、3.7.4
2.启动场景：assets/GameLauncher.scene   
3.项目逻辑启动入口为GameMain/Procedure/GameProcedureInit.ts   
4.广告统一入口：Framework/Script/Ad/AdComponent.ts 不同平台需要写对应的helper.目前只有微信平台，且只有激励视频，需要其他类型广告，建议扩展AdComponent以及Adhelper   
5.音频入口：Framework/Script/Audio/AudioComponent.ts, 默认使用的是cocos的音频api,在微信平台使用了微信的api,其他其他平台建议新建helper继承AudioHelper(如果cocos音频没问题的话就可以直接使用DefaultAudioHelper)   
6.平台工具组件：GameMain/CustomComponent/Platform/PlatformComponent.ts ,主要是分包下载，也是使用Helper的模式

# 框架简介
框架内所有内置组件都可以通过```GameEntry```获取到实例并调用其方法，比如 ```GameEntry.entity```  
为了方便在业务层使用框架，写了一些中间类，比如EntityMananget,UIManager,AudioManager,尽量使用这些类，详情见源码
## 实体组件EntityComponent
一切动态加载的物体都可以叫实体，当前版本主要是3d预制体，2d暂不支持  
控制脚本必须继承GameEntityLogic，提供onInit、onShow、onUpdate、onHide等等生命周期，具体可以查看源码,  ***重写这些周期函数时必须调用父类方法***，  
onInit做初始化，只会调用一次，onShow在调用ShowEntity后调用，onHide在调用HideEntity后调用，因为使用了对象池，注意在onHide中重置属性
实体组件已经提供了对象池支持，以实体组为单位，实体组在启动场景的ML/BuiltIn/Entity节点配置，调用示例见EntityManager,
实体加载为异步加载，所以提供了加载完成事件

注册事件：  
```ts
GameEntry.event.on(ShowEntitySuccessEventArgs.EventId, this.onShowEntitySuccess, this);
//在合适的地方注销事件
GameEntry.event.off(ShowEntitySuccessEventArgs.EventId, this.onShowEntitySuccess, 
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
 UI组件，类似EntityComonent,示例见UIManager,
## 事件组件EventComponent
使用示例可参考实体组件内的ShowEntitySuccessEventArgs
## 资源加载 ResourceComponent 
就是对assetManager的二次封装，主要给Entity和UI组件使用
## 数据表/配置表 DataTableComponent
只支持json格式的数据表，加载数据表参考```GameProcedurePreload```类的```loadDataTables```方法
数据表示例文件在assets/GameMain/Bunldes/Share/Config/GameDatatables.json   
配置文件示例见assets/GameMain/Bunldes/Share/Config/MainConfig.json

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

## 音频AudioComponent
详见AudioManager
## 引用池 ReferencePool
框架里的对象池基本只针对资源对象，引用池就是针对js对象，具体用法在实例的BulletEntityData类中有使用，应为BulletEntityData会频繁创建，不过要注意释放时机，实例中是在onHide中释放