import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ControlConstructService } from './controlconstruct.service';

@Component({
  selector: 'qddt-control-construct-questionitem-select',
  moduleId: module.id,
  template: `
  <div class="row card">
    <div class="row">
      <autocomplete [items]="questionItems"  class="black-text"
				[searchField]="['name', ['question','question']]"
        [isMutipleFields]="true"
        [placeholder] = "'Search in question name or question text'"
				(autocompleteFocusEvent)="selectedQuestionItemIndex=idx;"
				[initialValue]="''"
        [searchFromServer]="true"
				(enterEvent)="searchQuestionItems($event)"
				(autocompleteSelectEvent)="onSelectCreateQuestionItem($event)">
      </autocomplete>
    </div>
    <div class="row" *ngIf="selectedQuestionItem">
      <div class="row">
        <ul class="collection with-header black-text">
          <li class="collection-header">Question Item</li>
          <li  class="collection-item">Version: {{selectedQuestionItem?.version?.major}}.
            {{selectedQuestionItem?.version?.minor}}
          </li>
          <li class="collection-item">Name: {{selectedQuestionItem?.name}}</li>
          <li class="collection-item">Question Text: {{selectedQuestionItem?.question?.question}}</li>
          <li class="collection-item">Intent: {{selectedQuestionItem?.question?.intent}}</li>
        </ul>
      </div>
      <qddt-responsedomain-preview
        *ngIf="selectedQuestionItem.responseDomain"
        [isVisible]="true" [responseDomain]="selectedQuestionItem.responseDomain">
      </qddt-responsedomain-preview>
      <div class="row">
        <ul class="collection with-header black-text">
          <li class="collection-item" *ngFor="let c of selectedQuestionItem.conceptRefs" >Concept: {{c?.name}}</li>
        </ul>
      </div>
      <div class="row">
        <div class="input-field col s4" *ngIf="questionItemRevisions.length > 0">
          <label class="active black-text">QuestionItem business version</label>
          <select [(ngModel)]="questionItemRevision"
            (ngModelChange)="onSelectQuestionItemRevisions($event)"
            class="black-text"
            name="controlConstruct_questionItemRevision"
            materialize="material_select">
            <option *ngFor="let revision of questionItemRevisions"
              [selected]="revision.revisionNumber === questionItemRevision"
              [value]="revision.revisionNumber">
              {{revision?.entity?.version?.major}}.{{revision?.entity?.version?.minor}}
            </option>
          </select>
        </div>
        <div class="input-field col s6 right">
        <a class="waves-effect waves-light btn  green" (click)="onUseQuestionItem()">Use this</a>
        <a class="waves-effect waves-light btn  red" (click)="onDismiss()">Dismiss</a>
        </div>
      </div>
    </div>
  </div>
`,
  providers: [ControlConstructService],
})
export class ControlConstructQuestionItemSelectComponent implements OnInit {
  @Input() controlConstruct;
  @Output() useQuestionItemEvent = new EventEmitter<any>();
  @Output() dismissEvent: any = new EventEmitter<any>();
  error: any;
  questionItems: any[];
  selectedQuestionItemIndex: number;
  private questionItemRevisions: any[];
  private selectedQuestionItem: any;
  private questionItemRevision: number;

  constructor(private service: ControlConstructService) {
    this.questionItems = [];
    this.selectedQuestionItemIndex = -1;
    this.questionItemRevision = 0;
    this.questionItemRevisions = [];
  }

  ngOnInit() {
    if(this.controlConstruct !== null && this.controlConstruct !== undefined) {
      this.selectedQuestionItem = this.controlConstruct.questionItem;
    }
    if(this.selectedQuestionItem !== null && this.selectedQuestionItem !== undefined
      && this.selectedQuestionItem.id !== null && this.selectedQuestionItem.id !== undefined) {
      this.questionItemRevision = this.controlConstruct.questionItemRevision;
      this.service.getQuestionItemsRevisions(this.selectedQuestionItem.id).subscribe((result: any) => {
      this.questionItemRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
      this.onSelectQuestionItemRevisions();
    },
      (error: any) => { this.popupModal(error); });
    }
    this.searchQuestionItems('');
  }

  searchQuestionItems(key: string) {
    this.service.searchQuestionItemsByNameAndQuestion(key).subscribe((result: any) => {
      this.questionItems = result.content;
    },
      (error: any) => { this.popupModal(error); });
  }

  onSelectQuestionItemRevisions() {
    let r = this.questionItemRevision;
    if(typeof r === 'string') {
      r = parseInt(r);
    }
    this.questionItemRevision = r;
    let result = this.questionItemRevisions
      .find((e: any) => e.revisionNumber === r);
    if(result !== null && result !== undefined) {
      this.selectedQuestionItem = result.entity;
    } else if(this.questionItemRevisions.length > 0) {
      this.selectedQuestionItem = this.questionItemRevisions[0].entity;
      this.questionItemRevision = this.questionItemRevisions[0].revisionNumber;
    }
  }

  onSelectCreateQuestionItem(questionItem: any) {
    this.selectedQuestionItem = questionItem;
    this.controlConstruct.questionItem = questionItem;
    this.questionItemRevision = this.controlConstruct.questionItemRevision || 0;
    this.service.getQuestionItemsRevisions(questionItem.id).subscribe((result: any) => {
      this.questionItemRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
      this.onSelectQuestionItemRevisions();
    },
      (error: any) => { this.popupModal(error); });
  }

  onUseQuestionItem() {
    this.useQuestionItemEvent.emit('use');
    this.controlConstruct.questionItem = this.selectedQuestionItem;
    this.controlConstruct['questionItemRevision'] = this.questionItemRevision;
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

  private popupModal(error: any) {
    this.error = error;
  }

}
