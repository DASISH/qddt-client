import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ControlConstructService } from './controlconstruct.service';
import { ElementKind, QddtElements } from '../preview/preview.service';

@Component({
  selector: 'qddt-control-construct-questionitem-select',
  moduleId: module.id,
  templateUrl: 'controlconstruct.questionitem.select.component.html' ,
  providers: [ControlConstructService],
})
export class ControlConstructQuestionItemSelectComponent implements OnInit {
  @Input() controlConstruct;
  @Output() useQuestionItemEvent = new EventEmitter<any>();
  @Output() dismissEvent: any = new EventEmitter<any>();

  public readonly QUESTIONITEM = QddtElements[ElementKind.QUESTIONITEM];
  public questionItems: any[];
  public selectedQuestionItemIndex: number;
  public selectedQuestionItem: any;

  private questionItemRevisions: any[];
  private questionItemRevision: number;

  constructor(private service: ControlConstructService) {
    this.questionItems = [];
    this.selectedQuestionItemIndex = -1;
    this.questionItemRevision = 0;
    this.questionItemRevisions = [];
  }

  ngOnInit() {
    if (this.controlConstruct) {
      this.selectedQuestionItem = this.controlConstruct.questionItem;
    }
    if (this.selectedQuestionItem && this.selectedQuestionItem.id) {
      this.questionItemRevision = this.controlConstruct.questionItemRevision;
      this.service.getQuestionItemsRevisions(this.selectedQuestionItem.id).then((result: any) => {
      this.questionItemRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
      this.onSelectQuestionItemRevisions();
    });
    }
    this.searchQuestionItems('');
  }

  searchQuestionItems(key: string) {
    this.service.searchQuestionItemsByNameAndQuestion(key).then((result: any) => {
      this.questionItems = result.content;
    });
  }

  onSelectQuestionItemRevisions() {
    let r = this.questionItemRevision;
    if (typeof r === 'string') {
      r = parseInt(r);
    }
    this.questionItemRevision = r;
    const result = this.questionItemRevisions
      .find((e: any) => e.revisionNumber === r);
    if (result !== null && result !== undefined) {
      this.selectedQuestionItem = result.entity;
    } else if (this.questionItemRevisions.length > 0) {
      this.selectedQuestionItem = this.questionItemRevisions[0].entity;
      this.questionItemRevision = this.questionItemRevisions[0].revisionNumber;
    }
  }

  onSelectCreateQuestionItem(questionItem: any) {
    this.selectedQuestionItem = questionItem;
    this.controlConstruct.questionItem = questionItem;
    this.questionItemRevision = this.controlConstruct.questionItemRevision || 0;
    this.service.getQuestionItemsRevisions(questionItem.id).then((result: any) => {
      this.questionItemRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
      this.onSelectQuestionItemRevisions();
    });
  }

  onUseQuestionItem() {
    this.useQuestionItemEvent.emit('use');
    this.controlConstruct.questionItem = this.selectedQuestionItem;
    this.controlConstruct['questionItemRevision'] = this.questionItemRevision;
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

}
