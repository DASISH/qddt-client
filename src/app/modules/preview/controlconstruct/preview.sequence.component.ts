import { Component, Input, AfterViewInit } from '@angular/core';
import {ElementRevisionRef, getElementKind, PreviewService, SequenceConstruct} from '../../../lib';

@Component({
  selector: 'qddt-preview-sequenceconstruct',

  styles: [
  ],
  template: `
    <div [id]="compId" class="row" *ngIf="sequenceConstruct">
      <span class="row">{{ sequenceConstruct?.description }}</span>
      <ul id="col{{compId}}" *ngIf="sequenceConstruct.sequence"  class="collapsible" data-collapsible="accordion"  >
        <li *ngFor="let child of sequenceConstruct.sequence">
          <div class="collapsible-header green lighten-5"
            [innerHTML] = "child.name"
           (click)="onViewDetail(child)">
          </div>
          <div class="collapsible-body">
            <div [ngSwitch]="child.elementKind">
              <div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
                RECURSIVE?
                <qddt-preview-sequenceconstruct [sequenceConstruct]="child.element"></qddt-preview-sequenceconstruct>
              </div>
              <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
                <qddt-preview-conditionconstruct [condition]="child.element"></qddt-preview-conditionconstruct>
              </div>
              <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
                <qddt-preview-statementconstruct [statement]="child.element"></qddt-preview-statementconstruct>
              </div>
              <div *ngSwitchCase="'QUESTION_CONSTRUCT'">
                NOTHING?
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

export class PreviewSequenceConstructComponent  implements AfterViewInit {
  @Input() sequenceConstruct: SequenceConstruct;
  @Input() showDetail = false;
  public compId = Math.round(Math.random() * 10000);

  constructor(private service: PreviewService) { }

  public ngAfterViewInit(): void {
    const elems = document.getElementById('col' + this.compId);
    M.Collapsible.init(elems);
  }

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
