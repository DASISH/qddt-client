import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {
  ElementEnumAware,
  ElementKind,
  ElementRevisionRef,
  getQueryInfo,
  IElement,
   TemplateService
} from '../../../lib';



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

  public element: IElement;
  public className: string;

  constructor(private service: TemplateService) { }


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
    this.element = { element: '', elementKind: this.elementKind };
    this.className = getQueryInfo(this.elementKind).label;
  }

}
