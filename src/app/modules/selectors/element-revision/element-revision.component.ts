import { delay, hasChanges } from 'src/app/lib';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  ElementEnumAware,
  ElementKind,
  ElementRevisionRef,
  getElementKind,
  IElement,
  IRevisionRef,
  QuestionConstruct,
  StatementConstruct,
  QuestionItem,
  Instruction, ElementRevisionRefImpl, IEntityEditAudit, Factory
} from '../../../lib';

@Component({
  selector: 'qddt-element-revision-select',
  template: `
  <qddt-element-select *ngIf="showAutoComplete" [source]="source" [xmlLang]="xmlLang" [formName]="" [autoCreate]="autoCreate"
    (elementSelectedEvent)="onSelectElement($event)" >
  </qddt-element-select>

  <qddt-revision-select *ngIf="showRevisionSelect"
    [revisionRef]="revisionRef"
    (selectEvent)="onSelectedRevision($event)"
    (dismissEvent)="onDismiss($event)">
  </qddt-revision-select>

`,
})

@ElementEnumAware
export class ElementRevisionComponent implements OnChanges {
  @Input() source: IElement | IRevisionRef;
  @Input() xmlLang = 'none';
  @Input() autoCreate = false;
  @Output() revisionSelectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public revisionRef: IRevisionRef;
  public showAutoComplete = false;
  public showRevisionSelect = false;

  constructor() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // if (hasChanges<IElement | IRevisionRef>(changes.source, (a1, a2) => a1.elementKind === a2.elementKind)) {
    if (hasChanges<IElement | IRevisionRef>(changes.source)) {
      const entity = changes.source.currentValue as IElement | IRevisionRef;

      if (this.isElementRevision(entity)) {
        this.revisionRef = new ElementRevisionRefImpl(entity);
        this.showRevisionSelect = true;
      } else if (this.isElement(entity)) {
        this.showAutoComplete = true;
        this.revisionRef = null;
        this.showRevisionSelect = false;
      }
    }
  }

  public onSelectElement(item: IElement) {
    if (item && item.element) {
      this.showRevisionSelect = true;
      this.revisionRef = { elementId: item.element.id, elementKind: item.elementKind, elementRevision: 0 };
    } else {
      this.showRevisionSelect = false;
      this.revisionRef = null;

    }
  }

  public onSelectedRevision(revision: IEntityEditAudit) {
    this.revisionSelectedEvent.emit(this.getRevisionRef(revision));
    this.revisionRef = null;
  }

  public onDismiss(ok: boolean) {
    this.source = null;
    this.revisionRef = null;
    delay(50).then(() => this.dismissEvent.emit(ok));
  }

  private isElementRevision(entity: IRevisionRef | IElement): entity is IRevisionRef {
    return (entity as IRevisionRef).elementId !== undefined && (entity as IRevisionRef).elementRevision !== undefined;
  }

  private isElement(entity: IRevisionRef | IElement): entity is IElement {
    return (entity as IElement).element !== undefined;
  }


  private getRevisionRef(revision: IEntityEditAudit): ElementRevisionRef {
    const kind = getElementKind(revision.classKind);
    return new ElementRevisionRefImpl<IEntityEditAudit>({
      elementId: revision.id,
      elementRevision: revision.version.rev,
      elementKind: ElementKind[kind],
      element: Factory.createFromSeed(ElementKind[kind], revision),
      version: revision.version,
      name: this.getName(kind, revision)
    });
  }

  private getName(kind: ElementKind, entity: any): string {
    const name = '<b>' + entity.name + '</b>';
    switch (kind) {
      // case ElementKind.CONDITION_CONSTRUCT:
      //   return name;
      case ElementKind.QUESTION_CONSTRUCT:
        return name + ' ➫ ' + (entity as QuestionConstruct).questionItem.question || (entity as QuestionConstruct).description;
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
