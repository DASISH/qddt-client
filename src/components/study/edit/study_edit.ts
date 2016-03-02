 import {Component, Input} from 'angular2/core';

 import {StudyService, Study} from '../studyservice';

 @Component({
    selector: 'study-edit',
    providers: [StudyService],
    templateUrl: './study_edit.html'

 })
 export class StudyEditComponent {

    @Input() study: Study;
    private service: StudyService;
    private parentId:String;
    private changes:any;

    constructor(studyService: StudyService,parentId:String) {
       this.service = studyService;
       this.parentId = parentId;
       this.changes = ['IN_DEVELOPMENT','TYPO','NEW_MAJOR'];
    }

    save() {
         this.service.save(this.study,this.parentId);
    }

 }
