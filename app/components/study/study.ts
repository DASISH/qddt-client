import {Component, Input, EventEmitter, Output} from 'angular2/core';

import {StudyService, Study} from './studyservice';
import {StudyCreateComponent} from './create';
import {CommentListComponent} from '../comment/comment_list';

@Component({
  selector: 'study',
  providers: [StudyService],
  directives: [StudyCreateComponent, CommentListComponent],
  template: `
     <div class="card white white-text text-lighten-2">
      <div class="row teal z-depth-1" style="padding-left:2%;padding-top:1%;padding-bottom:1%;">
        <i class="material-icons large right">comment</i><h4>Studies for {{surveyProgram.name}}</h4>
        <study-create [surveyProgram]="surveyProgram"></study-create>
      </div>

      <div *ngIf="!activeStudy">
        <div class="row" *ngFor="#study of studies" style="padding-left:2%">
          <div class="col s1 m1 l1">
            <br />
            <div class="row">
              <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal" (click)="selectStudy(study)"><i class="material-icons">mode_edit</i></a>
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

      <div class="row " *ngIf="activeStudy" style="padding-left:2%">
        <div class="col s1 m1 l1">
          <br />
          <div class="row">
            <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal" (click)="selectStudy()"><i class="material-icons">close</i></a>
          </div>
        </div>

        <div class="col s9 m9 l9 grey-text text-darken-2">
                {{activeStudy.name}}
        </div>

        <div class="col s9 m9 l9 white grey-text text-darken-1">
          <div class="row">
            <p>
                {{activeStudy.description}}
            </p>
          </div>
        </div>
        <div class="row">
          <comment-list [ownerId]="activeStudy.id"></comment-list>
        </div>
      </div>


  `
})
export class StudyComponent {

  @Input() surveyProgram: any;
  @Output() selectedStudy: EventEmitter<any> = new EventEmitter();
  private studies: any;
  private activeStudy: any;

  constructor(private studyService: StudyService) {

  }

  ngOnChanges() {
    this.studies = this.surveyProgram.studies;
  }

  selectStudy(activeStudy: any) {
    this.selectedStudy.emit(null);
    this.activeStudy = activeStudy;
  }

}
