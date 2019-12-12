import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {
  ElementEnumAware,
  ElementKind,
  ElementRevisionRef,
  getElementKind,
  IElement,
  IRevisionRef,
  IRevisionResultEntity,
  QuestionConstruct,
} from '../../../lib';

@Component({
  selector: 'qddt-element-revision-select',
  template: `
<div class="row">
  <qddt-element-select *ngIf = "showAutoComplete" [source]="source"
    (elementSelectedEvent)="onSelectElement($event)" >
  </qddt-element-select>

  <qddt-revision-select *ngIf = "showRevisionSelect"
    [revisionRef]="revisionRef"
    (selectEvent)="onSelectedRevision($event)"
    (dismissEvent)="onDismiss($event)">
  </qddt-revision-select>
</div>
`,
})

@ElementEnumAware
export class ElementRevisionComponent implements OnChanges {
  @Input() source: IElement | IRevisionRef;
  @Output() revisionSelectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public revisionRef: IRevisionRef;
  public showAutoComplete = false;
  public showRevisionSelect = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.source && changes.source.currentValue) {
      if (this.isElementRevision(changes.source.currentValue)) {
        this.revisionRef = changes.source.currentValue as IRevisionRef;
        this.showRevisionSelect = true;
      } else if (this.isElement(changes.source.currentValue)) {
        this.showAutoComplete = true;
        this.revisionRef = null;
      }
    }
  }

  public onSelectElement(item: IElement) {
    this.showRevisionSelect = true;
    this.revisionRef =  { elementId: item.element.id, elementKind: item.elementKind, elementRevision: 0 };
    console.log(this.revisionRef || JSON);
  }

  public onSelectedRevision(revision: IRevisionResultEntity) {
    this.revisionSelectedEvent.emit(this.getRevisionRef(revision));
    console.log(this.revisionRef || JSON);
  }

  public onDismiss(ok) {
    this.dismissEvent.emit(ok);
  }

  private isElementRevision(kind: IRevisionRef | IElement): kind is IRevisionRef {
    return (kind as IRevisionRef).elementId !== undefined;
  }

  private isElement(kind: IRevisionRef | IElement): kind is IElement {
    return (kind as IElement).element !== undefined;
  }

  private getRevisionRef(elementRevision: IRevisionResultEntity): ElementRevisionRef {
    const kind = getElementKind(elementRevision.entity.classKind);
    return new ElementRevisionRef({
      elementId: elementRevision.entity.id,
      elementRevision: elementRevision.revisionNumber,
      elementKind:  ElementKind[kind],
      element: elementRevision.entity,
      name: (kind === ElementKind.QUESTION_CONSTRUCT) ?
        elementRevision.entity.name + ' - ' + (elementRevision.entity as QuestionConstruct).questionItem.question :
        elementRevision.entity.name,
      version: elementRevision.entity.version
    });
  }

}
