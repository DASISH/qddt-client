import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  ElementEnumAware,
  ElementKind,
  ElementRevisionRef, getElementKind,
  IElement,
  IRevisionRef, IRevisionResultEntity, Page, TemplateService,
} from '../../../lib';

@Component({
  selector: 'qddt-element-revision-select',
  // templateUrl: 'element-revision.select.component.html',
  template:
`
  <qddt-auto-complete [items]="itemList" class="black-text" *ngIf = "showAutoComplete"
    [elementKind]="kind" [autoCreate] = "false"
    (selectEvent)="onSelectElement($event)"
    (enterEvent)="onSearchElements($event)">
  </qddt-auto-complete>

  <qddt-revision-select *ngIf = "showRevisionSelect"
    [revisionRef]="revisionRef"
    (selectEvent)="onSelectedRevision($event)"
    (dismissEvent)="onDismiss($event)">
  </qddt-revision-select>
`,
})

@ElementEnumAware
export class ElementRevisionSelectComponent implements OnChanges {
  @Input() source: ElementKind|IRevisionRef;
  @Output() elementRevisionSelected = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<Boolean>();

  public itemList = null;

  public kind: ElementKind;
  public revisionRef: IRevisionRef;
  public showProgressBar: boolean;
  public showAutoComplete = false;
  public showRevisionSelect = false;

  constructor(private service: TemplateService) {  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['source'] && changes['source'].currentValue) {
      console.log('afds');
        if (this.isElementRevision(changes['source'].currentValue)) {
          this.revisionRef = changes['source'].currentValue as IRevisionRef;
          this.kind = getElementKind(this.revisionRef.elementKind);
          this.showRevisionSelect = true;
        } else {
          this.kind = getElementKind(changes['source'].currentValue);
          this.showAutoComplete = true;
          this.revisionRef = null;
        }
    }
  }

  public onSearchElements(key) {
    this.service.searchByKind( { kind:  this.kind, key: key, page: new Page() } )
    .then((result) => this.itemList = result.content);
  }

  public onSelectElement(item: IElement) {
    this.revisionRef = { elementId: item.element.id, elementKind: this.kind, elementRevision: 0 };
  }

  public onSelectedRevision(revision: IRevisionResultEntity) {
    this.elementRevisionSelected.emit(this.getRevisionRef(revision));
    this.source = null;
  }


  public onDismiss(ok) {
    this.dismissEvent.emit(ok);
  }

  private isElementRevision(kind: IRevisionRef|ElementKind): kind is IRevisionRef {
    return (kind as IRevisionRef).elementId !== undefined;
  }

  private getRevisionRef(elementRevision: IRevisionResultEntity): ElementRevisionRef {
    return new ElementRevisionRef({
      elementId: elementRevision.entity.id,
      elementRevision: elementRevision.revisionNumber,
      elementKind: this.kind,
      element: elementRevision.entity,
      name: (this.kind === ElementKind.QUESTION_CONSTRUCT) ?
        elementRevision.entity.name + ' - ' + elementRevision.entity['questionItem']['question'] : elementRevision.entity.name,
      version: elementRevision.entity.version });
  }

}
