 import {Component, Input} from 'angular2/core';

 import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

 import {StudyService} from '../study.service';

 @Component({
   selector: 'study-edit',
   moduleId: module.id,
   templateUrl: './study_edit.component.html',
   providers: [StudyService],
   directives: [MaterializeDirective]


 })
 export class StudyEditComponent {

    @Input() study: any;
    private _ChangeEnums: any;

    constructor(private studyService: StudyService) {
      this._ChangeEnums = [['IN_DEVELOPMENT','Work in progress'],
                      ['TYPO','Ortographical adjustment'],
                      ['NEW_MAJOR','Conceptual improvement'],
                      ['NEW_MAJOR','Real life change'],
                      ['NEW_MAJOR','Other purpose']];
    }

    onSave() {
      console.log('onSave Study');
      this.studyService.save(this.study, this.study.surveyProgram.id);
    }

 }
