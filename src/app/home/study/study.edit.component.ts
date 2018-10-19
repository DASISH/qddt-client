import { Component, Input, EventEmitter, Output, AfterContentChecked } from '@angular/core';
import { HomeService } from '../home.service';
import {Study} from '../home.classes';

declare var $: any;

@Component({
   selector: 'qddt-study-edit',
   moduleId: module.id,
   providers: [],
   template: `
<div *ngIf="isVisible && study"  id="{{formId}}"  >
  <form (ngSubmit)="onSave()" #studyForm="ngForm">

    <div class="row input-field">
      <input id="{{formId}}-name" name="name" type="text" [(ngModel)]="study.name" required>
      <label for="{{formId}}-name" >Name</label>
    </div>

    <div class="row input-field">
      <textarea id="{{formId}}-desc" name="{{formId}}-description" class="materialize-textarea"
        [(ngModel)]="study.description" required >
      </textarea>
      <label for="{{formId}}-desc">Description</label>
    </div>

    <qddt-rational [formName]="'RationalComp'" [element]="study" [config]="{hidden: [2,3]}"></qddt-rational>

    <qddt-element-footer [element]="study" ></qddt-element-footer>

    <div class="row right-align">
      <button type="submit" class="btn btn-default" [disabled]="studyForm.form.invalid" >Submit</button>
    </div>
  </form>
</div>
`
})

export class StudyEditComponent implements  AfterContentChecked {
  @Input() study: Study;
  @Input() readonly = false;
  @Input() isVisible = false;
  @Output() savedEvent =  new EventEmitter<any>();

  public readonly formId = Math.round( Math.random() * 10000);
  public showRevision;
  constructor(private studyService: HomeService) { }

  ngAfterContentChecked() {
    $('#' + this.formId + '-desc').trigger('autoresize');
  }

  onSave() {
    this.studyService.update(this.study).subscribe((result: any) => {
      this.study = null;
      this.savedEvent.emit(result);
    });
  }
  //
  // onAuthorSelected(author: any) {
  //  this.studyService.attachStudyAuthor(this.study.id, author.id);
  //  this.study['authors'].push(author);
  // }
  //
  // onAuthorRemoved(author: any) {
  //  this.studyService.deattachStudyAuthor(this.study.id, author.id);
  //  const i = this.study['authors'].findIndex((F: any) => F === author);
  //  this.study['authors'].splice(i, 1);
  // }

}
