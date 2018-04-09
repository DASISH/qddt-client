import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy, AfterViewInit, OnInit} from '@angular/core';
import { ElementKind, IElementRef, QDDT_ELEMENTS, QddtElement } from '../../shared/elementinterfaces/elements';
import { IEntityAudit } from '../../shared/elementinterfaces/entityaudit';
import { Factory } from '../../shared/elementfactory/factory';
import { Subject } from 'rxjs/Subject';
import { SelectorsService } from '../selectors.service';

@Component({
  selector: 'qddt-collection-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'collection-search-select.component.html'
})

export class CollectionSearchSelectComponent implements AfterViewInit , OnInit {
  @Input() items:  IEntityAudit[];
  @Input() labelName?: string;
  @Input() elementKind: ElementKind|string;
  @Output() selectedElement: EventEmitter<IElementRef>;

  item: IEntityAudit;
  searchField: string;
  showButton = false;
  showAddItem = false;

  public elements: any[];

  private searchKeysListener: Subject<string> = new Subject<string>();

  constructor(private service: SelectorsService ) {
    this.elements = [];
    console.log(this.searchKeysListener);
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((searchString: string) => {
        console.log('search ' + searchString);
        this.service.searchItems(this.getElementKind(), searchString).then(
          (result: any) => { this.elements = result.content; },
          (error) => { throw error; });
      },
        (error1) => console.log('WTF??? ' + error1) );
  }

  public onSelectElement(item: IEntityAudit) {
    if ( this.selectedElement) {
      this.selectedElement.emit( { element: item, elementKind: this.getElementKind()} );
    }
  }

  public onSearchElements(key: string) {
    this.searchKeysListener.next(key);
  }

  ngOnInit(): void {
    if (!this.labelName) {
      this.labelName = this.getElementType().label;
    }
    this.searchField  = this.getElementType().fields[0];
  }

  ngAfterViewInit() {
    if (!this.labelName) {
      this.labelName = this.getElementType().label;
    }
    this.searchField  = this.getElementType().fields[0];
    console.log(this.labelName);
  }

  hasContent(): boolean {
    return (this.item && this.searchField && this.item[this.searchField]);
  }

  onShowItems() {
    this.item = Factory.createInstance(this.getElementKind());
    this.showAddItem = !this.showAddItem;
    console.log(this.searchField + ' - ' + this.item.classKind);
  }

  onSelectItem(selected: IElementRef) {
    this.item = selected.element;
    console.log('onSelectItem ' + this.item);
  }

  onDeleteItem(idx: number) {
    this.items.splice(idx, 1);
  }

  public getElementType(): QddtElement {
    const kind = this.getElementKind();
    return QDDT_ELEMENTS[kind];
  }

  public getElementKind(): ElementKind {
    return (typeof this.elementKind === 'string') ?  ElementKind[this.elementKind] : this.elementKind ;
  }


}
