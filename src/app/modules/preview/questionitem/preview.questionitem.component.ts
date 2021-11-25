import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionItem, ResponseDomain } from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-questionitem',

  styles: [],
  template: `
<ul class="grey-text text-darken-1">
  <li class="collection-item" ><label>Text</label></li>
  <li class="collection-item" >
    <p class="card-panel" [innerHtml]="questionItem?.question" style="font-style: italic"></p>
  </li>
  <li class="collection-item" ><label>Responsedomain</label></li>
  <li class="collection-item" >
    <qddt-preview-responsedomain  *ngIf="questionItem?._embedded.responseDomain"
      [responseDomain]="questionItem._embedded.responseDomain">
    </qddt-preview-responsedomain>
  </li>
  <li class="collection-item" *ngIf="questionItem?.intent" ><label>Intent</label></li>
  <li class="collection-item" *ngIf="questionItem?.intent" >
    <p  [innerHtml]="questionItem?.intent"></p>
  </li>

  <li class="collection-item" >
    <qddt-conceptref [element]="questionItem"></qddt-conceptref>
  </li>
  <li class="collection-item" *ngIf="questionItem" >
      <qddt-element-footer [element]="questionItem" ></qddt-element-footer>
  </li>
</ul>

`,
  providers: [],
})

export class PreviewQuestionitemComponent {
  @Input() questionItem: QuestionItem;


}
