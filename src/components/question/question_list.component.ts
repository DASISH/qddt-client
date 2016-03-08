import {Component,  EventEmitter, Output} from 'angular2/core';
import {Question,QuestionService} from './question.service';
import {QuestionDetail} from './question_detail.component';
import {QuestionCreateCmp} from './create.component';
import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'question-list',
  moduleId: module.id,
  pipes: [LocalDatePipe],
  directives: [QuestionCreateCmp, QuestionDetail],
  providers: [QuestionService],
  template:
`
  <div class="card white grey-text text-darken-1">

  <question-create (questionCreatedEvent)="questionCreatedEvent($event)"></question-create>

    <div *ngIf="questions">
      <table class="highlight">
        <thead>
          <tr>
            <th data-field="id">Details</th>
            <th data-field="id">Label</th>
            <th data-field="id">Question</th>
            <th data-field="id">Version</th>
            <th data-field="id">Agency</th>
            <th data-field="id">Modified</th>
            <th data-field="id">Modified-By</th>
          </tr>
        </thead>
        <tbody>
          <tr id="{{row.id}}"  *ngFor="#row of questions.content" (click)="selectQuestion(row)">
            <td>
              <question-detail [question]="selectedQuestion" ></question-detail>
            </td>
            <td>{{row.name}}</td>
            <td>{{row.question}}</td>
            <td>{{row.version.major}}.{{row.version.minor}} {{row.version.versionlabel}}</td>
            <td>{{row.agency.name}}</td>
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
  </div>

`

})
export class QuestionList {

  questions: any;
  selectedQuestion: Question = new Question();
  @Output() questionSelectEvent: EventEmitter<String> = new EventEmitter();

  constructor(private service: QuestionService) {

  }

  ngOnInit() {
    this.service.getAll().subscribe(result => this.questions = result);
  }

  selectQuestion(question: any) {
    console.log(question.name);
    this.selectedQuestion = question;
    this.questionSelectEvent.emit(question);
  }

  questionCreatedEvent() {
    this.service.getAll().subscribe(result => this.questions = result);
  }

  get diagnostic() { return JSON.stringify(this.questions); }
}
