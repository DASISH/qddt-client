import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ElementKind, QddtElement, IElementRef, QDDT_ELEMENTS} from '../../shared/elementinterfaces/elements';
import { IEntityAudit } from '../../shared/elementinterfaces/entityaudit';
import { SelectorsService } from '../selectors.service';

@Component({
  selector: 'qddt-item-search',
  moduleId: module.id,
  templateUrl: './item-search.component.html',
})

export class ItemSearchComponent {
  @Input() elementKind: ElementKind|string;
  @Output() selectedElement: EventEmitter<IElementRef>;

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

  public getElementType(): QddtElement {
    const kind = this.getElementKind();
    return QDDT_ELEMENTS[kind];
  }

  public getElementKind(): ElementKind {
    return (typeof this.elementKind === 'string') ?  ElementKind[this.elementKind] : this.elementKind ;
  }

}
