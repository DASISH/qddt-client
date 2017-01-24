import { Component, Output, EventEmitter, Input } from '@angular/core';

import { QuestionService, Question, QuestionItem } from './question.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'questionitem-reuseorcreate',
  providers: [QuestionService],
  template: `
      <a class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
        (click)="openModal()">
        <i class="material-icons left medium">playlist_add</i>
      </a>
      <div class="modal modal-fixed-footer"
        materialize [materializeActions]="actions">
        <div class="modal-content">
          <form #hf="ngForm">          
          <div *ngIf="reuseQuestionItem">
            <h3 class="teal-text ">Reuse Question Item</h3>
            <div class="row black-text"><span>{{questionItem?.question?.question}}</span></div>
            <div class="row black-text">
              <autocomplete [items]="questionItems" [searchField]="['name', ['question','question']]"
                [initialValue]="''"
                [searchFromServer]="true"
                [isMutipleFields]="true"
                (autocompleteFocusEvent)="selectedIndex=idx;"
                (enterEvent)="searchQuestionItems($event)"
                [placeholder] = "'Search in question name or question text'"
                (autocompleteSelectEvent)="selectQuestionItem($event)">
              </autocomplete>
            </div>
          </div>
          </form>
        </div>
        <div class="modal-footer">
          <button (click)="onSave()" type="submit"
            class="btn btn-default modal-close green waves-green">Submit</button>
          <button
            class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
  `
})
export class QuestionReuseComponent {
  @Input() parentId: string;
  @Output() questionItemCreatedEvent: EventEmitter<any> = new EventEmitter<any>();
  reuseQuestionItem: boolean;
  selectedIndex: number;
  secondCS: any;
  missingCategories: any[];
  selectedCategoryIndex: number;
  actions = new EventEmitter<any>();
  private questionItem: QuestionItem;
  private questionItems: QuestionItem[];
  private mainresponseDomainRevision: number;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private questionService: QuestionService) {
    this.questionItem = new QuestionItem();
    this.questionItem.question = new Question();
    this.questionItem.responseDomain = null;
    this.reuseQuestionItem = true;
    this.selectedIndex = 0;
    this.questionItems = [];
    this.secondCS = null;
    this.selectedCategoryIndex = 0;
    this.missingCategories = [];
    this.mainresponseDomainRevision = 0;
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.questionService.searchQuestionItemsByNameAndQuestion(name).subscribe((result: any) => {
          this.questionItems = result.content;
        });
      });
  }

  searchQuestionItems(name: string) {
    this.searchKeysSubect.next(name);
  }

  onSave() {
    if(this.reuseQuestionItem) {
      this.questionItemCreatedEvent.emit(this.questionItem);
      this.questionItem = new QuestionItem();
    }
  }

  selectQuestionItem(questionItem) {
    this.questionItem = questionItem;
  }

  openModal() {
    this.actions.emit('openModal');
    this.questionService.getQuestionItemPage().subscribe(
      result => { this.questionItems = result.content;
      }, (error: any) => console.log(error));
  }

}
