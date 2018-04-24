import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { HomeService } from '../home.service';
import { Concept} from '../home.classes';

@Component({
  selector: 'qddt-concept-edit',
  moduleId: module.id,
  providers: [],
  template: `
<div *ngIf="isVisible">

  <div *ngIf="concept" class="row " id="{{concept.id}}"  >
    <form (ngSubmit)="save()" #hf="ngForm">

      <div class="row input-field ">
        <label [attr.for]="concept.id + '-name'" class="teal-text">Name</label>
        <input id="{{concept?.id}}-name"
          name="{{concept?.id}}-name" type="text" [(ngModel)]="concept.name" required>
      </div>

      <div class="row input-field ">
        <label [attr.for]="concept.id + '-description'" class="teal-text">Description</label>
        <textarea class="materialize-textarea" id="{{concept?.id}}-description"
          name="{{concept?.id}}-description"
          [(ngModel)]="concept.description" required autosize></textarea>
      </div>

      <qddt-rational
        *ngIf="!readonly"
        [formName]="'RationalComp'"
        [element]="concept"
        [config]="{hidden: [2,3]}">
      </qddt-rational>

      <qddt-element-footer [element]="concept"></qddt-element-footer>
      <div class="row right-align" *ngIf="!readonly">
        <button type="submit" class="btn btn-default" [disabled]="!hf.form.valid" >Submit</button>
      </div>
    </form>
  </div>

</div>
`
})
export class ConceptEditComponent implements OnInit {

  @Input() concept: Concept;
  @Input() readonly: boolean;
  @Input() isVisible = false;
  @Output() conceptSavedEvent =  new EventEmitter<any>();

  public showRevision = false;

  constructor(private service: HomeService) {
  }

  ngOnInit() {
    if (this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
  }

  save() {
    this.service.updateConcept(this.concept)
      .subscribe((result: any) => {
        this.concept = result;
        this.conceptSavedEvent.emit(result);
        this.isVisible = false;
      });
  }
  //
  // onAuthorSelected(author: any) {
  //   this.service.attachAuthor(this.concept.id, author.id);
  //   this.concept.authors.push(author);
  // }
  //
  // onAuthorRemoved(author: any) {
  //   this.service.deattachAuthor(this.concept.id, author.id);
  //   const i = this.concept.authors.findIndex(F => F === author);
  //   this.concept.authors.splice(i, 1);
  // }


}
