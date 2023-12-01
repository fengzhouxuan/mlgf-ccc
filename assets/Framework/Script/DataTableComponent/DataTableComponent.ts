import { JsonAsset, _decorator, error } from 'cc';
import MlComponent from '../Base/MlComponent';
import MlEntry, { Constructor } from '../Base/MlEntry';
import DataRowBase from './DataRowBase';
import { ResourceComponent } from '../ResourceComponent/ResourceComponent';
import { EventComponent } from '../EventComponent/EventComponent';
import { ReferenceCollection } from '../ReferencePool/ReferenceCollection';
import { ReferencePool } from '../ReferencePool/ReferencePool';
import { LoadDataTableSuccessEventArgs } from './LoadDataTableSuccessEventArgs';
import { DataTableBase } from './DataTableBase';
import { DataTable } from './DataTable';
const { ccclass, property } = _decorator;

export declare type DataTableInstance<T> = { [key: string]: T };

@ccclass('DataTableComponent')
export class DataTableComponent extends MlComponent {

    private _tables: Map<Constructor<DataRowBase>, DataTableBase>;
    private _config:object;
    private _resComponent: ResourceComponent;
    private _eventComponent: EventComponent;
    private _loadDataTableSuccessEventArgsReferencePool: ReferenceCollection;
    protected start(): void {
        this._tables = new Map<Constructor<DataRowBase>, DataTableBase>;
        this._resComponent = MlEntry.getComponent(ResourceComponent);
        this._eventComponent = MlEntry.getComponent(EventComponent);
        this._loadDataTableSuccessEventArgsReferencePool = ReferencePool.create(LoadDataTableSuccessEventArgs.EventId);
    }

    public getConfig<T>():T{
        return this._config as T;
    }

    public getDataTable<T extends DataRowBase>(drCtor: Constructor<T>): DataTable<T> {
        if (!this._tables.has(drCtor)) {
            return null;
        }
        return this._tables.get(drCtor) as DataTable<T>;
    }

    public hasDataTable(drCtor: Constructor<DataRowBase>): boolean {
        return this._tables.has(drCtor);
    }

    public loadConfig(bundleName: string, configName: string){
        this._resComponent.LoadResInBundle(bundleName, configName, JsonAsset, null,
            (finish: number, total: number) => {

            },
            (error: Error, res: JsonAsset) => {
                if (error) {
                    return;
                }
                let json = res.json;
                this._config = json;
                let loadDataTableSuccessEventArgs = this._loadDataTableSuccessEventArgsReferencePool.acquire(LoadDataTableSuccessEventArgs).initialize(configName);
                this._eventComponent.emit(this, loadDataTableSuccessEventArgs);
            });
    }

    public loadDataTable<T extends DataRowBase>(bundleName: string, tableName: string, ctor: Constructor<T>) {
        if (this.hasDataTable(ctor)) {
            return;
        }
        this._resComponent.LoadResInBundle(bundleName, tableName, JsonAsset, null,
            (finish: number, total: number) => {

            },
            (error: Error, res: JsonAsset) => {
                if (error) {
                    return;
                }
                let json = res.json;
                this.addDataTable<T>(tableName,ctor,json);
                let loadDataTableSuccessEventArgs = this._loadDataTableSuccessEventArgsReferencePool.acquire(LoadDataTableSuccessEventArgs).initialize(tableName);
                this._eventComponent.emit(this, loadDataTableSuccessEventArgs);
            });
    }

    public loadDataTableWithMergedJsons(bundle: string, configAssetName: string, configNames: string[], drs: Constructor<DataRowBase>[]) {
        this._resComponent.LoadResInBundle(bundle, configAssetName, JsonAsset, null,
            (finish: number, total: number) => {

            },
            (error: Error, res: JsonAsset) => {
                if (error) {
                    return;
                }
                let json = res.json;
                for (let i = 0; i < configNames.length; i++) {
                    const configName = configNames[i];
                    this.addDataTable(configName, drs[i], json[configName]);
                }
                let loadDataTableSuccessEventArgs = this._loadDataTableSuccessEventArgsReferencePool.acquire(LoadDataTableSuccessEventArgs).initialize(configAssetName);
                this._eventComponent.emit(this, loadDataTableSuccessEventArgs);
            });
    }

    public addDataTable<T extends DataRowBase>(tableName:string,ctor: Constructor<T>,jsonData:object):DataTable<T>{
        let data = jsonData as T[];
        let dataTable = new DataTable<T>();
        dataTable.setRow(data);
        this._tables.set(ctor, dataTable);
        return dataTable;
    }
}

