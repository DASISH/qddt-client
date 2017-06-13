import { Component, Output, EventEmitter, Input } from '@angular/core';

import { QuestionService, QuestionItem } from './question.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'qddt-questionitem-reuse',
  moduleId: module.id,
  templateUrl: './question.reuse.component.html',
  providers: [QuestionService]
})
export class QuestionReuseComponent {
  @Input() parentId: string;
  @Output() questionItemCreatedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() dismissEvent: any = new EventEmitter<any>();
  reuseQuestionItem: boolean;
  selectedIndex: number;
  materializeActions = new EventEmitter<any>();
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
      this.materializeActions.emit({action:'modal', params:['close']});
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

  openModal2() {
    this.materializeActions.emit({action:'modal', params:['open']});
    this.questionService.getQuestionItemPage().subscribe(
      result => { this.questionItems = result.content;
      }, (error: any) => console.log(error));
  }

  closeModal() {
    this.materializeActions.emit({action:'modal', params:['close']});
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
