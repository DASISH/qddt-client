import {Component, Output, EventEmitter, Input} from 'angular2/core';

import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {ResponseDomainSearchComponent} from '../responsedomain/responsedomain.search';
import {QuestionService, Question, QuestionItem} from './question.service';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';

@Component({
  selector: 'questionitem-reuseorcreate',
  directives: [MaterializeDirective, ResponseDomainSearchComponent, AutocompleteComponent],
  providers: [QuestionService],
  template: `
      <a materialize="leanModal" [materializeParams]="[{dismissible: false}]"
        class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
        [attr.href]="'#'+parentId+'-questionitem-modal'">
         <i class="material-icons left medium">playlist_add</i>
      </a>
      <div [attr.id]="parentId + '-questionitem-modal'" class="modal">
        <div class="modal-content">
          <div class="switch">
            <label>New QuestionItem
              <input type="checkbox" [(ngModel)]="reuseQuestionItem" >
              <span class="lever"></span>
              Reuse QuestionItem
            </label>
          </div>
          
          <div *ngIf="!reuseQuestionItem">
          <h3 class="teal-text ">Add new Question Item</h3>
          <form id="questionitem-create-form" (ngSubmit)="onSave()" #hf="ngForm">
            <div class="row black-text">
              <div class="row"><span>Question text</span>
                <input type="text" [(ngModel)]="questionItem.question.question" required>
              </div>
            </div>
            <div class="row black-text">
              <responsedomain-search (selectResponseDomainEvent)="selectResponseDomain($event)"></responsedomain-search>
            </div>
          </form>
          </div>
          <div *ngIf="reuseQuestionItem">
            <h3 class="teal-text ">Reuse Question Item</h3>
            <div class="row black-text">
              <autocomplete [items]="questionItems" [searchField]="['question','question']"
                [initialValue]="''"
                (autocompleteSelectEvent)="selectQuestionItem($event)">
              </autocomplete>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button *ngIf="!reuseQuestionItem"
            form="questionitem-create-form" type="submit"
            class="btn btn-default green waves-green">Submit</button>
          <button id="questionitem-modal-close"
            class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
  `
})
export class QuestionReuseComponent {
  @Input() parentId: string;
  private questionItem: QuestionItem;
  private questionItems: QuestionItem[];
  private reuseQuestionItem: boolean;
  @Output() private questionItemCreatedEvent: EventEmitter<any> = new EventEmitter();

  constructor(private questionService: QuestionService) {
    this.questionItem = new QuestionItem();
    this.questionItem.question = new Question();
    this.reuseQuestionItem = true;
    this.questionItems = [];
  }

  ngOnInit() {
    this.questionService.getQuestionItemPage().subscribe(
      result => { this.questionItems = result.content; });
  }

  onSave() {
    this.questionItem.question.name = this.questionItem.question['question'];
    this.questionService.save(this.questionItem.question)
      .subscribe(result => {
        this.questionItem.question = result;
        this.questionService.createQuestionItem(this.questionItem)
          .subscribe(result => {
            this.questionItem = new QuestionItem();
            this.questionItem.question = new Question();
            this.questionItemCreatedEvent.emit(result);
            document.getElementById('questionitem-modal-close').click();
          });
      });
  }

  selectResponseDomain(responsedomain) {
    this.questionItem.responseDomain = responsedomain;
  }

  selectQuestionItem(questionItem) {
    this.questionItemCreatedEvent.emit(questionItem);
    document.getElementById('questionitem-modal-close').click();
  }

}
