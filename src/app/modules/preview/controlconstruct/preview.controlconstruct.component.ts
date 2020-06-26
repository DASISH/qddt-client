import { Component, Input } from '@angular/core';
import { ConditionConstruct, QuestionConstruct, SequenceConstruct, StatementConstruct, Parameter } from '../../../lib';

@Component({
  selector: 'qddt-preview-controlconstruct',

  template: `
    <ng-container class="row" *ngIf="construct">
      <ng-container [ngSwitch]="construct.classKind">
				<ng-container *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
        preview-controlconstruct-SEQUENCE_CONSTRUCT
          <qddt-preview-sequenceconstruct [sequenceConstruct]="construct" [inParameters]="inParameters" ></qddt-preview-sequenceconstruct>
        </ng-container>
        <ng-container *ngSwitchCase="'CONDITION_CONSTRUCT'">
          <qddt-preview-conditionconstruct [condition]="construct" [inParameters]="inParameters" ></qddt-preview-conditionconstruct>
        </ng-container>
        <ng-container *ngSwitchCase="'STATEMENT_CONSTRUCT'">
          <qddt-preview-statementconstruct [statement]="construct" [inParameters]="inParameters" ></qddt-preview-statementconstruct>
        </ng-container>
        <ng-container *ngSwitchCase="'QUESTION_CONSTRUCT'">
            <qddt-preview-questionconstruct [controlConstruct]="construct" [inParameters]="inParameters" >
            </qddt-preview-questionconstruct>
        </ng-container>
        <ng-container *ngSwitchDefault>
          <P>UNKNOWN CONSTRUCT</P>
        </ng-container>
      </ng-container>
    </ng-container>`,
  styles: [],
})

export class PreviewControlConstructComponent {
  @Input() construct: QuestionConstruct | SequenceConstruct | ConditionConstruct | StatementConstruct;
  @Input() inParameters: Map<string, Parameter>
  @Input() showDetail = true;

}
