import {Component, Input} from 'angular2/core';

import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

import {SurveyService, SurveyProgram} from '../../surveyprogram/survey.service';

@Component({
  selector: 'surveyprogram-edit',
  moduleId: module.id,
  providers: [SurveyService],
  directives: [MaterializeDirective],
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
            <select [(ngModel)]="surveyProgram.changeKind" materialize="material_select">
              <option value="" disabled selected>Select reason</option>
              <option *ngFor="#changereason of changes" [value]="reason">{{changereason}}</option>
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
            <div class="chip" *ngFor="#author of surveyProgram.authors" >
              <img src="{{author.picture}}">

              <a *ngIf="!author.email && !author.homepage">{{author.name}}</a>
              <a *ngIf="author.email" href="mailto:{{author.email}}">{{author.name}}</a>
              <a *ngIf="author.homepage && !author.email" href="{{author.homepage}}" target="_blank">{{author.name}}</a>

              <i class="material-icons">close</i></div>
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
    private changes:any;

  constructor(private surveyService: SurveyService) {
      this.changes = ['IN_DEVELOPMENT','TYPO','NEW_MAJOR'];
    }

    save() {
        this.surveyService.save(this.surveyProgram);
    }

}
