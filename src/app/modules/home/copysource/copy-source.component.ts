import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ElementKind, ElementRevisionRef, getQueryInfo, IElement, IEntityAudit, IPageSearch, IRevisionRef} from '../../../classes';
import { ElementEnumAware} from '../../../preview/preview.service';
import { TemplateService} from '../../../components/template';



@Component({
  selector: 'qddt-copy-select',
  styles:  [ ],
  templateUrl: './copy-source.component.html',
})
@ElementEnumAware
export class CopySourceComponent implements OnChanges {
  @Input() parentId: any;
  @Input() elementKind: ElementKind;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() dismissEvent = new EventEmitter<any>();

  items: IEntityAudit[] = [];
  revisionResults = [];
  className: string;

  constructor(private service: TemplateService) { }

  onItemSearch(item: IElement) {
    this.service.searchByKind( {kind: this.elementKind, key: item.element.name}).then(
      (result) => { this.items = result.content; }
    );
  }

  onRevisonSearch(item: IRevisionRef) {
    this.service.getByKindRevisions(this.elementKind, item.elementId).then(
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

}