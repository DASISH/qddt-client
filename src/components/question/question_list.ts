import {Component,  EventEmitter, Output} from 'angular2/core';
import {Question,QuestionService} from './questionservice';
import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'question-list',
  pipes: [LocalDatePipe],
  providers: [QuestionService],
  template:
`
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
        <tr *ngFor="#row of questions" (click)="onSelect(row)">
          <td>{{row.name}}</td>
          <td>{{row.question}}</td>
          <td>{{row.version.major}}.{{row.version.minor}}.{{row.version.versionlabel}}</td>
          <td>{{row.updated | localDate}}</td>
          <td>{{row.createdBy.username}}</td>
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
`

})
export class QuestionList {

  questions: any;
  selectedQuestion:Question;
  @Output() questionSelectEvent: EventEmitter<String> = new EventEmitter();

  constructor(private service: QuestionService) {
    this.questions = this.service.getModel();
  }

  onSelect(question: any) {
    this.selectedQuestion = question;
    this.questionSelectEvent.emit(question);
  }

  ngAfterViewInit() {
    //this.questions = this.service.getModel();

  }



  get diagnostic() { return JSON.stringify(this.questions); }
}
