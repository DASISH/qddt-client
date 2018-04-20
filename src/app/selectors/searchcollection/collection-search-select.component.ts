import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy, AfterViewInit, SimpleChanges, OnChanges} from '@angular/core';
import { ElementEnumAware } from '../../preview/preview.service';
import { Factory } from '../../shared/classes/factory';
import { IElement, IEntityAudit } from '../../shared/classes/interfaces';
import { ElementKind } from '../../shared/classes/enums';
import { QueryInfo } from '../../shared/classes/classes';
import { getElementKind, QDDT_QUERY_INFOES} from '../../shared/classes/constants';

@Component({
  selector: 'qddt-collection-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'collection-search-select.component.html'
})

@ElementEnumAware
export class CollectionSearchSelectComponent implements AfterViewInit, OnChanges {
  @Input() listItems:  IEntityAudit[];
  @Input() searchItems: IEntityAudit[];
  @Input() elementKind: ElementKind|string;
  @Input() labelName?: string;

  @Output() selectEvent = new EventEmitter<IElement>();
  @Output() searchEvent = new EventEmitter<string>();

  searchField: string;
  showButton = false;
  showAddItem = false;
  selectedItem: IElement;

  private searchString: string;

  private queryInfo: QueryInfo;

  ngAfterViewInit() {
    if (!this.labelName) {
      this.labelName = this.queryInfo.label;
    }
    this.searchField  = this.queryInfo.fields[0];
  }


  public onSelectItem(item: IElement) {
    this.selectedItem = item;
    this.onAddItem();
  }

  public onSearchElements(key: string) {
    this.searchString = key;
    this.searchEvent.emit(key);
  }

  onAddItem() {
    if (this.isNewItem()) {
      const item = Factory.createInstance(getElementKind(this.elementKind));
      item[this.searchField] = this.searchString;
      this.selectedItem = { element: item, elementKind: this.elementKind };
    }
    this.onShowItems();
    this.selectEvent.emit(this.selectedItem);
  }


  isNewItem(): boolean {
    return (  (!this.selectedItem)  || (!this.selectedItem.element));
  }

  onShowItems() {
    this.showAddItem = !this.showAddItem;
  }

  onDeleteItem(idx: number) {
    this.listItems.splice(idx, 1);
  }

  public getQueryInfo(): QueryInfo {
    const kind = getElementKind(this.elementKind);
    return QDDT_QUERY_INFOES.find(e => e.id === kind);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elementKind']) {
      this.queryInfo = this.getQueryInfo();
      this.labelName = this.queryInfo.label;
    } else if (changes['searchItems']) {
      if (!this.searchItems) { this.searchItems = []; }
    }
  }


}
