import { Component, Input } from '@angular/core';
import { QuestionConstruct } from '../../controlconstruct/controlconstruct.classes';

@Component({
  selector: 'qddt-preview-controlconstruct',

  template: `
    <div class="row" *ngIf="construct">
      <div [ngSwitch]="construct.classKind">
				<div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
          <qddt-preview-sequenceconstruct [sequenceConstruct]="construct"></qddt-preview-sequenceconstruct>
        </div>
        <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
          <qddt-preview-conditionconstruct [condition]="construct"></qddt-preview-conditionconstruct>
        </div>
        <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
          <qddt-preview-statementconstruct [statement]="construct"></qddt-preview-statementconstruct>
        </div>
        <div *ngSwitchCase="'QUESTION_CONSTRUCT'">
            <qddt-preview-questionconstruct [controlConstruct]="construct" >
            </qddt-preview-questionconstruct>
        </div>
        <div *ngSwitchDefault>
          <P>UNKNOWN CONSTRUCT</P>
        </div>
      </div>
    </div>`,
  styles: [ ],
})

export class PreviewControlConstructComponent {
  @Input() construct: QuestionConstruct;
  @Input() showDetail = true;

}
