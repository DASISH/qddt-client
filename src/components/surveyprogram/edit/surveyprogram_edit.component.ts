import {Component, Input, Output,EventEmitter} from 'angular2/core';

import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

import {SurveyService, SurveyProgram} from '../../surveyprogram/survey.service';
import {Change} from '../../../common/change_status';
import {AuthorChipEditComponent} from '../../author/author_chip.edit.component';

@Component({
  selector: 'surveyprogram-edit',
  moduleId: module.id,
  providers: [SurveyService],
  directives: [MaterializeDirective,AuthorChipEditComponent],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="survey" class="card" id="{{survey.id}}"  >
      <form (ngSubmit)="onSave()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" [(ngModel)]="survey.name" required>
            <label for="name" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"  [(ngModel)]="survey.description" required></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
		      <div class="input-field col s4">
            <label class="active teal-text">Type of Change</label>
            <select [(ngModel)]="survey.changeKind" materialize="material_select" (ngModelChange)="onChangeKind($event)">
              <option value="" disabled selected>Select reason</option>
              <option *ngFor="#changereason of changes" [value]="changereason[0]">{{changereason[1]}}</option>
            </select>
          </div>
          <div *ngIf="showlabel"  class="input-field col s4">
            <label for="versionlabel" class="active teal-text">Version label</label>
            <input id="versionlabel" type="text" [(ngModel)]="survey.version.versionLabel">
          </div>
          <div class="input-field col">
            <input type="text" [(ngModel)]="survey.changeComment" required>
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
  @Output() surveySavedEvent: EventEmitter<SurveyProgram> = new EventEmitter();
  private changes: any;
  private showlabel: boolean = false;

  constructor(private surveyService: SurveyService) {
    this.changes = Change.status;
  }

  onSave() {
    this.surveyService.save(this.survey)
      .subscribe(result => this.survey = result.content
        ,(err) => console.log('ERROR: ', err));
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
