import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qddt-sequence-preview',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="sequence">
      <h5>Sequence: {{sequence?.name}}</h5>
      <span class="row">{{text}}</span>
      <div *ngFor="let child of sequence.children">
        <div [ngSwitch]="child.controlConstructionKind">
					<div *ngSwitchCase="'SequenceConstruct'">
            <qddt-sequence-preview [sequence]="child"></qddt-sequence-preview>
          </div>
          <div *ngSwitchCase="'LogicConstruct'">
            <qddt-condition-preview [condition]="child"></qddt-condition-preview>
          </div>
          <div *ngSwitchCase="'StatementConstruct'">
            <qddt-statement-preview [statement]="child"></qddt-statement-preview>
          </div>
          <div *ngSwitchCase="'QuestionConstruct'">
            <qddt-control-construct-preview [controlConstruct]="child">
            </qddt-control-construct-preview>
          </div>
        </div>
      </div>
    </div>`,
  styles: [
  ],
  providers: [ ],
})

export class SequencePreviewComponent implements OnInit {
  @Input() sequence: any;
  text: string;

  ngOnInit() {
    this.text = '';
    if(this.sequence !== null && this.sequence !== undefined) {
      this.text = this.sequence.description || '';
    }
  }

}
