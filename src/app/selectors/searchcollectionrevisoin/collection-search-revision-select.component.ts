import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy, AfterViewInit} from '@angular/core';
import { ElementKind, IElementRef, QDDT_ELEMENTS, QddtElement } from '../../shared/elementinterfaces/elements';
import { IEntityAudit } from '../../shared/elementinterfaces/entityaudit';
import { Factory } from '../../shared/elementfactory/factory';
import { ElementEnumAware } from '../../preview/preview.service';

@Component({
  selector: 'qddt-collection-revision-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collection-search-revision-select.component.html'
})

@ElementEnumAware
export class CollectionSearchRevisionSelectComponent implements AfterViewInit {
  @Input() items:  IEntityAudit[];
  @Input() labelName?: string;
  @Input() elementKind: ElementKind|string;
  @Output() itemCreatedEvent = new EventEmitter<IEntityAudit>();

  item: IEntityAudit;
  searchField: any;
  showButton = false;
  showAddItem = false;


  ngAfterViewInit() {
    if (!this.labelName) {
      this.labelName = this.getElementType().label;
    }
  }

  hasContent(): boolean {
    return (this.item && this.searchField && this.item[this.searchField]);
  }

  onShowItems() {
    this.item = Factory.createInstance(this.getElementKind());
    this.searchField  = this.getElementType().fields[0];
    this.showAddItem = !this.showAddItem;
  }

  onAddItem() {
    this.showAddItem = false;
    this.itemCreatedEvent.emit(this.item);
  }

  onSelectItem(selected: IElementRef) {
    this.item = selected.element;
  }

  onDeleteItem(idx: number) {
    this.items.splice(idx, 1);
  }

  public getElementType(): QddtElement {
    const kind = this.getElementKind();
    return QDDT_ELEMENTS.find(e => e.id === kind);
  }

  public getElementKind(): ElementKind {
    return (typeof this.elementKind === 'string') ?  ElementKind[this.elementKind] : this.elementKind ;
  }
}
