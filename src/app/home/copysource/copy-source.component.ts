import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ElementEnumAware } from '../../preview/preview.service';
import { HomeService } from '../home.service';
import { ElementKind } from '../../shared/classes/enums';
import { IEntityAudit } from '../../shared/classes/interfaces';
import { QueryInfo } from '../../shared/classes/classes';
import { QDDT_QUERY_INFOES } from '../../shared/classes/constants';


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

  private searchKeysListener: Subject<string> = new Subject<string>();


  constructor(private service: HomeService) {
    this.selectedIndex = 0;
    this.items = [];
    this.elementRevisions = [];
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getElementByTypeAndName(this.elementKind, name).then(
          (result: any) => { this.items = result.content; }
          );
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
    this.searchKeysListener.next(name);
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

  getElementClass(kind: ElementKind): QueryInfo {
    return QDDT_QUERY_INFOES[kind];
  }

}
