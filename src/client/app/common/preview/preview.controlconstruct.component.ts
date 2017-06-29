import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-controlconstruct',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="construct">
      <div [ngSwitch]="construct.controlConstructKind">
				<div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
          <qddt-preview-sequence [sequence]="construct"></qddt-preview-sequence>
        </div>
        <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
          <qddt-preview-condition [condition]="construct"></qddt-preview-condition>
        </div>
        <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
          <qddt-preview-statement [statement]="construct"></qddt-preview-statement>
        </div>
        <div *ngSwitchCase="'QUESTION_CONSTRUCT'">
          <qddt-preview-questionconstruct [controlConstruct]="construct">
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
  @Input() construct: any;

}
