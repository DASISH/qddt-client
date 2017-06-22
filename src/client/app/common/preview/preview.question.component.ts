import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-question',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  template: `
  <div *ngIf="question" style="color: black">
    <div class="row">
      <div class="col s6" style="padding: 1 pt;">
        {{question?.question}}
      </div>
      <div class="col s6" *ngIf="responseDomain">
        <qddt-preview-rd-oneline [responseDomain]="responseDomain"></qddt-preview-rd-oneline>
      </div>
    </div>
    <div *ngIf="question?.children && question?.children?.size > 0">
      <qddt-preview-question *ngFor="let childQuestion of question.chldren" [question] = "childQuestion"></qddt-preview-question>
    </div>  
  </div>`,
  providers: [ ],
})

export class PreviewQuestionComponent {
  @Input() question: any;
  @Input() responseDomain: any;


}
