import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-construct-preview',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="construct">
      <div [ngSwitch]="construct.controlConstructKind">
				<div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
          <qddt-sequence-preview [sequence]="construct"></qddt-sequence-preview>
        </div>
        <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
          <qddt-condition-preview [condition]="construct"></qddt-condition-preview>
        </div>
        <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
          <qddt-statement-preview [statement]="construct"></qddt-statement-preview>
        </div>
        <div *ngSwitchDefault>
          <qddt-control-construct-preview [controlConstruct]="construct">
          </qddt-control-construct-preview>
        </div>
      </div>
    </div>`,
  styles: [
  ],
  providers: [ ],
})

export class ConstructPreviewComponent {
  @Input() construct: any;

}
