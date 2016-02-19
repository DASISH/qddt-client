import {Component, Input} from 'angular2/core';

import {QuestionService} from './questionservice';

@Component({
  selector: 'question-list',
  template: `
  <p>TEST comp</p>
  <div *ngIf="questions">
    <table class="highlight hoverable">
    <thead>
    <tr>
      <th data-field="id">id</th>
      <th data-field="id">created</th>
      <th data-field="id">updated</th>
      <th data-field="id">based_on_object</th>
      <th data-field="id">change_comment</th>
      <th data-field="id">change_kind</th>
      <th data-field="id">name</th>
      <th data-field="id">major</th>
      <th data-field="id">minor</th>
      <th data-field="id">version_label</th>
      <th data-field="id">concept_reference</th>
      <th data-field="id">grid_idx</th>
      <th data-field="id">grid_idx_rationale</th>
      <th data-field="id">intent</th>
      <th data-field="id">question</th>
      <th data-field="id">user_id</th>
      <th data-field="id">agency_id</th>
      <th data-field="id">parent_id</th>
      <th data-field="id">responsedomain_id</th>
    </tr>
    </thead>
    <tbody>
      <!--<td>{{content.entity.version.major}}.{{content.entity.version.minor}} {{content.entity.version.versionLabel}}</td>-->
    <tr *ngFor="#content of questions.content">
      <td>{{content.id}}</td>
      <td>{{content.created}}</td>
      <td>{{content.updated}}</td>
      <td>{{content.based_on_object}}</td>
      <td>{{content.change_comment}}</td>
      <td>{{content.change_kind}}</td>
      <td>{{content.name}}</td>
      <td>{{content.major}}</td>
      <td>{{content.minor}}</td>
      <td>{{content.version_label}}</td>
      <td>{{content.concept_reference}}</td>
      <td>{{content.grid_idx}}</td>
      <td>{{content.grid_idx_rationale}}</td>
      <td>{{content.intent}}</td>
      <td>{{content.question}}</td>
      <td>{{content.user_id}}</td>
      <td>{{content.agency_id}}</td>
      <td>{{content.parent_id}}</td>
      <td>{{content.responsedomain_id}}</td>
    </tr>
    </tbody>
  </table>
  </div>
`,
providers: [QuestionService]
})
export class QuestionList {

  questions: any;

  constructor(private service: QuestionService) {

  }

  ngAfterViewInit() {
    this.getAll();
  }

  getAll() {
    this.service.getAllQuestion()
      .subscribe(
        (questions: any) => this.questions = questions,
        (err: any) => QuestionService.logError('Unable to get all questions')
      );
  }

  get diagnostic() { return JSON.stringify(this.questions); }
}
