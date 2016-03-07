 import {Component, Input} from 'angular2/core';

 import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

 import {StudyService} from '../studyservice';

 @Component({
   selector: 'study-edit',
   templateUrl: './components/study/edit/study_edit.html',
   providers: [StudyService],
   directives: [MaterializeDirective]


 })
 export class StudyEditComponent {

    @Input() study: any;
    private changes: any;

    constructor(private studyService: StudyService) {
      this.changes = [['IN_DEVELOPMENT','Work in progress'],
                      ['TYPO','Ortographical adjustment'],
                      ['NEW_MAJOR','Conceptual improvement'],
                      ['NEW_MAJOR','Real life change'],
                      ['NEW_MAJOR','Other purpose']];
    }

    save() {
      console.log(this.study);
         //this.studyService.save(this.study, this.study.surveyProgram.id);
    }

 }
