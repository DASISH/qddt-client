import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { QuestionService, Question, QuestionItem } from './question.service';

@Component({
  selector: 'questionitem-reuseorcreate',
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
              <input type="checkbox" [(ngModel)]="reuseQuestionItem"
              (ngModelChange)="onReuseQuestionItem()">
              <span class="lever"></span>
              Reuse QuestionItem
            </label>
          </div>
          <form #hf="ngForm">          
          <div *ngIf="!reuseQuestionItem">
          <h3 class="teal-text ">Add new Question Item</h3>
            <div class="row black-text">
              <div class="row"><span>Question text</span>
                <input name="question-text" type="text" [(ngModel)]="questionItem.question.question" required>
              </div>
            </div>
            <div class="row black-text">
              <responsedomain-search (selectResponseDomainEvent)="selectResponseDomain($event)"></responsedomain-search>
            </div>
          </div>
          <div *ngIf="reuseQuestionItem">
            <h3 class="teal-text ">Reuse Question Item</h3>
            <div class="row black-text"><span>{{questionItem?.question?.question}}</span></div>
            <div class="row black-text">
              <autocomplete [items]="questionItems" [searchField]="['question','question']"
                [initialValue]="''"
                [searchFromServer]="true"
                (autocompleteFocusEvent)="selectedIndex=idx;"
                (enterEvent)="searchQuestionItems($event)"
                (autocompleteSelectEvent)="selectQuestionItem($event)">
              </autocomplete>
            </div>
          </div>
          </form>
        </div>
        <div class="modal-footer">
          <button (click)="onSave()" type="submit"
            class="btn btn-default green waves-green">Submit</button>
          <button [attr.id]="parentId + '-questionitem-modal-close'"
            class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
  `
})
export class QuestionReuseComponent implements OnInit {
  @Input() parentId: string;
  @Output() questionItemCreatedEvent: EventEmitter<any> = new EventEmitter<any>();
  reuseQuestionItem: boolean;
  selectedIndex: number;
  private questionItem: QuestionItem;
  private questionItems: QuestionItem[];

  constructor(private questionService: QuestionService) {
    this.questionItem = new QuestionItem();
    this.reuseQuestionItem = true;
    this.selectedIndex = 0;
    this.questionItems = [];
  }

  ngOnInit() {
    this.questionService.getQuestionItemPage().subscribe(
      result => { this.questionItems = result.content; });
  }

  searchQuestionItems(name: string) {
    this.questionService.searchQuestionItems(name).subscribe((result: any) => {
      this.questionItems = result.content;
    });
  }

  onReuseQuestionItem() {
    if(!this.reuseQuestionItem) {
      this.questionItem = new QuestionItem();
      this.questionItem.question = new Question();
    }
  }

  onSave() {
    if(!this.reuseQuestionItem) {
      this.questionItem.question = new Question();
      this.questionItem.question.name = this.questionItem.question['question'];
      this.questionService.save(this.questionItem.question)
      .subscribe(result => {
        this.questionItem.question = result;
        this.questionService.createQuestionItem(this.questionItem)
          .subscribe(result => {
            this.questionItem = new QuestionItem();
            this.questionItem.question = new Question();
            this.questionItemCreatedEvent.emit(result);
            document.getElementById(this.parentId + '-questionitem-modal-close').click();
          });
      });
    } else {
      this.questionItemCreatedEvent.emit(this.questionItem);
      this.questionItem = new QuestionItem();
      document.getElementById(this.parentId + '-questionitem-modal-close').click();
    }
  }

  selectResponseDomain(responsedomain) {
    this.questionItem.responseDomain = responsedomain;
  }

  selectQuestionItem(questionItem) {
    this.questionItem = questionItem;
  }

}
