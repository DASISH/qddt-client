import { Component, Input } from '@angular/core';
import { QuestionConstruct } from '../../../lib';

@Component({
  selector: 'qddt-preview-questionconstruct',

  styles: [],
  template: `
  <ul class="row" *ngIf="controlConstruct?.universe?.length>0">
    <li>
      <label>Universe</label>
    </li>
    <li class="collection-item" *ngFor="let universe of controlConstruct.universe">
      <p>{{ universe?.description }}</p>
    </li>
  </ul>

  <ul class="row" *ngIf="controlConstruct?.preInstructions?.length>0">
    <li>
      <label>Pre Instructions</label>
    </li>
    <li class="collection-item" *ngFor="let instruction of controlConstruct.preInstructions">
      <p>{{ instruction?.description }}</p>
    </li>
  </ul>

  <div class="row">
    <p class="card-panel grey lighten-5 grey-text text-darken-1"
    [innerHtml]="controlConstruct?.questionItemRef?.text" style="font-style: italic"></p>
  </div>

  <div class="row">
    <qddt-preview-responsedomain
      *ngIf="controlConstruct?.questionItemRef && controlConstruct.questionItemRef.element"
      [responseDomain]="controlConstruct.questionItemRef.element.responseDomainRef.element">
    </qddt-preview-responsedomain>
  </div>

  <ul class="row" *ngIf="controlConstruct?.postInstructions?.length>0">
    <li >
        <label>Post Instructions</label>
    </li>
    <li class="collection-item" *ngFor="let instruction of controlConstruct?.postInstructions">
        <p>{{ instruction?.description }}</p>
    </li>
  </ul>

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
