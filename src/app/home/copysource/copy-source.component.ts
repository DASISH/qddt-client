import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ElementEnumAware } from '../../preview/preview.service';
import { ElementKind, QDDT_ELEMENTS, QddtElement } from '../../interfaces/elements';
import { IEntityAudit } from '../../interfaces/entityaudit';
import { HomeService } from '../home.service';


@Component({
  selector: 'qddt-copy-select',
  moduleId: module.id,
  styles:  [ ],
  templateUrl: './copy-source.component.html',
})
@ElementEnumAware
export class CopySourceComponent {
  @Input() parentId: any;
  @Input() elementKind: ElementKind;
  @Output() itemSelected = new EventEmitter<any>();

  items: any[];
  elementRevisions: any[];
  elementRevision: any;
  selectedElement: IEntityAudit;
  selectedIndex: number;

  private searchKeysSubect: Subject<string> = new Subject<string>();


  constructor(private service: HomeService) {
    this.selectedIndex = 0;
    this.items = [];
    this.elementRevisions = [];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getElementByTypeAndName(this.elementKind, name).then((result: any) => {
          this.items = result.content;
        });
      });
  }

  onSelectElementRevisions(value?: any) {
    console.log(value);
    const result = this.elementRevisions.find((e: any) => e.revisionNumber === +this.elementRevision);
    if (result) {
      this.selectedElement = result.entity;
    } else if (this.elementRevisions.length > 0) {
      this.selectedElement = this.elementRevisions[0].entity;
      this.elementRevision = this.elementRevisions[0].revisionNumber;
    }
  }

  onUseElement() {
    this.service.copySource(this.elementKind, this.selectedElement.id, this.elementRevision, this.parentId)
      .subscribe(result => {
        this.itemSelected.emit( result) ; // { id: this.selectedElement.id, rev: this.elementRevision});
      });
  }

  onSearchItems(name: string) {
    this.searchKeysSubect.next(name);
  }

  onSelectItem(item: IEntityAudit) {
    this.selectedElement = item;
    if ((item) && (item.id)) {
      this.service.getRevisionById(this.elementKind, item.id).then(
        (result: any) => {
          this.elementRevisions = result.content;
          this.onSelectElementRevisions();
      });
    }
  }

  getElementClass(kind: ElementKind): QddtElement {
    return QDDT_ELEMENTS[kind];
  }

}
