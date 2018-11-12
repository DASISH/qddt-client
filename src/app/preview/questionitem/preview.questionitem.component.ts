import { Component, Input } from '@angular/core';
import { QuestionItem } from '../../modules/question/question.classes';

@Component({
  selector: 'qddt-preview-questionitem',

  styles: [],
  template: `
<div class="row" >
  <div class="flow-text" style="padding-top: 15pt;padding-left: 10pt;"[innerHtml]="questionItem?.question" ></div>
</div>
<div class="teal-text" *ngIf="questionItem?.intent" style="padding-left: 10pt; padding-bottom: 10pt">Intent</div>
<div style="padding-left: 10pt;">{{ questionItem?.intent }}</div>

<div class="row" >
  <qddt-preview-responsedomain *ngIf="questionItem?.responseDomain"
    [responseDomain]="questionItem.responseDomain">
  </qddt-preview-responsedomain>
</div>

<qddt-conceptref [element]="questionItem"></qddt-conceptref>

<div class="row" *ngIf="questionItem">
  <qddt-element-footer [element]="questionItem" ></qddt-element-footer>
</div>
`,
  providers: [ ],
})

export class PreviewQuestionitemComponent {
  @Input() questionItem: QuestionItem;

}
