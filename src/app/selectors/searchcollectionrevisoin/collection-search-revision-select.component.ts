import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import { Factory } from '../../shared/classes/factory';
import { ElementEnumAware } from '../../preview/preview.service';
import { IElement, IEntityAudit} from '../../shared/classes/interfaces';
import { ElementKind} from '../../shared/classes/enums';
import { QueryInfo} from '../../shared/classes/classes';
import { getElementKind, QDDT_QUERY_INFOES} from '../../shared/classes/constants';

@Component({
  selector: 'qddt-collection-revision-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collection-search-revision-select.component.html'
})

@ElementEnumAware
export class CollectionSearchRevisionSelectComponent implements AfterViewInit, OnChanges {
  @Input() items:  IEntityAudit[];
  @Input() labelName?: string;
  @Input() elementKind: ElementKind|string;
  @Output() itemCreatedEvent = new EventEmitter<IEntityAudit>();

  item: IEntityAudit;
  searchField: any;
  showButton = false;
  showAddItem = false;

  private queryInfo: QueryInfo;


  ngAfterViewInit() {
    if (!this.labelName) {
      this.labelName = this.queryInfo.label;
    }
  }

  hasContent(): boolean {
    return (this.item && this.searchField && this.item[this.searchField]);
  }

  onShowItems() {
    this.item = Factory.createInstance(getElementKind(this.elementKind));
    this.searchField  = this.queryInfo.fields[0];
    this.showAddItem = !this.showAddItem;
  }

  onAddItem() {
    this.showAddItem = false;
    this.itemCreatedEvent.emit(this.item);
  }

  onSelectItem(selected: IElement) {
    this.item = selected.element;
  }

  onDeleteItem(idx: number) {
    this.items.splice(idx, 1);
  }

  public getQueryInfo(): QueryInfo {
    const kind = getElementKind(this.elementKind);
    return QDDT_QUERY_INFOES.find(e => e.id === kind);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elementKind']) {
      this.queryInfo = this.getQueryInfo();
      this.labelName = this.queryInfo.label;
    }
  }

}
