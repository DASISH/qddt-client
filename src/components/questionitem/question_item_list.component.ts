import {Component,  EventEmitter, Output} from 'angular2/core';
import {QuestionItem,QuestionItemService} from './question_item.service';
import {QuestionItemRevision} from './question_item_revision.component';
import {QuestionItemDetail} from './question_item_detail.component';
import {QuestionItemCreateCmp} from './create.component';
import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'questionitem-list',
  moduleId: module.id,
  pipes: [LocalDatePipe],
  directives: [QuestionItemCreateCmp, QuestionItemDetail,QuestionItemRevision],
  providers: [QuestionItemService],
  template:
`
  <div class="card white grey-text text-darken-1">

  <question-create (questionCreatedEvent)="onQuestionModified($event)"></question-create>

    <div *ngIf="questions">
      <table class="highlight">
        <thead>
          <tr>
            <th data-field="id">Details</th>
            <th data-field="id">Rev</th>
            <th data-field="id">Label</th>
            <th data-field="id">Question</th>
            <th data-field="id">Version</th>
            <th data-field="id">Agency</th>
            <th data-field="id">Modified</th>
            <th data-field="id">Modified-By</th>
          </tr>
        </thead>
        <tbody>
          <tr id="{{row.id}}"  *ngFor="#row of questions" >
            <td (click)="onSelectQuestion(row)">
              <question-detail [question]="selectedQuestion" (questionModifiedEvent)="onQuestionModified($event)"></question-detail>
            </td>
            <td (click)="onShowRevision(row)">
              <a><i class="material-icons left smal">history</i></a>
              <!--<question-revision [parentId]="row.id" ></question-revision>-->
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
export class QuestionItemList {

  questionItems: any[] = [];
  revision:any;
  selectedQuestionItem: QuestionItem = new QuestionItem();
  @Output() questionSelectEvent: EventEmitter<String> = new EventEmitter();

  constructor(private service: QuestionItemService) {
    this.revision = '0';
  }

  ngOnInit() {
    this.service.getPage()
      .subscribe(result => {
        this.questionItems = result.content;
      });
  }

  onSelectQuestion(question: any) {
    this.selectedQuestionItem = question;
    this.questionSelectEvent.emit(question);
  }

  onQuestionModified(question: any) {
    this.questionItems = this.questionItems.filter((q) => q.id !== question.id);
    this.questionItems.push(question);
  }

  onShowRevision(question: any) {
    console.log('show me the money' + question.name);
    this.revision = question.id;
  }

}
