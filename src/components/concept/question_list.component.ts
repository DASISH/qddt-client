import {Component} from 'angular2/core';

import {QuestionService} from '../question/question.service';
import {LocalDatePipe} from '../../common/date_pipe';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

@Component({
  selector: 'question-list',
  moduleId: module.id,
  pipes: [LocalDatePipe],
  directives: [MaterializeDirective],
  providers: [QuestionService],
  template: `
    <div *ngIf="questions">
      <label class="active teal-text">Questions List</label>
      <table class="highlight">
        <thead>
          <tr>
            <th data-field="id">Name</th>
            <th data-field="id">Question</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="#question of questions">
            <td>{{question.name}}</td>
            <td>{{question.question}}</td>
          </tr>
        </tbody>
      </table>
     </div>
     <div *ngIf="allofquestions" class="input-field col s12">
      <select class="browser-default"  (change)="onSelectQuestoin($event)">
        <option value="" disabled selected>Attach question</option>
        <option *ngFor="#question of allofquestions" [value]="question.name">{{question.question}}</option>
      </select>
      </div>

`
})
export class QuestionListComponent {

  private questions: any;
  private allofquestions: any;

  constructor(private questionService:QuestionService) {
      this.questions = [];
  }

  ngOnInit() {
    this.questionService.getPage().subscribe(result => {
        this.allofquestions = result.content;
      });
  }

  onSelectQuestoin(event) {
    var select = event.target,
      val = select.options[select.selectedIndex].value,
      johnRemoved = this.allofquestions.filter(function (question) {
        return question.name === val;});
    this.allofquestions = this.allofquestions.filter(function (question) {
      return question.name !== val;});
    this.questions.push(johnRemoved[0]);
    select.selectedIndex = 0;
  }
}
