import {Component, Input, Output,EventEmitter} from '@angular/core';


import { SurveyService, SurveyProgram } from '../../surveyprogram/survey.service';
import { Change } from '../../../common/change_status';

@Component({
  selector: 'surveyprogram-edit',
  moduleId: module.id,
  providers: [SurveyService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="survey" class="card" id="{{survey.id}}"  >
      <form materialize (ngSubmit)="onSave()" #surveyForm="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input id="{{survey?.id}}-name"
              name="{{survey?.id}}-name"
              type="text" [(ngModel)]="survey.name" required>
            <label [attr.for]="survey.id + '-name'" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea id="{{survey?.id}}-description" name="{{survey?.id}}-description"
              class="materialize-textarea"  [(ngModel)]="survey.description" required></textarea>
            <label [attr.for]="survey.id + '-description'" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
		      <div class="input-field col s4">
            <label class="active teal-text">Type of Change</label>
            <select [(ngModel)]="survey.changeKind"
              name="{{survey?.id}}-survey.changeKind" materialize="material_select"
              (ngModelChange)="onChangeKind($event)">
              <option value="" disabled selected>Select reason</option>
              <option *ngFor="let changereason of changes" [value]="changereason[0]">{{changereason[1]}}</option>
            </select>
          </div>
          <div *ngIf="showlabel"  class="input-field col s4">
            <label for="versionlabel" class="active teal-text">Version label</label>
            <input id="versionlabel" name="versionlabel" type="text" [(ngModel)]="survey.version.versionLabel">
          </div>
          <div class="input-field col">
            <input id="changeComment" name="{{survey?.id}}-survey.changeComment" type="text" [(ngModel)]="survey.changeComment" required>
            <label for="changeComment" class="active teal-text">Reason for change</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <author-chip-edit [authors]="survey.authors"  
            (authorRemovedEvent)="onAuthorRemoved($event)" 
            (authorSelectedEvent)="onAuthorSelected($event)"></author-chip-edit>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{survey.modifiedBy.agency.name}}</div>
          </div>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>

  `
})
export class SurveyProgramEditComponent {

  @Input() survey: SurveyProgram;
  @Input() isVisible: boolean;
  @Output() surveySavedEvent: EventEmitter<SurveyProgram> = new EventEmitter<SurveyProgram>();
  private changes: any;
  private showlabel: boolean = false;

  constructor(private surveyService: SurveyService) {
    this.changes = Change.status;
  }

  onSave() {
    this.isVisible = false;
    this.surveyService.save(this.survey)
      .subscribe((result: any) => this.survey = result.content
        ,(err: any) => console.log('ERROR: ', err));
    this.surveySavedEvent.emit(this.survey);
  }

  onChangeKind(value:any) {
    this.showlabel = (value === 'MILESTONE');
  }

  onAuthorSelected(author:any) {
    this.surveyService.attachAuthor(this.survey.id,author.id);
    this.survey.authors.push(author);
  }

  onAuthorRemoved(author:any) {
    this.surveyService.deattachAuthor(this.survey.id,author.id);
    var i = this.survey.authors.findIndex(F=>F===author);
    this.survey.authors.splice(i,1);
  }


}
