import { Component, Output, EventEmitter, Input } from '@angular/core';

import { QuestionService, QuestionItem } from './question.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'qddt-questionitem-reuse',
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
          <div class="row" *ngIf="questionItem">
            <div class="row teal-text">
              <label class="active teal-text flow-text">Version: <!--
                -->{{questionItem?.version?.major}}.{{questionItem?.version?.minor}}
              </label>
            </div>
            <div class="col s1 m1 l1">
              <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                (click)="revisionIsVisible = !revisionIsVisible">
                <i class="material-icons left medium">history</i>
              </a>
            </div>
            <div class="col s10 m10 l10 grey-text text-darken-2">
              <div class="row teal-text">
                <h5>{{questionItem?.question?.question}}</h5>
              </div>
              <qddt-questionitem-edit [isVisible]="true"
                [editResponseDomain]="true"
                [readonly]="true"
                [questionitem]="questionItem">
              </qddt-questionitem-edit>
              <qddt-revision [isVisible]="revisionIsVisible" *ngIf="revisionIsVisible"
                [current]="questionItem"
                [qddtURI]="'audit/questionitem/' + questionItem.id + '/all'"
                [config]="config"></qddt-revision>
            </div>
          </div>
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
  questionItem: QuestionItem;
  revisionIsVisible: boolean = false;
  config: any[];
  questionItems: QuestionItem[];
  private mainresponseDomainRevision: number;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private questionService: QuestionService) {
    this.questionItem = null;
    this.reuseQuestionItem = true;
    this.selectedIndex = 0;
    this.questionItems = [];
    this.secondCS = null;
    this.selectedCategoryIndex = 0;
    this.missingCategories = [];
    this.config = this.buildRevisionConfig();
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
      this.questionItem = null;
    }
  }

  selectQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.revisionIsVisible = false;
  }

  openModal() {
    this.actions.emit('openModal');
    this.questionService.getQuestionItemPage().subscribe(
      result => { this.questionItems = result.content;
      }, (error: any) => console.log(error));
  }

  private buildRevisionConfig(): any[] {
    let config: any[] = [];
    config.push({'name':'name','label':'Name'});
    config.push({'name':['question', 'question'],'label':'Question'});
    config.push({'name':['question', 'intent'],'label':'Intent'});
    config.push({'name':['responseDomain', 'name'],'label':'responseDomain'});
    config.push({'name':['responseDomain', 'version'],'label':'RespD', 'init': function (version: any) {
      return 'V' + version['major'] +'.' + version['minor'];
    }});

    return config;
  }

}
