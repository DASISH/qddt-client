import { Component, Input } from '@angular/core';
import { QuestionItem } from '../../components/question/question.service';

@Component({
  selector: 'qddt-preview-questionitem',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  template: `
<!--<qddt-preview-questionitem-grid-->
  <!--*ngIf="questionItem?.question?.children?.length>1"-->
  <!--[questionItem]="questionItem">-->
<!--</qddt-preview-questionitem-grid>-->
<!--<div *ngIf="questionItem?.question?.children?.length ===0" style="color: black">-->
<div class="row">
  <div class="flow-text" style="padding-top: 15pt;padding-left: 15pt;">
  {{questionItem.question}}</div>
</div>
<div class="teal-text" *ngIf="questionItem?.intent" style="padding-left: 15pt; padding-bottom: 10pt">Intent</div>
<div style="padding-left: 15pt;">{{questionItem.intent}}</div>
<div class="row" style="padding-right: 5pt; padding-left:5pt ">
  <qddt-preview-responsedomain *ngIf="questionItem?.responseDomain"
    [responseDomain]="questionItem.responseDomain">
  </qddt-preview-responsedomain>
</div>
<!--</div>-->
<div class="row" *ngIf="questionItem">
  <qddt-element-footer [element]="questionItem" [type]="'questionitem'"></qddt-element-footer>
</div>
<div class="row" *ngIf="questionItem?.conceptRefs">
  <ul class="collection with-header black-text">
    <li class="collection-item" *ngFor="let c of questionItem.conceptRefs" >Concept: {{c?.name}}</li>
  </ul>
</div>
`,
  providers: [ ],
})

export class PreviewQuestionitemComponent {
  @Input() questionItem: QuestionItem;

}
