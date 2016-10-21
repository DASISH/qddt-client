import { Component, Input } from '@angular/core';
import { ConceptService, Concept } from '../concept.service';
import { Change } from '../../../common/change_status';

@Component({
  selector: 'concept-edit',
  moduleId: module.id,
  providers: [ConceptService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="concept" class="card" id="{{concept.id}}"  >
      <form (ngSubmit)="save()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input id="{{concept?.id}}-name"
              name="{{concept?.id}}-name" type="text" [(ngModel)]="concept.name" required>
            <label [attr.for]="concept.id + '-name'" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea" id="{{concept?.id}}-description"
              name="{{concept?.id}}-description"
              [(ngModel)]="concept.description" required></textarea>
            <label [attr.for]="concept.id + '-description'" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
		      <qddt-rational [element]="concept"></qddt-rational>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
           <author-chip-edit [authors]="concept.authors"  
            (authorRemovedEvent)="onAuthorRemoved($event)" 
            (authorSelectedEvent)="onAuthorSelected($event)"></author-chip-edit>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{concept.modifiedBy.agency.name}}</div>
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
  @Input() isVisible: boolean;
  private service: ConceptService;
  private _ChangeEnums: any;

  constructor(conceptService: ConceptService) {
    this.service = conceptService;
    this._ChangeEnums = Change.status;
  }

  save() {
    this.isVisible = false;
    this.service.updateConcept(this.concept)
      .subscribe((result: any) => this.concept = result
        ,(err: any) => console.log('ERROR: ', err));
  }

  onAuthorSelected(author:any) {
    this.service.attachAuthor(this.concept.id,author.id);
    this.concept.authors.push(author);
  }

  onAuthorRemoved(author:any) {
    this.service.deattachAuthor(this.concept.id,author.id);
    var i = this.concept.authors.findIndex(F=>F===author);
    this.concept.authors.splice(i,1);
  }

}


