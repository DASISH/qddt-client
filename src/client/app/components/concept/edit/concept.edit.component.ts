import { Component, Input } from '@angular/core';
import { ConceptService, Concept } from '../concept.service';

@Component({
  selector: 'qddt-concept-edit',
  moduleId: module.id,
  providers: [ConceptService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="concept" class="card" id="{{concept.id}}"  >
      <form (ngSubmit)="save()" #hf="ngForm">
        <div class="row">
          <div class="col s12">
            <label [attr.for]="concept.id + '-name'" class="active teal-text">Name</label>            
            <input id="{{concept?.id}}-name"
              name="{{concept?.id}}-name" type="text" [(ngModel)]="concept.name" required>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <label [attr.for]="concept.id + '-description'" class="active teal-text">Description</label>            
            <textarea class="materialize-textarea" id="{{concept?.id}}-description"
              name="{{concept?.id}}-description"
              [(ngModel)]="concept.description" required></textarea>
          </div>
        </div>
        <div class="row">
				  <qddt-revision-detail [element]="concept" [type]="'concept'"></qddt-revision-detail>
			  </div>
        <div class="row">
		      <qddt-rational [element]="concept"></qddt-rational>
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

  constructor(conceptService: ConceptService) {
    this.service = conceptService;
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


