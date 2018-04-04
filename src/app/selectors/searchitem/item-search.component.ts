import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {ElementKind, QddtElement, IElementRef, QDDT_ELEMENTS} from '../../shared/elementinterfaces/elements';

import { IEntityAudit } from '../../shared/elementinterfaces/entityaudit';
import {SelectorsService} from '../selectors.service';

@Component({
  selector: 'qddt-item-search',
  moduleId: module.id,
  templateUrl: './item.search.component.html',
})

export class ItemSearchComponent {
  @Input() classKind: string;
  @Output() selectedElement: EventEmitter<IElementRef>;

  public elements: any[];

  private searchKeysSubject = new Subject<string>();

  constructor(private service: SelectorsService ) {
    this.elements = [];
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((searchString: string) => {
        this.service.searchItems(this.getElementKind(), searchString).then(
          (result: any) => { this.elements = result.content;},
          (error) => { throw error; });
      });
  }

  public onSelectElement(item: IEntityAudit) {
    if ( this.selectedElement) {
      this.selectedElement.emit( { element: item, elementKind: this.getElementKind()} );
    }
  }

  public onSearchElements(key: string) {
    this.searchKeysSubject.next(key);
  }

  public getElementType(kind?: ElementKind): QddtElement {
    kind = (!kind) ? this.getElementKind() : kind;
    return QDDT_ELEMENTS.find(e => e.id === kind);
  }

  public getElementKind(): ElementKind {
    return ElementKind[this.classKind];
  }


}
