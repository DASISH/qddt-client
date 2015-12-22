import {Component, Input} from 'angular2/core';

@Component({
  selector: 'study-create',
  template: `
    <div *ngIf="surveyProgram">
     <div class="card white white-text text-lighten-2">
        <div class="row teal z-depth-1" style="padding-left:2%;padding-top:1%;padding-bottom:1%;">
          <i class="material-icons large right">comment</i><h4 style="font-weight:300;">Studies for {{surveyProgram.name}}</h4>
          This is where you create a study for the selected survey.
        </div>
        <div class="row" style="padding-left:2%">
          <div class="col s12 m6 l6 grey-text text-darken-2">

              {{surveyProgram.name}}

          </div>
        </div>
      </div>
     </div>
  `

})
export class StudyCreateComponent {

  @Input() surveyProgram: any;


}
