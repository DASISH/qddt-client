import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { QuestionService, QuestionItem, Question } from './question.service';

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
  @Output() editQuestionItem: EventEmitter<any> = new EventEmitter<any>();
  deleteAction = new EventEmitter<any>();
  candelete: number; // 0: cannot, 1: can, 2: checking

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
    if(this.questionitems === null || this.questionitems === undefined) {
      this.questionitems = [];
    }
    if(this.questionitemId !== null && this.questionitemId !== undefined) {
      this.service.getquestion(this.questionitemId)
        .subscribe((result: any) => {
          this.questionitem = result;
          this.init();
        }, (error: any) => console.log(error));
    } else {
      this.init();
    }
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onRemoveResponsedomain(questionitem: QuestionItem) {
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
    let i = this.questionitems.findIndex(q => q['id'] === questionitem['id']);
    if(i >= 0) {
      this.questionitems[i] = questionitem;
    } else {
      if(this.savedQuestionitemsIndex >= 0) {
        this.questionitems[this.savedQuestionitemsIndex] = JSON.parse(this.savedObject);
      }
      this.questionitems.push(questionitem);
    }
    this.hideDetail();
  }

  onDeleteQuestionItemModal() {
    this.checkDeleteQuestionItem();
    this.deleteAction.emit('openModal');
  }

  checkDeleteQuestionItem() {
    let usedby: any = this.questionitem['conceptRefs'];
    this.candelete = 2; //checking
    if(usedby && usedby.length > 0) {
      this.candelete = 0;
    } else {
      this.service.getControlConstructsByQuestionItem(this.questionitem.id)
        .subscribe((result: any) => {
          if (result.length > 0) {
            this.candelete = 0;
          } else {
            this.candelete = 1;
          }
        },
        (error: any) => { console.log(error); this.candelete = 0; });
    }
  }

  onConfirmDeleting() {
    this.service.deleteQuestionItem(this.questionitem.id)
      .subscribe((result: any) => {
        let i = this.questionitems.findIndex(q => q['id'] === this.questionitem.id);
        if (i >= 0) {
          this.questionitems.splice(i, 1);
        }
        this.deleteAction.emit('closeModal');
        this.hideDetailEvent.emit('hide');
      },
      (error: any) => console.log(error));

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

  private init() {
    if (this.questionitem !== null && this.questionitem !== undefined) {
      if (this.questionitem.question === null) {
        this.questionitem.question = new Question();
      }
      this.savedObject = JSON.stringify(this.questionitem);
      this.savedQuestionitemsIndex = this.questionitems
        .findIndex(q => q['id'] === this.questionitem['id']);
    }
    this.config = this.buildRevisionConfig();
  }

}