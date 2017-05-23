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
              <div *ngIf="questionItem">
                <div class="row">
                  <ul class="collection with-header black-text">
                    <li class="collection-header">Question Item</li>
                    <li  class="collection-item">Version: {{questionItem?.version?.major}}.
                      {{questionItem?.version?.minor}}
                    </li>
                    <li class="collection-item">Name: {{questionItem?.name}}</li>
                    <li class="collection-item">Question Text: {{questionItem?.question?.question}}</li>
                    <li class="collection-item">Intent: {{questionItem?.question?.intent}}</li>
                  </ul>
                </div>
                <qddt-responsedomain-preview *ngIf="questionItem.responseDomain"
                  [isVisible]="true" [responseDomain]="questionItem.responseDomain">
                </qddt-responsedomain-preview>
                <div class="row">
                  <div class="input-field col s4" *ngIf="elementRevisions.length > 0">
                    <label class="active black-text">business version</label>
                    <select [(ngModel)]="elementRevision"
                      (ngModelChange)="onSelectElementRevisions($event)"
                      class="black-text"
                      name="element-revision"
                      materialize="material_select">
                      <option *ngFor="let revision of elementRevisions"
                        [selected]="revision.revisionNumber === elementRevision"
                        [value]="revision.revisionNumber">
                        {{revision?.entity?.version?.major}}.{{revision?.entity?.version?.minor}}
                      </option>
                    </select>
                  </div>
                  <div class="input-field col s6 right">
                    <a class="waves-effect waves-light btn green" (click)="onUseElement()">Use this</a>
                    <a class="waves-effect waves-light btn red" (click)="closeModal()">Dismiss</a>
                  </div>
                </div>
              </div>
              <qddt-revision [isVisible]="revisionIsVisible" *ngIf="revisionIsVisible"
                [current]="questionItem"
                [qddtURI]="'audit/questionitem/' + questionItem.id + '/all'"
                [config]="config"></qddt-revision>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
  `
})
export class QuestionReuseComponent {
  @Input() parentId: string;
  @Output() questionItemCreatedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() dismissEvent: any = new EventEmitter<any>();
  reuseQuestionItem: boolean;
  selectedIndex: number;
  actions = new EventEmitter<any>();
  questionItem: QuestionItem;
  revisionIsVisible: boolean = false;
  config: any[];
  questionItems: QuestionItem[];
  elementRevisions: any[];
  elementRevision: any;
  selectedElement: any;
  private mainresponseDomainRevision: number;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private questionService: QuestionService) {
    this.questionItem = null;
    this.reuseQuestionItem = true;
    this.selectedIndex = 0;
    this.questionItems = [];
    this.elementRevisions = [];
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

  onSelectElementRevisions() {
    let r = this.elementRevision;
    if(typeof r === 'string') {
      r = parseInt(r);
    }
    this.elementRevision = r;
    let result = this.elementRevisions
      .find((e: any) => e.revisionNumber === r);
    if(result !== null && result !== undefined) {
      this.selectedElement = result.entity;
    } else if(this.elementRevisions.length > 0) {
      this.selectedElement = this.elementRevisions[0].entity;
      this.elementRevision = this.elementRevisions[0].revisionNumber;
    }
  }

  onUseElement() {
     if(this.reuseQuestionItem) {
      this.questionItem['questionItemRevision'] = this.elementRevision;
      this.questionItemCreatedEvent.emit(this.questionItem);
      this.questionItem = null;
      this.actions.emit('closeModal');
    }
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

  searchQuestionItems(name: string) {
    this.searchKeysSubect.next(name);
  }

  selectQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.revisionIsVisible = false;
    this.selectedElement = this.questionItem;
    if (this.questionItem !== null && this.questionItem !== undefined
      && this.questionItem.id !== null && this.questionItem.id !== undefined) {
      this.questionService.getQuestionItemRevisions(this.questionItem.id).subscribe((result: any) => {
        this.elementRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.onSelectElementRevisions();
      },
        (error: any) => { console.log('error'); });
    }
  }

  openModal() {
    this.actions.emit('openModal');
    this.questionService.getQuestionItemPage().subscribe(
      result => { this.questionItems = result.content;
      }, (error: any) => console.log(error));
  }

  closeModal() {
    this.actions.emit('closeModal');
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
