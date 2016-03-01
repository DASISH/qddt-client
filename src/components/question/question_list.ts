import {Component} from 'angular2/core';
import {QuestionService} from './questionservice';
import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'question-list',
  pipes: [LocalDatePipe],
  template: `

  <div *ngIf="questions">
    <table class="highlight hoverable">
    <thead>
    <tr>
      <th data-field="id">Name</th>
      <th data-field="id">Question</th>
      <th data-field="id">Version</th>
      <th data-field="id">Modified</th>
      <th data-field="id">Modified-By</th>
    </tr>
    </thead>
    <tbody>
      <!--<td>{{content.entity.version.major}}.{{content.entity.version.minor}} {{content.entity.version.versionLabel}}</td>-->
    <tr *ngFor="#content of questions" id = {{content.id}}>

      <td>{{content.name}}</td>
      <td>{{content.question}}</td>
      <td>{{content.version.major}}.{{content.version.minor}}.{{content.version.versionlabel}}</td>
      <td>{{content.updated | localDate}}</td>
      <td>{{content.createdBy.username}}</td>
    </tr>
    </tbody>
  </table>

    <!--<li *ngFor="#question of questions | stringFilter: filter | paginate: config">-->
        <!--{{ question }}-->
    <!--</li>-->

<!--<div class="text-center">-->
    <!--<pagination-controls [id]="config.id"-->
                         <!--[maxSize]="maxSize"-->
                         <!--[directionLinks]="directionLinks"-->
                         <!--[autoHide]="autoHide"-->
                         <!--(pageChange)="onPageChange($event)"></pagination-controls>-->
 <!--</div>-->

  </div>
`,
providers: [QuestionService]
})
export class QuestionList {

  questions: any;

  constructor(private service: QuestionService) {
    this.questions = this.service.getModel();
  }

  ngAfterViewInit() {
    //this.questions = this.service.getModel();
    QuestionService.logError('After init');
  }

  //getAll() {
  //
  //    .subscribe(
  //      (questions: any) => this.questions = questions,
  //      (err: any) => QuestionService.logError('Unable to get all questions')
  //    );
  //}

  get diagnostic() { return JSON.stringify(this.questions); }
}
