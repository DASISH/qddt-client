import { Component, Input } from '@angular/core';
import { ControlConstruct } from '../../components/controlconstruct/controlconstruct.service';

@Component({
  selector: 'qddt-preview-controlconstruct',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="construct">
      <div [ngSwitch]="construct.controlConstructKind">
				<div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
          <qddt-preview-sequenceconstruct [sequence]="construct"></qddt-preview-sequenceconstruct>
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
  styles: [
  ],
  providers: [ ],
})

export class PreviewControlConstructComponent {
  @Input() construct: ControlConstruct;

}
