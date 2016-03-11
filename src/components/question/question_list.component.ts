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

  <question-create (questionCreatedEvent)="onQuestionModified($event)"></question-create>

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
          <tr id="{{row.id}}"  *ngFor="#row of questions" (click)="onSelectQuestion(row)">
            <td>
              <question-detail [question]="selectedQuestion" (questionModifiedEvent)="onQuestionModified($event)"></question-detail>
            </td>
            <td>{{row.name}}</td>
            <td>{{row.question}}</td>
            <td>{{row.version.major}}.{{row.version.minor}} {{row.version.versionlabel}}</td>
            <td>{{row.agency.name}}</td>
            <td>{{row.modified | localDate}}</td>
            <td>{{row.modifiedBy.username}}</td>
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

  questions: any[] = [];
  selectedQuestion: Question = new Question();
  @Output() questionSelectEvent: EventEmitter<String> = new EventEmitter();

  constructor(private service: QuestionService) {  }

  ngOnInit() {
    this.service.getPage()
      .subscribe(result => {
        this.questions = result.content;
      });
  }

  onSelectQuestion(question: any) {
    this.selectedQuestion = question;
    this.questionSelectEvent.emit(question);
  }

  onQuestionModified(question: any) {
    this.questions = this.questions.filter((q) => q.id !== question.id);
    this.questions.push(question);
  }

}
