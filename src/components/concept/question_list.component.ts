import {Component, Input} from 'angular2/core';

import {ConceptService} from './concept.service';

@Component({
  selector: 'question-list',
  moduleId: module.id,
  pipes: [],
  directives: [],
  providers: [ConceptService],
  styles: [
    // '.questionlist{ class="z-depth-2" }',
    '.autocomplete { width: 100%; position: relative;}',
    '.autocomplete input{width: 80%;}',
    `.autocomplete ul{ position: absolute; left: 0;
        width: 100%; border-left: 1px solid #888;
        border-right: 1px solid #888;
        border-bottom: 1px solid #888;
        margin-top: 2px;
        z-index: 100;}`,
     `.autocomplete li{
        text-align: left;
        list-style:none;
        width: 100%;
        padding:0.4em;
        background-color: #fff;}`,
      `.autocomplete li.active{ width: 100%;background-color: #4bf;}`,
      `.autocomplete .highlight { background-color: #E2E2E2;}`,
      `.autocomplete li.active .highlight { background: #666; color: #fff;}`,
  ],
  template: `
  <div *ngIf="concept" class="section">
    <!--<div class="divider"></div>-->
    <ul class="collection with-header">
      <li class="collection-header">Questions</li>
      <li class="collection-item" *ngFor="#question of concept.questions">
        <div>
          <i class="material-icons tiny">assignment_turned_in</i> {{question.question}}
          <a href="#!" class="secondary-content" (click)="removeQuestion(question.id)"><i class="material-icons">delete_forever</i></a>
        </div>
      </li>
    </ul>
    <div *ngIf="concept" class="autocomplete">
      <i class="material-icons">assignment_turned_in</i>
      <input 
        (blur)="showAutoComplete=false;"
        (keyup)="enterText($event)"
        (focus)="showAutoComplete=true;">
        <ul *ngIf="showAutoComplete && suggestions != undefined && suggestions.length > 0">
          <li
            *ngFor="#suggestion of suggestions;#idx=index"
            [ngClass]="{ active: (idx === selectedIndex) }"
            (mouseover)="selectedIndex=idx;"
            (mousedown)="select(suggestion)">{{suggestion.question}}
          </li>
        </ul>
    </div>
  </div>
`
})
export class QuestionListComponent {

  @Input() concept: any;
  @Input() allQuestions: any;
  selectedIndex: any;
  showAutoComplete: boolean;
  private suggestions:any;

  constructor(private conceptService: ConceptService) {
    this.selectedIndex = 0;
    this.showAutoComplete = false;
  }

  ngOnInit() {
    this.filterQuestions();
  }

  enterText($event)  {
    this.filterQuestions($event.target.value);
  }

  removeQuestion(questionId:any) {
    this.conceptService.deattachQuestion(this.concept.id, questionId)
      .subscribe(result => {
          this.concept = result;
          this.filterQuestions();
        }
        ,(err) => console.log('ERROR: ', err));
  }

  filterQuestions(search: string = '') {
    let questions = this.concept.questions;
    this.suggestions = this.allQuestions.filter(
      function (question) {
        return questions.filter(function (k) {return k.name === question.name;}).length === 0
          && question.question.indexOf(search) >= 0;
    });
  }

  select(suggestion: any) {
    this.showAutoComplete = false;
    this.concept.questions.push(suggestion);
    this.filterQuestions();
    this.conceptService.attachQuestion(this.concept.id, suggestion.id)
      .subscribe(result => {
        this.concept = result;
        this.filterQuestions();
      }
      ,(err) => console.log('ERROR: ', err));
  }

}
