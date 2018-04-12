import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TemplateService } from '../template/template.service';
import { QuestionItem } from './question.service';
import { ResponseDomain } from '../responsedomain/responsedomain.service';
import { QddtElement, QDDT_ELEMENTS, ElementKind } from '../shared/elementinterfaces/elements';
import { Page } from '../shared/table/table.page';

@Component({
  selector: 'qddt-questionitem-reuse',
  moduleId: module.id,
  templateUrl: './question.reuse.component.html',
})

export class QuestionReuseComponent {
  @Input() parentId: string;
  @Input() name: string;
  @Output() createdEvent = new EventEmitter<any>();
  @Output() dismissEvent = new EventEmitter<any>();

  closeReuseActions = new EventEmitter<any>();

  revisionIsVisible = false;
  reuseQuestionItem = true;
  selectedIndex: number;
  questionItem: QuestionItem;
  questionItems: QuestionItem[];
  elementRevisions: any[];
  elementRevision: any;
  selectedElement: any;
  private mainresponseDomainRevision: number;
  private searchKeysListener: Subject<string> = new Subject<string>();
  private readonly QUESTION_KIND: QddtElement = QDDT_ELEMENTS[ElementKind.QUESTION_ITEM];
  private page = new Page();


  constructor(private service: TemplateService) {
    this.reuseQuestionItem = true;
    this.selectedIndex = 0;
    this.questionItems = [];
    this.elementRevisions = [];
    this.mainresponseDomainRevision = 0;
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.searchByKind(ElementKind.QUESTION_ITEM, name, this.page).then((result: any) => {
          this.questionItems = result.content;
        });
      });
  }

  onSelectElementRevisions() {
    let r = this.elementRevision;
    if (typeof r === 'string') {
      r = parseInt(r);
    }
    this.elementRevision = r;
    const result = this.elementRevisions
      .find((e: any) => e.revisionNumber === r);
    if (result !== null && result !== undefined) {
      this.selectedElement = result.entity;
    } else if (this.elementRevisions.length > 0) {
      this.selectedElement = this.elementRevisions[0].entity;
      this.elementRevision = this.elementRevisions[0].revisionNumber;
    }
  }

  onUseElement() {

    if (this.reuseQuestionItem ) {
      if (!this.questionItem ) {
        this.questionItem = this.selectedElement;
      }

      this.questionItem['questionItemRevision'] = this.elementRevision;
      this.createdEvent.emit(this.questionItem);
      this.questionItem = null;
      this.closeQuestionReuseModal();
    }
  }

  searchQuestionItems(name: string) {
    this.searchKeysListener.next(name);
  }

  selectQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.revisionIsVisible = false;
    this.selectedElement = this.questionItem;
    if (this.questionItem !== null && this.questionItem !== undefined
      && this.questionItem.id !== null && this.questionItem.id !== undefined) {
      this.service.getRevisionsByKind(ElementKind.QUESTION_ITEM, this.questionItem.id).then(
        (result: any) => {
        this.elementRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.onSelectElementRevisions();
      });
    }
  }

  openModal2() {
    this.closeReuseActions.emit({action: 'modal', params: ['open']});
    this.service.searchByKind(ElementKind.QUESTION_ITEM, '*', this.page).then(
      result => {
        this.questionItems = result.content;
        this.page = new Page( result.page );
      });
  }

  closeQuestionReuseModal() {
    this.closeReuseActions.emit({action: 'modal', params: ['close']});
  }

  responseDomainReuse(rd: ResponseDomain) {
    this.questionItem.responseDomain = rd;
  }


}
