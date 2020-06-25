import { Component, Input } from '@angular/core';
import { ConditionConstruct, QuestionConstruct, SequenceConstruct, StatementConstruct, Parameter } from '../../../lib';

@Component({
  selector: 'qddt-preview-controlconstruct',

  template: `
    <div class="row" *ngIf="construct">
      <div [ngSwitch]="construct.classKind">
				<div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
        preview-controlconstruct-SEQUENCE_CONSTRUCT
          <qddt-preview-sequenceconstruct [sequenceConstruct]="construct" [inParameters]="inParameters" ></qddt-preview-sequenceconstruct>
        </div>
        <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
          <qddt-preview-conditionconstruct [condition]="construct" [inParameters]="inParameters" ></qddt-preview-conditionconstruct>
        </div>
        <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
          <qddt-preview-statementconstruct [statement]="construct" [inParameters]="inParameters" ></qddt-preview-statementconstruct>
        </div>
        <div *ngSwitchCase="'QUESTION_CONSTRUCT'">
            <qddt-preview-questionconstruct [controlConstruct]="construct" [inParameters]="inParameters" >
            </qddt-preview-questionconstruct>
        </div>
        <div *ngSwitchDefault>
          <P>UNKNOWN CONSTRUCT</P>
        </div>
      </div>
    </div>`,
  styles: [],
})

export class PreviewControlConstructComponent {
  @Input() construct: QuestionConstruct | SequenceConstruct | ConditionConstruct | StatementConstruct;
  @Input() inParameters: Map<string, Parameter>
  @Input() showDetail = true;

}
