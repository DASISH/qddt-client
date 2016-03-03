import {Component, Input} from 'angular2/core';

import {ConceptService, Concept} from '../conceptservice';

@Component({
    selector: 'surveyprogram-edit',
    providers: [ConceptService],
    template: `
  <div *ngIf="isVisible">
    <div *ngIf="concept" class="card" id="{{concept.id}}"  >
      <form (ngSubmit)="save()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" [(ngModel)]="concept.name" required>
            <label for="name" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"  [(ngModel)]="concept.description" required></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
		  <div class="input-field col s4">
              <label class="active teal-text">Version Reason</label>
              <select  class="browser-default input-sm"  [(ngModel)]="concept.changeKind">
                <option *ngFor="#changereason of changes" [value]="changereason">{{changereason}}</option>
              </select>
          </div>
          <div class="input-field col s8">
            <input type="text" [(ngModel)]="concept.changeComment" required>
            <label for="changeComment" class="active teal-text">Save Comment</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <div class="chip" *ngFor="#author of concept.authors" >
              <img src="{{author.picture}}">{{author.name}} <i class="material-icons">close</i>
            </div>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{concept.createdBy.agency.name}}</div>
          </div>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>

  `
})
export class ConceptEditComponent {

    @Input() concept: Concept;
    private changes:any;

    private service: ConceptService;
  constructor(conceptService: ConceptService) {
      this.service = conceptService;
      this.changes = ['IN_DEVELOPMENT','TYPO','NEW_MAJOR'];
    }
    save() {
        this.service.save(this.concept);
    }

}
