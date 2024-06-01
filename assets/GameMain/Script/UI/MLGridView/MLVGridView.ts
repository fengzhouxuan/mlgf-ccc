import { _decorator, Component, math, Node, NodeEventType,ScrollView, UITransform, Vec2, Vec3 } from 'cc';
import { MLGridCellView } from './MLGridCellView';
import { MLGridCellViewPool } from './MLGridCellViewPool';
const { ccclass, property } = _decorator;
export interface VGridViewDelegate {
    numberOfCells(grid: MLVGridView): number;
    numberOfRow(grid: MLVGridView): number;
    sizeOfCell(grid: MLVGridView): Vec2;
    spaceOfCell(grid: MLVGridView): Vec2;
    cellOfIndex(grid: MLVGridView, index: number, reuseCell: MLGridCellView): MLGridCellView;
}
const reusePosition = new Vec3();
@ccclass('MLVGridView')
export class MLVGridView extends Component {
    @property(Node) itemTemplate: Node;
    @property offsetTop = 0;
    @property offsetBottom = 0;
    private _scrollView: ScrollView;
    private _contentView: UITransform;
    private _viewTrans: UITransform;
    private _itemPool: MLGridCellViewPool = new MLGridCellViewPool();
    private _visibleHeight: number=0;
    private _visibleCells = new Map<number, MLGridCellView>();
    private _delegate: VGridViewDelegate;

    private lastY: number = Number.MIN_SAFE_INTEGER;

    public get visibleHeight(): number {
        return this._visibleHeight;
    }


    public get visibleCells(): Map<number, MLGridCellView> {
        return this._visibleCells;
    }

    public set delegate(v: VGridViewDelegate) {
        this._delegate = v;
    }

    protected onLoad(): void {
        this._scrollView = this.getComponent(ScrollView);
        this._contentView = this._scrollView.content.getComponent(UITransform);
        this._viewTrans = this._scrollView.content.parent.getComponent(UITransform);
    }

    protected onEnable(): void {
        this._viewTrans.node.on(NodeEventType.SIZE_CHANGED, this._calculateProp, this);
    }

