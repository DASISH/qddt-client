import { Component, Input } from '@angular/core';
import { SequenceConstruct } from '../../controlconstruct/controlconstruct.classes';

@Component({
  selector: 'qddt-preview-sequenceconstruct',
  moduleId: module.id,
  styles: [
    'div.collapsible { margin:20px;}'
  ],
  template: `
    <div class="row" *ngIf="sequence">
      <span class="row">{{ sequence?.description }}</span>
      <ul *ngIf="sequence.sequence" materialize="collapsible" class="collapsible popout"
          data-collapsible="expandable" style="padding: 5pt;">
        <div *ngFor="let child of sequence.sequence">
          <li >
            <div class="collapsible-header green lighten-5">
              <div class="row"  style="margin-bottom: 0px;">
                <div class="col s10">Name [{{ child.name }}]</div>
                <!--<div class="col s2"><qddt-version-label [element]="question"></qddt-version-label></div>-->
              </div>
            </div>
            <div class="collapsible-body">
              <div [ngSwitch]="child.element.classKind">
                <div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
                  <qddt-preview-sequenceconstruct [sequence]="child.element"></qddt-preview-sequenceconstruct>
                </div>
                <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
                  <qddt-preview-conditionconstruct [condition]="child.element"></qddt-preview-conditionconstruct>
                </div>
                <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
                  <qddt-preview-statementconstruct [statement]="child.element"></qddt-preview-statementconstruct>
                </div>
                <div *ngSwitchCase="'QUESTION_CONSTRUCT'">
                        <qddt-preview-questionitem [questionItem]="child.element.questionItem"></qddt-preview-questionitem>
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

export class PreviewSequenceConstructComponent {
  @Input() sequence: SequenceConstruct;

}
