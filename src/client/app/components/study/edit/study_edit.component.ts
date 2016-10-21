 import { Component, Input,Output, EventEmitter } from '@angular/core';

 import { StudyService, Study } from '../study.service';
 import { Change } from '../../../common/change_status';

 @Component({
   selector: 'study-edit',
   moduleId: module.id,
   providers: [StudyService],
   template:
 `
   <div *ngIf="isVisible">
     <div *ngIf="study" class="card" id="{{study.id}}"  >
     <form (ngSubmit)="onSave()" #hf="ngForm">
       <div class="row">
         <div class="input-field col s12">
           <label for="name" class="active teal-text">Name</label>
           <input id="name" name="name" type="text" [(ngModel)]="study.name" required>
         </div>
       </div>
       <div class="row">
         <div class="input-field col s12">
           <label for="description" class="active teal-text">Description</label>
           <textarea id="description" name="description" class="materialize-textarea"  [(ngModel)]="study.description" required></textarea>
         </div>
       </div>
       <div class="row">
         <qddt-rational [element]="study"></qddt-rational>
       </div>
       <div class="row">
         <div class="input-field col s8">
           <p><label class="active teal-text">Authors</label></p>
           <author-chip-edit [authors]="study.authors"  
            (authorRemovedEvent)="onAuthorRemoved($event)" 
            (authorSelectedEvent)="onAuthorSelected($event)"></author-chip-edit>
       </div>
       <div class="input-field col s4">
         <p><label class="active teal-text">Agency</label></p>
          <div class="chip" >{{study.modifiedBy.agency.name}}</div>
         </div>
       </div>
       <button type="submit" class="btn btn-default">Submit</button>
     </form>
   </div>
 </div>
`
 })
  export class StudyEditComponent {

    @Input() study: Study;
    @Input() isVisible: boolean;
    @Input() surveyId: any;
    @Output() studySavedEvent: EventEmitter<any> = new EventEmitter<any>();
    private _ChangeEnums: any;
    private showlabel: boolean = false;

    constructor(private studyService: StudyService) {
      this._ChangeEnums = Change.status;
    }

    onSave() {
      this.isVisible = false;
      this.studyService.update(this.study).subscribe((result: any) => {
        this.study = result;
        this.studySavedEvent.emit(result);
      });
    }

    onChangeKind(value:any) {
     this.showlabel = (value === 'MILESTONE');
    }

    onAuthorSelected(author:any) {
     this.studyService.attachAuthor(this.study.id,author.id);
     this.study['authors'].push(author);
    }

    onAuthorRemoved(author:any) {
     this.studyService.deattachAuthor(this.study.id,author.id);
     var i = this.study['authors'].findIndex((F: any) => F===author);
     this.study['authors'].splice(i,1);
    }
 }
