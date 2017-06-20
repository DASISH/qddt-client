import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TopicService, Topic } from './topic.service';
import { ConceptService } from '../concept/concept.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-topic',
  moduleId: module.id,
  templateUrl: './topic.component.html',
  providers: [TopicService],
})
export class TopicComponent implements OnChanges {

  @Output() topicSelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() study: any;
  @Input() show: boolean;

  questionItemActions = new EventEmitter<string|MaterializeAction>();
  private topics:any;
  private topic: any;
  private showTopicForm: boolean = false;
  private showQuestionbutton: boolean = false;
  private questionItem: any;

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


  getPdf(element: Topic) {
    let fileName = element.name + '.pdf';
    this.topicService.getPdf(element.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      },
      error => console.log(error));
  }

  setQuestionItem(questionItem: any) {

    this.topicService.attachQuestion(this.topics.topicQuestions.id,questionItem.id,questionItem['questionItemRevision'])
      .subscribe((result: any) => {
        this.topic.topicQuestions = result;
      }, (error: any) => console.log(error));
  }

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit({action:'modal', params:['open']});
  }

  removeQuestionItem(id: any) {
    this.topicService.deattachQuestion(this.topic.id, id)
      .subscribe((result: any) => {
          this.topic = result;
        }
        , (err: any) => console.log('ERROR: ', err));
  }

  private isBlank(str: any): boolean {
    return (!str || /^\s*$/.test(str));
  }
}
