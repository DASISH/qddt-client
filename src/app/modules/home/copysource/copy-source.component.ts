import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { ElementKind, ElementRevisionRef, getQueryInfo, IElement, IRevisionRef} from '../../../classes';
import { HomeService} from '../home.service';
import { ElementEnumAware} from '../../../preview/preview.service';



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

  items = [];
  revisionResults = [];
  className: string;

  constructor(private service: HomeService<any>) { }

  onItemSearch(item: IElement) {
    this.service.getElementByName(this.elementKind, item.element).then(
      (result: any) => { this.items = result.content; }
    );
  }

  onRevisonSearch(item: IRevisionRef) {
    this.service.getRevisionsById(this.elementKind, item.elementId).then(
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
