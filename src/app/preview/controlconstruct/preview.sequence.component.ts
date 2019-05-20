import { Component, Input } from '@angular/core';
import { PreviewService } from '../preview.service';
import {ElementRevisionRef, getElementKind, SequenceConstruct} from '../../classes';

@Component({
  selector: 'qddt-preview-sequenceconstruct',

  styles: [
  ],
  template: `
    <div class="row" *ngIf="sequenceConstruct">
      <span class="row">{{ sequenceConstruct?.description }}</span>
      <ul *ngIf="sequenceConstruct.sequence"  class="collapsible" data-collapsible="accordion"  materialize="collapsible">
        <li *ngFor="let child of sequenceConstruct.sequence">
          <div class="collapsible-header green lighten-5"  (click)="onViewDetail(child)">
            {{ child.name }}
          </div>
          <div class="collapsible-body">
            <div [ngSwitch]="child.elementKind">
              <div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
                <qddt-preview-sequenceconstruct [sequenceConstruct]="child.element"></qddt-preview-sequenceconstruct>
              </div>
              <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
                <qddt-preview-conditionconstruct [condition]="child.element"></qddt-preview-conditionconstruct>
              </div>
              <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
                <qddt-preview-statementconstruct [statement]="child.element"></qddt-preview-statementconstruct>
              </div>
              <div *ngSwitchCase="'QUESTION_CONSTRUCT'">
                <qddt-preview-questionconstruct [controlConstruct]="child.element" >
                </qddt-preview-questionconstruct>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>`,
  providers: [ ],
})

export class PreviewSequenceConstructComponent {
  @Input() sequenceConstruct: SequenceConstruct;
  @Input() showDetail = false;

  constructor(private service: PreviewService) { }

  public onViewDetail(element: ElementRevisionRef) {
    console.log('onViewDetail ' + element.name );
    if (!element.element) {
      this.service.getRevisionByKind(getElementKind(element.elementKind), element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { this.showDetail = false; throw error; });
    }
    this.showDetail = true;
  }
}
