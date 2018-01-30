import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { QuestionService, QuestionItem } from './question.service';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind } from '../preview/preview.service';
const saveAs = require('file-saver');


@Component({
  selector: 'qddt-questionitem-detail',
  moduleId: module.id,
  templateUrl: './question.detail.component.html',
  providers: [QuestionService],
})

export class QuestionDetailComponent implements OnInit {
  @Input() questionitem: QuestionItem;
  @Input() questionitemId: string;
  @Input() questionitems: QuestionItem[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() editQuestionItem: EventEmitter<any> = new EventEmitter<string|MaterializeAction>();
  deleteAction = new EventEmitter<string|MaterializeAction>();
  canDelete: number; // 0: cannot, 1: can, 2: checking
  previewActions = new EventEmitter<MaterializeAction>();
  previewObject: any;

  private revisionKind = ElementKind.QUESTIONITEM;
  private revisionIsVisible: boolean;
  private editIsVisible: boolean;
  private conceptIsVisible: boolean;
  private config: any[];
  private savedObject: string;
  private savedQuestionitemsIndex: number;


  constructor(private service: QuestionService) {
    this.revisionIsVisible = false;
    this.editIsVisible = false;
    this.conceptIsVisible = false;
  }

  ngOnInit() {
    if (!this.questionitems) {
      this.questionitems = [];
    }
    if (this.questionitemId) {
      this.service.getquestion(this.questionitemId)
        .then((result: any) => {
          this.questionitem = result;
          this.init();
        });
    } else {
      this.init();
    }
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onRemoveResponsedomain(questionitem: QuestionItem) {
    console.debug('onRemoveResponsedomain');
    if (questionitem.responseDomain === undefined
      || questionitem.responseDomain.id === ''
      || questionitem.responseDomain.name === undefined) {
      return;
    }
    this.editIsVisible = false;
    questionitem.changeKind = 'IN_DEVELOPMENT';
    questionitem['changeComment'] = 'remove response domain ' + questionitem.responseDomain.name;
    questionitem.responseDomain = null;
    this.service.updateQuestionItem(questionitem)
      .subscribe((result: any) => {
        this.questionitem = result;
        this.editIsVisible = true;
      });
  }

  onEditQuestionItem(questionitem: QuestionItem) {
    const i = this.questionitems.findIndex(q => q['id'] === questionitem['id']);
    if (i >= 0) {
      this.questionitems[i] = questionitem;
    } else {
      if (this.savedQuestionitemsIndex >= 0) {
        this.questionitems[this.savedQuestionitemsIndex] = JSON.parse(this.savedObject);
      }
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
    const usedby: any = this.questionitem['conceptRefs'];
    this.canDelete = 2; //checking
    if (usedby && usedby.length > 0) {
      this.canDelete = 0;
    } else {
      this.service.getControlConstructsByQuestionItem(this.questionitem.id)
        .then((result: any) => {
          if (result.length > 0) {
            this.canDelete = 0;
          } else {
            this.canDelete = 1;
          }
        },
        (error: any) => { this.canDelete = 0; throw error;});
    }
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
        saveAs(data, fileName);
      });
  }

  private buildRevisionConfig(): any[] {
    const config: any[] = [];
    config.push({'name': 'name', 'label': 'Name'});
    config.push({'name': 'question', 'label': 'Question'});
    config.push({'name': 'intent', 'label': 'Intent'});
    config.push({'name': ['responseDomain', 'name'], 'label': 'responseDomain'});
    config.push({'name': ['responseDomain', 'version'], 'label': 'RespD', 'init': function (version: any) {
      return 'V' + version['major'] + '.' + version['minor'];
    }});

    return config;
  }

  private init() {
    if (this.questionitem !== null && this.questionitem !== undefined) {
      // this.questionitem['workinprogress'] = this.questionitem.changeKind === 'IN_DEVELOPMENT';
      this.savedObject = JSON.stringify(this.questionitem);
      this.savedQuestionitemsIndex = this.questionitems
        .findIndex(q => q['id'] === this.questionitem['id']);
    }
     this.config = this.buildRevisionConfig();
  }
}
