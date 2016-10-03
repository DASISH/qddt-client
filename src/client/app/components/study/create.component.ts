import { Component, Input } from '@angular/core';

import { StudyService, Study } from './study.service';

@Component({
  selector: 'study-create',
  moduleId: module.id,
  providers: [StudyService],
  template: `
      <a class="btn" (click)="toggleForm()">
      <i class="material-icons right" *ngIf="!showForm">keyboard_arrow_down</i>
      <i class="material-icons right" *ngIf="showForm">keyboard_arrow_up</i>
      New</a>

      <div *ngIf="showForm">
        <div class="card-action">
          <form (ngSubmit)="save()" #hf="ngForm">
            <div class="row">
              <div class="input-field col">
                <input id="name" type="text" [(ngModel)]="study.name" required>
                <label for="name" class="white-text">Name</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s10">
                <textarea id="description" class="materialize-textarea" [(ngModel)]="study.description" required></textarea>
                <label for="description" class="white-text">Description</label>
              </div>
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
          </form>
        </div>
      </div>
  `

})
export class StudyCreateComponent {

  @Input() surveyProgram: any;
  showForm: boolean = false;
  private study: Study;

  constructor(private studyService: StudyService) {
    this.study = new Study();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  save() {
    this.studyService.save(this.study, this.surveyProgram.id);
    this.study = new Study();
  }

}
