import {Component, Input} from 'angular2/core';

import {StudyService, Study} from './studyservice';
import {StudyCreateComponent} from './create';

@Component({
  selector: 'study',
  providers: [StudyService],
  directives: [StudyCreateComponent],
  template: `
       <div class="card white white-text text-lighten-2">
        <div class="row teal z-depth-1" style="padding-left:2%;padding-top:1%;padding-bottom:1%;">
          <i class="material-icons large right">comment</i><h4 style="font-weight:300;">Studies for {{surveyProgram.name}}</h4>
          <study-create [surveyProgram]="surveyProgram"></study-create>
        </div>

      <div class="row" *ngFor="#study of studies" style="padding-left:2%">
        <div class="col s1 m1 l1">
          <br />
          <div class="row">
          <!--<a class="btn-flat btn-floating btn-medium waves-effect waves-light teal" (click)=""><i class="material-icons">mode_edit</i></a>-->
          <!--<a class="btn-flat btn-floating btn-medium waves-effect waves-light teal" (click)=""><i class="material-icons left medium">history</i></a>-->
          <!--<a class="btn-flat btn-floating btn-medium waves-effect waves-light teal" (click)=""><i class="material-icons left medium">add</i></a>-->
          </div>
        </div>

        <div class="col s9 m9 l9 grey-text text-darken-2">
                {{study.name}}
        </div>

        <div class="col s9 m9 l9 white grey-text text-darken-1">
          <div class="row">
            <p>
                {{study.description}}
            </p>
          </div>
        </div>

</div>


      </div>
  `
})
export class StudyComponent {

  @Input() surveyProgram: any;
  private studies: any;

  constructor(private studyService: StudyService) {

  }

  ngOnChanges() {
    this.studies = this.surveyProgram.studies;
    console.log(this.studies);
    //this.studyService.getAll(this.surveyProgram.id).subscribe(result => {
    //  this.studies = result;
    //  console.log(this.studies);
    //});
  }

}
