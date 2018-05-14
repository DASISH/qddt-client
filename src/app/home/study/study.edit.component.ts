import { Component, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { HomeService } from '../home.service';
import {Study} from '../home.classes';


@Component({
   selector: 'qddt-study-edit',
   moduleId: module.id,
   template:
`
<div *ngIf="isVisible && study"  id="{{study.id}}"  >
  <form (ngSubmit)="onSave()" #studyForm="ngForm">
    <div class="row input-field">
      <input id="name" name="name" type="text" [(ngModel)]="study.name" required>
      <label for="name" >Name</label>
    </div>
    <div class="row input-field">
      <textarea id="description" name="description" class="materialize-textarea"
          [(ngModel)]="study.description" required autosize></textarea>
      <label for="description" >Description</label>
    </div>

    <qddt-rational [formName]="'RationalComp'" [element]="study" [config]="{hidden: [2,3]}"></qddt-rational>

    <qddt-element-footer [element]="study" ></qddt-element-footer>

    <div class="row right-align">
      <button type="submit" class="btn btn-default" [disabled]="!studyForm.form.valid" >Submit</button>
    </div>
  </form>
</div>`
})

export class StudyEditComponent  {
  @Input() study: Study;
  @Input() surveyId: any;
  @Input() isVisible = false;
  @Output() savedEvent =  new EventEmitter<any>();

  public showRevision = false;
  public basedonRef: any;
  // private refreshCount = 0;

  constructor(private studyService: HomeService) {
  }

  // ngAfterContentChecked(): void {
  //   if (this.refreshCount < 10) {
  //     try {
  //       this.refreshCount++;
  //       Materialize.updateTextFields();
  //     } catch (Exception) {}
  //   }
  // }

  onSave() {
    this.studyService.update(this.study).subscribe((result: any) => {
      this.study = null;
      this.savedEvent.emit(result);
    });
  }

  onAuthorSelected(author: any) {
   this.studyService.attachStudyAuthor(this.study.id, author.id);
   this.study['authors'].push(author);
  }

  onAuthorRemoved(author: any) {
   this.studyService.deattachStudyAuthor(this.study.id, author.id);
   const i = this.study['authors'].findIndex((F: any) => F === author);
   this.study['authors'].splice(i, 1);
  }

  getBasedOn(ref: any) {
    this.basedonRef = ref;
  }
}
