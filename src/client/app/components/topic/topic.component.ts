import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TopicService, Topic } from './topic.service';
import { MaterializeAction } from 'angular2-materialize';
import { QuestionItem } from '../../../../../dist/tmp/app/components/question/question.service';
import { Study } from '../study/study.service';
import { isNullOrUndefined } from 'util';
import * as fileSaver from 'file-saver';
// let fileSaver = require('../../../common/file-saver');

@Component({
  selector: 'qddt-topic',
  moduleId: module.id,
  styles: ['.collection.with-header .collection-header {border-bottom: none; padding: 0px;}',
          '.collection {border:none; }'],
  templateUrl: './topic.component.html',
  providers: [TopicService],
})
export class TopicComponent implements OnChanges {

  @Output() topicSelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() study: Study;
  @Input() show: boolean;

  questionItemActions = new EventEmitter<string|MaterializeAction>();
  previewActions = new EventEmitter<string|MaterializeAction>();

  private topics:Topic[];
  private topic: Topic;
  private revision:any;
  private showTopicForm: boolean = false;
  private showQuestionbutton: boolean = false;
  private questionItem: QuestionItem;
  private parentId:string;

  constructor(private topicService: TopicService) {
    this.topic = new Topic();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['study'] !== null && changes['study'] !== undefined
      && this.study !== null && this.study !== undefined
      && this.study.id !== null && this.study.id !== undefined) {
      this.topics = [];
      this.topicService.getAll(this.study.id)
        .subscribe((result: any) => {
          this.topics = result;
          this.topics.forEach((topic: any) => {
            topic.workinprogress = (topic.version.versionLabel === 'In Development');
          });
        },
        (error: any) => console.log(error));
    }
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
    this.topics = this.topics.filter((s: any) => s.id !== topic.id);
    topic.workinprogress = (topic.version.versionLabel === 'In Development');
    this.topics.push(topic);

  }

  onSave() {
    this.showTopicForm = false;
    this.topicService.save(this.topic,this.study.id)
      .subscribe((result: any) => {
        this.topics.push(result);
      }, (error: any) => console.log(error));
    this.topic  = new Topic();
  }

  onDownloadFile(o: any) {
    let fileName = o.originalName;
    this.topicService.getFile(o.id).subscribe(
      (data: any) => {
        // this.openFileForDownload(data, fileName);
        fileSaver(data, fileName);
      },
      error => console.log(error));
  }

  onGetPdf(element: Topic) {
    let fileName = element.name + '.pdf';
    this.topicService.getPdf(element.id).subscribe(
      (data: any) => {
        fileSaver(data, fileName);
      },
      error => console.log(error));
  }

  onAddQuestionItem(topicId,questionItem: any) {

    this.topicService.attachQuestion(topicId,questionItem.id,questionItem['questionItemRevision'])
      .subscribe((result: any) => {
        this.topics.push(result);
      }, (error: any) => console.log(error));
  }

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit({action:'modal', params:['open']});
  }

  onRemoveQuestionItem(id: any) {
    this.topicService.deattachQuestion(this.topic.id, id)
      .subscribe((result: any) => {
          this.topic = result;
        }
        , (err: any) => console.log('ERROR: ', err));
  }


  onRemoveTopic(topicId: string) {
    if (!isNullOrUndefined(topicId) && topicId.length === 36) {
      this.topicService.deleteTopic(topicId)
        .subscribe((result: any) => {
          let i = this.topics.findIndex(q => q['id'] === topicId);
          if (i >= 0) {
            this.topics.splice(i, 1);
          }
        },
        (error: any) => {
        console.log(error);

        });
    }
  }


  private isBlank(str: any): boolean {
    return (!str || /^\s*$/.test(str));
  }
}
