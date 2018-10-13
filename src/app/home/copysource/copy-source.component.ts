import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { ElementEnumAware } from '../../preview/preview.service';
import { HomeService } from '../home.service';
import { ElementKind, ElementRevisionRef, IElement, IRevisionRef, getQueryInfo } from '../../shared/classes';



@Component({
  selector: 'qddt-copy-select',
  moduleId: module.id,
  styles:  [ ],
  templateUrl: './copy-source.component.html',
})
@ElementEnumAware
export class CopySourceComponent implements OnChanges {
  @Input() parentId: any;
  @Input() elementKind: ElementKind;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() dismissEvent = new EventEmitter<any>();

  items = [];
  revisionResults = [];
  className: string;

  constructor(private service: HomeService) { }

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

  ngOnChanges(changes: SimpleChanges): void {
    this.className = getQueryInfo(this.elementKind).label;
  }

  // getElementClass(kind: ElementKind) {
  //   return getQueryInfo(kind);
  // }
}