    protected onDisable(): void {
        this._viewTrans.node.off(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
    }

    private onSizeChanged() {
        this._calculateProp();
        this.layout();
    }

    private _calculateProp(){
        this._visibleHeight = this._viewTrans.height;
    }

    reload(scrollToTop: boolean = false) {
       this._calculateProp();
        let cellNumber = this.numberOfCells();
        let numberOfRows = this.numberOfRow();
        let sizeOfCell = this.sizeOfCell();
        let spaceOfCell = this.spaceOfCell();
        let line = Math.ceil(cellNumber / numberOfRows);
        let totalHeight = line * sizeOfCell.y + (line - 1) * spaceOfCell.y;
        this._contentView.height = totalHeight + this.offsetTop + this.offsetBottom;

        let sortedMap = new Map([...this._visibleCells.entries()].sort((a, b) => b[0] - a[0]));        
        for (const [key, value] of sortedMap) {
            if(value){
                this._itemPool.put(value);
            }
        }
        this._visibleCells.clear();
        this._scrollView.stopAutoScroll();
        if (scrollToTop) {
            this._scrollView.scrollToTop(0, false);
        }
        this.layout();
    }

    scrollToTop() {
        this._scrollView.scrollToTop(0, false);
    }

    scrollToIndex(index: number, time = 0, center: boolean = true) {
        let numberOfRows = this.numberOfRow();
        let sizeOfCell = this.sizeOfCell();
        let spaceOfCell = this.spaceOfCell();

        let lineIndexOfIndex = Math.ceil(index / numberOfRows);
        let allCellHeight = lineIndexOfIndex * sizeOfCell.y;
        let totalOffset = lineIndexOfIndex <= 0 ? 0 : (lineIndexOfIndex - 1) * spaceOfCell.y;
        let contentHeight = allCellHeight + totalOffset + this.offsetTop + this.offsetBottom;
        let maxOffset = this._scrollView.getMaxScrollOffset().y;
        if (center) {
            let visibleHeight = this._visibleHeight;
            contentHeight -= visibleHeight / 2;
        }
        if (contentHeight < 0) {
            contentHeight = 0;
        }
        if (contentHeight >= maxOffset) {
            contentHeight = maxOffset;
        }
        let percent = 1 - contentHeight / maxOffset;
        this._scrollView.stopAutoScroll();
        this._scrollView.scrollToPercentVertical(percent, time, true);

    }

    protected lateUpdate(dt: number): void {
        let y = Math.floor(this.getMyScrollOffsetY());
        if (this.lastY != y) {
            if (y < 0) {
                y = 0;
            }
            if (y > this._contentView.height) {
                y = this._contentView.height;
            }
            this.lastY = y;
            this.layout();
        }
    }

    private layout() {

        this.getVisibleCellIndex(this.lastY);
        this._visibleCells.forEach((cell, index) => {
            if (!this._visibleItemIndex.has(index)) {
                this._itemPool.put(cell);
                this._visibleCells.delete(index);
            }
        });
        this._visibleItemIndex.forEach((index) => {
            if (!this._visibleCells.has(index)) {
                let reuseCell = this._itemPool.get();
                let cell = this.cellOfIndex(index, reuseCell);
                this._visibleCells.set(index, cell);
                cell.node.getPosition(reusePosition);
                let line = Math.floor(index / this.numberOfRow());
                let row = index % this.numberOfRow();
                let sizeOfCell = this.sizeOfCell();
                let spaceOfCell = this.spaceOfCell();
                reusePosition.x = row * (sizeOfCell.x + spaceOfCell.x) + sizeOfCell.x / 2 - this._contentView.width * this._contentView.anchorPoint.x;
                reusePosition.y = -line * (sizeOfCell.y + spaceOfCell.y) - sizeOfCell.y / 2 - this.offsetTop;
                cell.node.setPosition(reusePosition);
                cell.node.parent = this._scrollView.content;
            }
        });
        // }
    }
    _visibleItemIndex = new Set<number>();
    private getVisibleCellIndex(scrollOffsetY: number) {
        this._visibleItemIndex.clear();

        let cellNumber = this.numberOfCells();
        let numberOfRows = this.numberOfRow();
        let sizeOfCell = this.sizeOfCell();
        let spaceOfCell = this.spaceOfCell();

        let minIndex = Math.floor((scrollOffsetY - this.offsetTop) / (sizeOfCell.y + spaceOfCell.y)) * numberOfRows;
        minIndex = math.clamp(minIndex, 0, cellNumber - 1);
        let maxCount = Math.ceil((scrollOffsetY + this._visibleHeight + this.offsetBottom) / (sizeOfCell.y + spaceOfCell.y)) * numberOfRows;
        maxCount = math.clamp(maxCount, 0, cellNumber);
        for (let i = minIndex; i < maxCount; i++) {
            this._visibleItemIndex.add(i);
        }
    }

    private getMyScrollOffsetY() {
        let scrollOffset = this._contentView.node.position.y - this._viewTrans.height * this._viewTrans.anchorPoint.y;
        return scrollOffset;
    }

    private numberOfCells(): number {
        if (this._delegate) {
            return this._delegate.numberOfCells(this);
        }
        return 0;
    }

    private numberOfRow(): number {
        if (this._delegate) {
            return this._delegate.numberOfRow(this);
        }
        return 1;
    }

    private sizeOfCell(): Vec2 {
        if (this._delegate) {
            return this._delegate.sizeOfCell(this);
        }
        return new Vec2(0, 0);
    }
    private spaceOfCell(): Vec2 {
        if (this._delegate) {
            return this._delegate.spaceOfCell(this);
        }
        return new Vec2(0, 0);
    }

    private cellOfIndex(index: number, reuseCell: MLGridCellView): MLGridCellView {
        if (this._delegate) {
            return this._delegate.cellOfIndex(this, index, reuseCell);
        }
        return null;
    }
}

