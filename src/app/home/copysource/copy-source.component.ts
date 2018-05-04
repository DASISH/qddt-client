import {Component, EventEmitter, Input, Output } from '@angular/core';
import { ElementEnumAware } from '../../preview/preview.service';
import { HomeService } from '../home.service';
import { ElementKind } from '../../shared/classes/enums';
import {IElement, IRevisionRef} from '../../shared/classes/interfaces';
import {ElementRevisionRef, QueryInfo} from '../../shared/classes/classes';
import {QDDT_QUERY_INFOES} from '../../shared/classes/constants';


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
  @Output() dismissEvent = new EventEmitter<any>();

  items: any[];
  revisionResults: any[];

  constructor(private service: HomeService) {
    this.items = [];
    this.revisionResults = [];
  }

  onItemSearch(item: IElement) {
    this.service.getElementByTypeAndName(this.elementKind, item.element).then(
      (result: any) => { this.items = result.content; }
    );
  }

  onRevisonSearch(item: IRevisionRef) {
    this.service.getRevisionById(this.elementKind, item.elementId).then(
      (result: any) => {
        this.revisionResults = result.content;
    });
  }

  onRevisionSelect(rev: ElementRevisionRef) {
    this.service.copySource(this.elementKind, rev.elementId, rev.elementRevision, this.parentId)
      .subscribe(result => {
        this.itemSelected.emit( result) ; // { id: this.selectedElement.id, rev: this.elementRevision});
      });
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

  getElementClass(kind: ElementKind): QueryInfo {
    return QDDT_QUERY_INFOES[kind];
  }
}
