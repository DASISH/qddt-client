import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ElementEnumAware } from '../../preview/preview.service';
import { Factory } from '../../shared/classes/factory';
import { IElementRef, IEntityAudit } from '../../shared/classes/interfaces';
import { ElementKind } from '../../shared/classes/enums';
import { QueryInfo } from '../../shared/classes/classes';
import { QDDT_QUERY_INFOES } from '../../shared/classes/constants';

@Component({
  selector: 'qddt-collection-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'collection-search-select.component.html'
})

@ElementEnumAware
export class CollectionSearchSelectComponent implements AfterViewInit  {
  @Input() listItems:  IEntityAudit[];
  @Input() searchItems: IEntityAudit[];
  @Input() elementKind: ElementKind|string;
  @Input() labelName?: string;

  @Output() selectEvent = new EventEmitter<IElementRef>();
  @Output() searchEvent = new EventEmitter<string>();

  searchField: string;
  showButton = false;
  showAddItem = false;
  selectedItem: IEntityAudit;


  ngAfterViewInit() {
    if (!this.labelName) {
      this.labelName = this.getElementType().label;
    }
    this.searchField  = this.getElementType().fields[0];
  }


  public onSelectItem(item: IEntityAudit) {
    this.selectedItem = item;
    if ( this.selectEvent) {
      this.selectEvent.emit( { element: item, elementKind: this.getElementKind()} );
    }
  }

  onAddItem() {
    if (! this.hasContent) {
      const item = Factory.createInstance(this.getElementKind());
      item[this.searchField] = this.selectedItem[this.searchField];
      this.listItems.push(item);
    } else {
      this.listItems.push(this.selectedItem);
    }
  }

  public onSearchElements(key: string) {
    if (this.searchEvent) {
      this.searchEvent.emit(key);
    }
  }


  hasContent(): boolean {
    return (this.selectedItem && this.searchField && this.selectedItem[this.searchField]);
  }

  onShowItems() {
//    this.item = Factory.createInstance(this.getElementKind());
    this.showAddItem = !this.showAddItem;
  }

  onDeleteItem(idx: number) {
    this.listItems.splice(idx, 1);
  }

  public getElementType(): QueryInfo {
    const kind = this.getElementKind();
    return QDDT_QUERY_INFOES[kind];
  }

  public getElementKind(): ElementKind {
    return (typeof this.elementKind === 'string') ?  ElementKind[this.elementKind] : this.elementKind ;
  }


}
