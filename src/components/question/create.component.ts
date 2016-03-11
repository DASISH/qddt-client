import {Component, Output, EventEmitter} from 'angular2/core';

import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

import {QuestionService, Question} from './question.service';

@Component({
  selector: 'question-create',
  directives: [MaterializeDirective],
  template: `

      <a materialize="leanModal" [materializeParams]="[{dismissible: false}]"
        class="modal-trigger btn " href="#question-modal">
         <i class="material-icons left">create</i> Add new Question
      </a>

      <div id="question-modal" class="modal">
        <div class="modal-content">

        <h3 class="teal-text ">Add new Question</h3>

          <form id="question-create-form" (ngSubmit)="onSave()" #hf="ngForm">

            <div class="row">
              <div class="input-field col">
                <input id="name" type="text" [(ngModel)]="question.name" required>
                <label for="name" class="teal-text">Name</label>
              </div>
            </div>

            <div class="row">
              <div class="input-field col s10">
                <textarea id="question" class="materialize-textarea" [(ngModel)]="question.question" required></textarea>
                <label for="question" class="teal-text">Question</label>
              </div>
            </div>

            <div class="row">
              <div class="input-field col">
                <input id="version" type="text" [(ngModel)]="question.intent" required>
                <label for="version" class="teal-text">Intent</label>
              </div>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <button form="question-create-form"  type="submit" class="btn btn-default green waves-green">Submit</button>
          <button  class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
  `
})
export class QuestionCreateCmp {

  private question: Question;
  @Output() private questionCreatedEvent: EventEmitter<any> = new EventEmitter();

  constructor(private questionService: QuestionService) {
    this.question = new Question();
  }

  onSave() {
    this.questionService.save(this.question)
      .subscribe(result => {
        this.question = new Question();
        this.questionCreatedEvent.emit(result);
      });
  }

}
