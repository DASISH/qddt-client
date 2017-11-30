import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-sequenceconstruct',
  moduleId: module.id,
  styles: [
    'div.collapsible { margin:20px;}'
  ],
  template: `
    <div class="row" *ngIf="sequence">
      <h5>Sequence: {{sequence?.name}}</h5>
      <span class="row">{{text}}</span>
      <ul *ngIf="sequence.children" materialize="collapsible" class="collapsible popout"
          data-collapsible="expandable" style="padding: 5pt;">
        <div *ngFor="let child of sequence.children">
          <li >
            <div class="collapsible-header green lighten-5">
              <div class="row"  style="margin-bottom: 0px;">
                <div class="col s10">Name [{{child.name}}]</div>
                <!--<div class="col s2"><qddt-version-label [element]="question"></qddt-version-label></div>-->
              </div>
            </div>
            <div class="collapsible-body">
              <div [ngSwitch]="child.controlConstructKind">
                <div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
                  <qddt-preview-sequenceconstruct [sequence]="child"></qddt-preview-sequenceconstruct>
                </div>
                <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
                  <qddt-preview-conditionconstruct [condition]="child"></qddt-preview-conditionconstruct>
                </div>
                <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
                  <qddt-preview-statementconstruct [statement]="child"></qddt-preview-statementconstruct>
                </div>
                <div *ngSwitchCase="'QUESTION_CONSTRUCT'">
                        <qddt-preview-questionitem [questionItem]="child.questionItem"></qddt-preview-questionitem>
                  <!--<qddt-preview-questionconstruct [controlConstruct]="child"></qddt-preview-questionconstruct>-->
                </div>
              </div>
            </div>
          </li>
        </div>
      </ul>
    </div>`,
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
