import { Component, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { StudyService, Study } from './study.service';

declare var Materialize: any;

@Component({
   selector: 'qddt-study-edit',
   moduleId: module.id,

   template:
`
<div *ngIf="isVisible && study"  id="{{study.id}}"  >
  <form (ngSubmit)="onSave()" #studyForm="ngForm">
    <div class="row">
      <div class="col s12 input-field">
        <label for="name" class="teal-text">Name</label>
        <input id="name" name="name" type="text" [(ngModel)]="study.name" required>
      </div>
    </div>
    <div class="row">
      <div class="col s12 input-field">
        <label for="description" class="teal-text">Description</label>
        <textarea id="description" name="description" class="materialize-textarea"
           [(ngModel)]="study.description" required autosize></textarea>
      </div>
    </div>

    <qddt-rational [formName]="'RationalComp'" [element]="study" [config]="{hidden: [2,3]}"></qddt-rational>

    <qddt-element-footer [element]="study" [type]="'STUDY'" (basedonObjectDetail)="getBasedOn($event)" >
    </qddt-element-footer>
    <qddt-preview-dialog  [elementRef]="basedonRef"></qddt-preview-dialog>


    <div class="row right-align">
      <button type="submit" class="btn btn-default" [disabled]="!studyForm.form.valid" >Submit</button>
    </div>
  </form>
</div>`
})

export class StudyEditComponent implements AfterContentChecked {
  @Input() study: Study;
  @Input() surveyId: any;
  @Input() isVisible= false;
  @Output() studySavedEvent: EventEmitter<any> = new EventEmitter<any>();

  public showRevision = false;
  private basedonRef: any;

  constructor(private studyService: StudyService) {
  }

  ngAfterContentChecked(): void {
    Materialize.updateTextFields();
  }

  onSave() {
    this.studyService.update(this.study).subscribe((result: any) => {
      this.study = null;
      this.studySavedEvent.emit(result);
    });
  }

  onAuthorSelected(author: any) {
   this.studyService.attachAuthor(this.study.id, author.id);
   this.study['authors'].push(author);
  }

  onAuthorRemoved(author: any) {
   this.studyService.deattachAuthor(this.study.id, author.id);
   let i = this.study['authors'].findIndex((F: any) => F === author);
   this.study['authors'].splice(i, 1);
  }

  getBasedOn(ref:any) {
    this.basedonRef = ref;
  }
}
