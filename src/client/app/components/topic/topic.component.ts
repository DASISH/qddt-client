import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges, AfterContentChecked } from '@angular/core';

import { TopicService, Topic } from './topic.service';
import { MaterializeAction } from 'angular2-materialize';
import { Study } from '../study/study.service';
import { QuestionItem } from '../question/question.service';
let saveAs = require('file-saver');
declare var Materialize:any;

@Component({
  selector: 'qddt-topic',
  moduleId: module.id,
  styles: [':host /deep/ .collection-item .row { min-height:3rem; margin-bottom:0px;border-bottom: none;}',
          '.collection .collection-item {border-bottom: none; }',
          '.collection.with-header .collection-header {border-bottom: none; padding: 0px;}',
          '.collection {border:none; }'],
  templateUrl: './topic.component.html',
  providers: [TopicService],
})

export class TopicComponent implements OnChanges, AfterContentChecked{
  @Output() topicSelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() study: Study;
  @Input() show: boolean;

  questionItemActions = new EventEmitter<string|MaterializeAction>();
  previewActions = new EventEmitter<string|MaterializeAction>();

  private topics:Topic[];
  private newTopic: Topic;
  private revision:any;
  private showTopicForm: boolean = false;
  private questionItem: QuestionItem;
  private parentId:string;
  private config:any;

  constructor(private topicService: TopicService) {
    this.newTopic = new Topic();
    this.config = this.buildRevisionConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['study'] !== null && changes['study'] !== undefined
      && this.study !== null && this.study !== undefined
      && this.study.id !== null && this.study.id !== undefined) {
      console.log('ngOnChanges topic');
      this.topicService.getAll(this.study.id)
        .subscribe((result: any) => {
            this.topics = result;
        },
        (error: any) => console.log(error));
    }
  }

  ngAfterContentChecked(): void {
    Materialize.updateTextFields();
  }

  showPreview(topic: any) {
    this.revision = topic;
    this.previewActions.emit({action:'modal', params:['open']});
  }

  onToggleTopicForm() {
    this.showTopicForm = !this.showTopicForm;
  }

  onSelectTopic(topic: any) {
    this.topicSelectedEvent.emit(topic);
  }

  onTopicSavedEvent(topic: any) {
    console.log('onTopicSavedEvent ' + topic.name);
    let index = this.topics.findIndex((e:any) => e.id === topic.id);
    if(index >= 0) {
      this.topics[index] = topic;
    } else {
      this.topics.push(topic);
    }
    // this.showProgressBar = false;
  }

  onNewSave() {
    this.showTopicForm = false;
     // this.showProgressBar = true;
    this.topicService.save(this.newTopic,this.study.id)
      .subscribe((result: any) => {
        this.onTopicSavedEvent(result);
      }, (error: any) => console.log(error));
    this.newTopic  = new Topic();
  }

  onDownloadFile(o: any) {
    let fileName = o.originalName;
    this.topicService.getFile(o.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      },
      error => console.log(error));
  }

  onGetPdf(element: Topic) {
    let fileName = element.name + '.pdf';
    this.topicService.getPdf(element.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      },
      error => console.log(error));
  }

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit({action:'modal', params:['open']});
  }

  onAddQuestionItem(questionItem: any, topicId:any) {
    console.log(questionItem);
    this.topicService.attachQuestion(topicId,questionItem.id,questionItem['questionItemRevision'])
      .subscribe((result: any) => {
        this.onTopicSavedEvent(result);
      }, (error: any) => console.log(error));
  }

  onRemoveQuestionItem(id:any) {
    this.topicService.deattachQuestion(id.parentId, id.questionItemId)
      .subscribe((result: any) => {
          this.onTopicSavedEvent(result);
        }
        , (err: any) => console.log('ERROR: ', err));
  }

  onRemoveTopic(topicId: string) {
    if (topicId && topicId.length === 36) {
      this.topicService.deleteTopic(topicId)
        .subscribe((result: any) => {
            this.topics = this.topics.filter((s: any) => s.id !== topicId);
          },
        (error: any) => {
          console.log(error);
        });
    }
  }

  private buildRevisionConfig(): any[] {
    let config: any[] = [];
    config.push({'name':'name','label':'Name'});
    config.push({'name':'description','label':'Description'});
    config.push({'name':['otherMaterials'],'label':'Files', 'init': function (o: any) {
      if(o !== null && o !== undefined) {
        return o.map(element => {return element['originalName'] || '';}).sort().join(',');
      }
      return '';
    }});
    return config;
  }

  private isBlank(str: any): boolean {
    return (!str || /^\s*$/.test(str));
  }
}
