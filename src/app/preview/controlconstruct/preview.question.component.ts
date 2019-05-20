import { Component, Input } from '@angular/core';
import {QuestionConstruct} from '../../classes';

@Component({
  selector: 'qddt-preview-questionconstruct',

  styles: [ ],
  template: `
  <div class="row" *ngIf="controlConstruct?.preInstructions?.length>0">
    <ul>
      <li>
        <div class="row">
          <label>Pre Instructions</label>
        </div>
      </li>
      <li class="collection-item" *ngFor="let instruction of controlConstruct.preInstructions">
        <div class="row">
          <div class="col">{{ instruction?.description }}</div>
        </div>
      </li>
    </ul>
  </div>
  <div class="row">
    <h5 [innerHtml]="controlConstruct?.questionItem?.question" ></h5>
  </div>
  <div class="row" *ngIf="controlConstruct?.postInstructions?.length>0">
    <ul>
      <li>
        <div class="row">
          <label>Post Instructions</label>
        </div>
      </li>
      <li class="collection-item" *ngFor="let instruction of controlConstruct?.postInstructions">
        <div class="row">
          <div class="col">{{ instruction?.description }}</div>
        </div>
      </li>
    </ul>
  </div>
  <div class="row" style="padding-right: 10pt;">
    <qddt-preview-responsedomain
      *ngIf="controlConstruct?.questionItem && controlConstruct.questionItem?.responseDomain"
      [responseDomain]="controlConstruct.questionItem.responseDomain">
    </qddt-preview-responsedomain>
  </div>
  <div class="row" *ngIf="showDetail">
    <qddt-element-footer [element]="controlConstruct"></qddt-element-footer>
  </div>
`,
})

export class PreviewQuestionConstructComponent {
  @Input() controlConstruct: QuestionConstruct;
  @Input() showDetail = true;
  questionItem: any;

  constructor() { }

}
