import { Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { QDDT_ELEMENTS, QddtElement } from '../../interfaces/elements';
import { IEntityAudit } from '../../interfaces/entityaudit';

@Component({
  selector: 'qddt-item-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'item-search-select.component.html'
})

export class ItemSearchSelectComponent {
  @Input() items:  IEntityAudit[];
  @Input() searchItems: IEntityAudit[];
  @Input() qddtType: QddtElement;

  @Output() searchEvent =  new EventEmitter<string>();
  @Output() itemCreatedEvent = new EventEmitter<IEntityAudit>();

  item: any;
  searchField: any;
  showButton = false;
  showAddItem = false;

  constructor() {
    this.item = new Object;
    this.searchField = 'description';
  }

  hasContent(): boolean {
    return (this.item && this.searchField && this.item[this.searchField]);
  }

  onShowItems() {
    this.onSearchItem('');
    this.searchField = this.qddtType.fields[0];
    this.showAddItem = !this.showAddItem;
  }

  onAddItem() {
    this.showAddItem = false;
    this.itemCreatedEvent.emit(this.item);
  }

  onSelectItem(selecteditem: IEntityAudit) {
    this.item = selecteditem;
  }

  onSearchItem(key: string) {
    if (this.item) {
      this.item[this.searchField] = key;
    }
    this.searchEvent.emit(key);
  }

  onDeleteItem(idx: number) {
    this.items.splice(idx, 1);
  }
}
