import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  ElementEnumAware,
  ElementKind,
  ElementRevisionRef, getElementKind,
  IElement,
  IRevisionRef, IRevisionResultEntity, Page, QuestionConstruct, TemplateService,
} from '../../../lib';

@Component({
  selector: 'qddt-element-revision-select',
  template: `
<qddt-element-select *ngIf = "showAutoComplete" [source]="kind" (elementSelectedEvent)="onSelectElement($event)" >

</qddt-element-select>

<qddt-revision-select *ngIf = "showRevisionSelect"
  [revisionRef]="revisionRef"
  (selectEvent)="onSelectedRevision($event)"
  (dismissEvent)="onDismiss($event)">
</qddt-revision-select>
`,
})

@ElementEnumAware
export class ElementRevisionComponent implements OnChanges {
  @Input() source: ElementKind | IRevisionRef;
  @Output() revisionSelectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public itemList = null;

  public kind: ElementKind;
  public revisionRef: IRevisionRef;
  public showProgressBar: boolean;
  public showAutoComplete = false;
  public showRevisionSelect = false;

  constructor(private service: TemplateService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.source && changes.source.currentValue) {
      console.log('afds');
      if (this.isElementRevision(changes.source.currentValue)) {
        this.revisionRef = changes.source.currentValue as IRevisionRef;
        this.kind = getElementKind(this.revisionRef.elementKind);
        this.showRevisionSelect = true;
      } else {
        this.kind = getElementKind(changes.source.currentValue);
        this.showAutoComplete = true;
        this.revisionRef = null;
      }
    }
  }

  public onSearchElements(key) {
    this.service.searchByKind({ kind: this.kind, key, page: new Page() })
      .then((result) => this.itemList = result.content);
  }

  public onSelectElement(item: IElement) {
    this.revisionRef = { elementId: item.element.id, elementKind: this.kind, elementRevision: 0 };
    this.showRevisionSelect = true;
  }

  public onSelectedRevision(revision: IRevisionResultEntity) {
    console.log('ElementRevisionComponent.onSelectedRevision');
    this.revisionSelectedEvent.emit(this.getRevisionRef(revision));
    this.source = null;
  }

  public onDismiss(ok) {
    this.dismissEvent.emit(ok);
  }

  private isElementRevision(kind: IRevisionRef | ElementKind): kind is IRevisionRef {
    return (kind as IRevisionRef).elementId !== undefined;
  }

  private getRevisionRef(elementRevision: IRevisionResultEntity): ElementRevisionRef {
    return new ElementRevisionRef({
      elementId: elementRevision.entity.id,
      elementRevision: elementRevision.revisionNumber,
      elementKind: this.kind,
      element: elementRevision.entity,
      name: (this.kind === ElementKind.QUESTION_CONSTRUCT) ?
        elementRevision.entity.name + ' - ' + (elementRevision.entity as QuestionConstruct).questionItem.question :
        elementRevision.entity.name,
      version: elementRevision.entity.version
    });
  }

}
