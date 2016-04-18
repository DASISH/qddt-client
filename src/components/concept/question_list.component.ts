import {Component, Input} from 'angular2/core';

import {ConceptService} from './concept.service';

@Component({
  selector: 'question-list',
  moduleId: module.id,
  pipes: [],
  directives: [],
  providers: [ConceptService],
  styles: [
    '.questionlist{ border-color: #888; border-style: solid; width: 100%;}',
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
    <div *ngIf="concept" class="questionlist">
      <label class="active teal-text">List Questions of {{concept.name}}</label>
      <ul><li *ngFor="#question of concept.questions">{{question.question}}</li></ul>
      <div *ngIf="concept" class="autocomplete">
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
    /*this.conceptService.attachQuestion(this.concept, suggestion.id).subscribe(result => {
        this.concept = result;
        this.filterQuestions();
      });*/
  }

}
