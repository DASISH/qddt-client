 import {Component, Input,Output, EventEmitter} from 'angular2/core';
 import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

 import {StudyService} from '../study.service';
 import {Change} from '../../../common/change_status';

 @Component({
   selector: 'study-edit',
   moduleId: module.id,
   providers: [StudyService],
   directives: [MaterializeDirective],
   template:
 `
   <div *ngIf="isVisible">
     <div *ngIf="study" class="card" id="{{study.id}}"  >
     <form (ngSubmit)="onSave()" #hf="ngForm">
       <div class="row">
         <div class="input-field col s12">
           <label for="name" class="active teal-text">Name</label>
           <input id="name" type="text" [(ngModel)]="study.name" required>
         </div>
       </div>
       <div class="row">
         <div class="input-field col s12">
           <label for="description" class="active teal-text">Description</label>
           <textarea id="description" class="materialize-textarea"  [(ngModel)]="study.description" required></textarea>
         </div>
       </div>
       <div class="row">
         <div class="input-field col s5">
           <label class="active teal-text">Type of Change</label>
           <select [(ngModel)]="study.changeKind" materialize="material_select" required>
             <option value="" disabled selected>Select reason</option>
             <option *ngFor="#change of _ChangeEnums" [value]="change[0]">{{change[1]}}</option>
           </select>
         </div>
         <div class="input-field col s7">
           <label for="changeComment" class="active teal-text">Reason for change</label>
           <input id="changeComment" type="text" [(ngModel)]="study.changeComment" required>
         </div>
       </div>
       <div class="row">
         <div class="input-field col s8">
           <p><label class="active teal-text">Authors</label></p>
           <div class="chip" *ngFor="#author of study.authors" ><img src="{{author.picture}}">{{author.name}}
            <i class="material-icons">close</i>
           </div>
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

    @Input() study: any;
    @Input() surveyId: any;
    @Output() studySavedEvent: EventEmitter<any> = new EventEmitter();
    private _ChangeEnums: any = Change.status;

    constructor(private studyService: StudyService) {
    }



    onSave() {
      console.log('onSave Study');
      this.studyService.save(this.study,this.surveyId).subscribe(result => {
        this.study =result;
        this.studySavedEvent.emit(result);
      });
    }

 }
