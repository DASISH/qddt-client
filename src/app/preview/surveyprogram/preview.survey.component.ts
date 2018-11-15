import { Component, Input } from '@angular/core';
import {SurveyProgram} from '../../classes';

@Component({
  selector: 'qddt-preview-survey',

  template: `
  <div class="row">
    <div class="col s12">
      <label class="active teal-text">Description</label>
      <P [innerHtml]="survey?.description"></P>
    </div>
  </div>
  <div class="row" *ngIf="survey?.authors && survey?.authors?.length>0">
    <p><label class="active teal-text">Authors</label></p>
    <qddt-author-chip [authors]="survey.authors"></qddt-author-chip>
  </div>
  <div class="row">
    <qddt-comment-list [ownerId]="survey.id" [comments]="survey.comments"></qddt-comment-list>
  </div>
  <div class="row" *ngIf="survey.studies && survey.studies.length>0">
    <qddt-preview-study-list [studyList]="survey.studies"></qddt-preview-study-list>
  </div>
  <div class="row">
    <qddt-element-footer [element]="survey"></qddt-element-footer>
  </div>`
  ,
  providers: [ ],
})

export class PreviewSurveyComponent {
  @Input() survey: SurveyProgram;
}
