import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  ElementKind, ConditionConstruct, QuestionConstruct,
  SequenceConstruct, StatementConstruct, Parameter, UserResponse, IEntityAudit
} from '../../../lib';

@Component({
  selector: 'qddt-preview-controlconstruct',
  styles: [
    ':host ::ng-deep .row { min-height: 1rem; margin-left: auto; margin-right: auto; margin-bottom: 2px; }',
    '.row .col { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    'collapsible-header { display: flow-root; margin-bottom: 0px; margin-left: unset; }'
  ],
  template: `
<div  *ngIf="construct" style="color: dimgrey">
  <ng-container [ngSwitch]="construct.classKind">
    <ng-container *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
      <qddt-preview-sequenceconstruct [sequenceConstruct]="construct" [inParameters]="inParameters" ></qddt-preview-sequenceconstruct>
    </ng-container>
    <ng-container *ngSwitchCase="'CONDITION_CONSTRUCT'">
      <qddt-preview-conditionconstruct [construct]="construct" [inParameters]="inParameters" ></qddt-preview-conditionconstruct>
    </ng-container>
    <ng-container *ngSwitchCase="'STATEMENT_CONSTRUCT'">
      <qddt-preview-statementconstruct [statement]="construct" [inParameters]="inParameters" ></qddt-preview-statementconstruct>
    </ng-container>
    <ng-container *ngSwitchCase="'QUESTION_CONSTRUCT'">
        <qddt-preview-questionconstruct [controlConstruct]="construct" [inParameters]="inParameters" [showDetail]="showDetail" (selectedEvent)="onModified($event)" >
        </qddt-preview-questionconstruct>
    </ng-container>
    <ng-container *ngSwitchDefault>
      <P>UNKNOWN CONSTRUCT</P>
    </ng-container>
  </ng-container>

  <qddt-download *ngIf="hideElement(construct)" [entity]="construct" [readonly]="true" [isHidden]="!showDetail">
  </qddt-download>
</div>
`,
})

export class PreviewControlConstructComponent {
  @Input() construct: QuestionConstruct | SequenceConstruct | ConditionConstruct | StatementConstruct;
  @Input() inParameters: Map<string, Parameter>
  @Input() showDetail = true;
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();

  public revisionIsVisible = false;
  private readonly hide = [ElementKind.AGENCY, ElementKind.AUTHOR, ElementKind.CONDITION_CONSTRUCT,
  ElementKind.INSTRUCTION, ElementKind.STATEMENT_CONSTRUCT, ElementKind.INSTRUCTION];

  public onModified(event: UserResponse[]) {
    console.log(event);
    this.selectedEvent.emit(event);
  }

  public hideElement(element: IEntityAudit): boolean {
    const idx = this.getElementKind(element).valueOf();
    const result = this.hide.findIndex(p => p.valueOf() === idx);
    return (result < 0);
  }

  public getElementKind(element: IEntityAudit): ElementKind {
    return ElementKind[element.classKind];
  }


}
