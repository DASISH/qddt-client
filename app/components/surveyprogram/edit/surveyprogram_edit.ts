import {Component, Input} from 'angular2/core';

import {SurveyService, SurveyProgram} from '../../surveyprogram/surveyservice';

@Component({
    selector: 'surveyprogram-edit',
    providers: [SurveyService],
    template: `
  <div *ngIf="isVisible">
    <div *ngIf="surveyProgram" class="card" id="{{surveyProgram.id}}"  >
      <form (ngSubmit)="save()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" [(ngModel)]="surveyProgram.name" required>
            <label for="name" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"  [(ngModel)]="surveyProgram.description" required></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
		  <div class="input-field col s4">
              <label class="active teal-text">Version Reason</label>
              <select  class="browser-default"  [(ngModel)]="surveyProgram.changeKind">
                <option *ngFor="#changereason of changes" [value]="changereason">{{changereason}}</option>
              </select>
          </div>
          <div class="input-field col s8">
            <input type="text" [(ngModel)]="surveyProgram.changeComment" required>
            <label for="changeComment" class="active teal-text">Save Comment</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <div class="chip" *ngFor="#author of surveyProgram.authors" ><img src="{{author.picture}}">{{author.name}} <i class="material-icons">close</i></div>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{surveyProgram.createdBy.agency.name}}</div>
          </div>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>

  `
})
export class SurveyProgramEditComponent {

    @Input() surveyProgram: SurveyProgram;
    private service: SurveyService;
  constructor(surveyService: SurveyService) {
      this.service = surveyService;
      this.changes = ['IN_DEVELOPMENT','TYPO','NEW_MAJOR'];
    }
    save() {
        this.service.save(this.surveyProgram);
    }

}
