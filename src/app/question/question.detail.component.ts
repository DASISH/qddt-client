import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { QuestionService, QuestionItem } from './question.service';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind } from '../shared/elementinterfaces/elements';

const filesaver = require('file-saver');


@Component({
  selector: 'qddt-questionitem-detail',
  moduleId: module.id,
  templateUrl: './question.detail.component.html',
})

export class QuestionDetailComponent implements OnInit {
  @Input() questionitem: QuestionItem;
  @Input() questionitemId: string;
  @Input() questionitems: QuestionItem[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() editQuestionItem: EventEmitter<any> = new EventEmitter<string|MaterializeAction>();

  public readonly QUESTIONITEM = ElementKind.QUESTION_ITEM;

  public deleteAction = new EventEmitter<string|MaterializeAction>();
  public canDelete: number; // 0: cannot, 1: can, 2: checking
  public previewObject: any;
  public config: any[];
  public revisionIsVisible: boolean;
  public editIsVisible: boolean;
  public conceptIsVisible: boolean;


  constructor(private service: QuestionService) {
    this.revisionIsVisible = false;
    this.editIsVisible = false;
    this.conceptIsVisible = false;
    this.config = this.getConfig();
  }

  ngOnInit() {
    if (!this.questionitems) {
      this.questionitems = [];
    }
    if (this.questionitemId) {
      this.service.getquestion(this.questionitemId)
        .then((result: any) => this.questionitem = result);
    }
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onEditQuestionItem(questionitem: QuestionItem) {
    const index = this.questionitems.findIndex((e: any) => e.id === questionitem.id);
    if (index >= 0) {
      this.questionitems[index] = questionitem;
    } else {
      this.questionitems.push(questionitem);
    }
    this.hideDetail();
  }

  onDeleteQuestionItemModal() {
    this.checkDeleteQuestionItem();
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onShowRevision(element: any) {
    this.previewObject = element;
  }

  checkDeleteQuestionItem() {
    const usedby: any = this.questionitem.conceptRefs;
    this.canDelete = 2; // checking
    if (usedby && usedby.length > 0) {
      this.canDelete = 0;
    }
/*     else {
      this.service.getControlConstructsByQuestionItem(this.questionitem.id)
        .then((result: any) => {
          if (result.length > 0) {
            this.canDelete = 0;
          } else {
            this.canDelete = 1;
          }
        },
        (error: any) => { this.canDelete = 0; throw error; });
    } */
  }

  onConfirmDeleting() {
    this.service.deleteQuestionItem(this.questionitem.id)
      .subscribe(() => {
        const i = this.questionitems.findIndex(q => q['id'] === this.questionitem.id);
        if (i >= 0) {
          this.questionitems.splice(i, 1);
        }
        this.deleteAction.emit({action: 'modal', params: ['close']});
        this.hideDetailEvent.emit('hide');
      });

  }

  getPdf(element: QuestionItem) {
    const fileName = element.name + '.pdf';
    this.service.getPdf(element.id).subscribe(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  private getConfig(): any[] {
     return [
        {'name': 'name', 'label': 'Name'},
        {'name': 'question', 'label': 'question'},
        {'name': 'intent', 'label': 'Intent'},
        {'name': ['responseDomain', 'name'], 'label': 'responseDomain'},
        {'name': ['responseDomain', 'version'], 'label': 'RespD', 'init': function (version: any) {
           return 'V' + version['major'] + '.' + version['minor']; } }
     ];
  }

}
