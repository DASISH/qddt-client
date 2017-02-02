import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { QuestionService, QuestionItem, Question } from './question.service';

@Component({
  selector: 'qddt-questionitem-detail',
  moduleId: module.id,
  templateUrl: './question_detail.component.html',
  providers: [QuestionService],
})

export class QuestionDetail implements OnInit {
  @Input() questionitem: QuestionItem;
  @Input() questionitems: QuestionItem[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() editQuestionItem: EventEmitter<any> = new EventEmitter<any>();
  deleteAction = new EventEmitter<any>();

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
    if(this.questionitem.question === null) {
      this.questionitem.question = new Question();
    }
    this.savedObject = JSON.stringify(this.questionitem);
    this.savedQuestionitemsIndex = this.questionitems
      .findIndex(q => q['id'] === this.questionitem['id']);
    this.config = this.buildRevisionConfig();
  }

  hidDetail() {
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
    this.hidDetail();
  }

  onDeleteQuestionItemModal() {
    this.deleteAction.emit('openModal');
  }

  onConfirmDeleting() {
    this.service.deleteQuestionItem(this.questionitem.id)
      .subscribe((result: any) => {
        let i = this.questionitems.findIndex(q => q['id'] === this.questionitem.id);
        if (i >= 0) {
          this.questionitems.splice(i, 1);
        }
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

}
