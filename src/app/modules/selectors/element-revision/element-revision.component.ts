import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  ElementEnumAware,
  ElementKind,
  ElementRevisionRef,
  getElementKind,
  IElement,
  IRevisionRef,
  IRevisionResultEntity,
  QuestionConstruct,
  StatementConstruct,
  QuestionItem,
  Instruction, ElementRevisionRefImpl, IEntityEditAudit
} from '../../../lib';

@Component({
  selector: 'qddt-element-revision-select',
  template: `
<div class="row">
  <qddt-element-select *ngIf="showAutoComplete" [source]="source" [xmlLang]="xmlLang"
    (elementSelectedEvent)="onSelectElement($event)" >
  </qddt-element-select>

  <qddt-revision-select *ngIf="showRevisionSelect"
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
  @Input() xmlLang = 'none';
  @Output() revisionSelectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public revisionRef: IRevisionRef;
  public showAutoComplete = false;
  public showRevisionSelect = false;

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.source && changes.source.currentValue) {
      const element = changes.source.currentValue;
      // console.log(changes.source.currentValue || JSON);
      if (this.isElementRevision(element)) {
        this.revisionRef = new ElementRevisionRefImpl(element);
        this.showRevisionSelect = true;
      } else if (this.isElement(element)) {
        this.showAutoComplete = true;
      }
    }
  }

  public onSelectElement(item: IElement) {
    this.showRevisionSelect = true;
    this.revisionRef = { elementId: item.element.id, elementKind: item.elementKind, elementRevision: 0 };
    // console.log(this.revisionRef || JSON);
  }

  public onSelectedRevision(revision: IRevisionResultEntity) {
    this.revisionSelectedEvent.emit(this.getRevisionRef(revision));
    // console.log(this.revisionRef || JSON);
  }

  public onDismiss(ok: boolean) {
    this.dismissEvent.emit(ok);
  }

  private isElementRevision(kind: IRevisionRef | IElement): kind is IRevisionRef {
    return (kind as IRevisionRef).elementId !== undefined && (kind as IRevisionRef).elementRevision !== undefined;
  }

  private isElement(kind: IRevisionRef | IElement): kind is IElement {
    return (kind as IElement).element !== undefined;
  }

  // private readonly conRefToString = (item): string => (isConRef(item)) ? item.condition.content : item.name || 'NULL';



  private getRevisionRef(elementRevision: IRevisionResultEntity): ElementRevisionRef {
    const kind = getElementKind(elementRevision.entity.classKind);
    return new ElementRevisionRefImpl<IEntityEditAudit>({
      elementId: elementRevision.entity.id,
      elementRevision: elementRevision.revisionNumber,
      elementKind: ElementKind[kind],
      element: elementRevision.entity,
      version: elementRevision.entity.version,
      name: this.getName(kind, elementRevision.entity)
    });
  }

  private getName(kind: ElementKind, entity: any): string {
    const name = '<b>' + entity.name + '</b>';
    switch (kind) {
      // case ElementKind.CONDITION_CONSTRUCT:
      //   return name;
      case ElementKind.QUESTION_CONSTRUCT:
        return name + ' ➫ ' + (entity as QuestionConstruct).description;
      case ElementKind.STATEMENT_CONSTRUCT:
        return name + ' ➫ ' + (entity as StatementConstruct).statement;
      case ElementKind.QUESTION_ITEM:
        return name + ' ➫ ' + (entity as QuestionItem).question;
      case ElementKind.INSTRUCTION:
        return name + ' ➫ ' + (entity as Instruction).description;
      default: return name;
    }
  }

}
