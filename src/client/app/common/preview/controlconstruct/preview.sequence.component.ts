import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-sequenceconstruct',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="sequence">
      <h5>Sequence: {{sequence?.name}}</h5>
      <span class="row">{{text}}</span>
      <div *ngFor="let child of sequence.children">
        <div [ngSwitch]="child.controlConstructionKind">
					<div *ngSwitchCase="'SequenceConstruct'">
            <qddt-preview-sequenceconstruct [sequence]="child"></qddt-preview-sequenceconstruct>
          </div>
          <div *ngSwitchCase="'LogicConstruct'">
            <qddt-preview-conditionconstruct [condition]="child"></qddt-preview-conditionconstruct>
          </div>
          <div *ngSwitchCase="'StatementConstruct'">
            <qddt-preview-statementconstruct [statement]="child"></qddt-preview-statementconstruct>
          </div>
          <div *ngSwitchCase="'QuestionConstruct'">
            <qddt-preview-questionconstruct [controlConstruct]="child">
            </qddt-preview-questionconstruct>
          </div>
        </div>
      </div>
    </div>`,
  styles: [
  ],
  providers: [ ],
})

export class PreviewSequenceConstructComponent implements OnInit {
  @Input() sequence: any;
  text: string;

  ngOnInit() {
    this.text = '';
    if(this.sequence !== null && this.sequence !== undefined) {
      this.text = this.sequence.description || '';
    }
  }

}
