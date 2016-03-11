import {Component, EventEmitter, Output, Input} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {TopicService, Topic} from './topic.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {TopicEditComponent} from './edit/topic_edit.component';
import {TopicRevision} from './topic_revision.component';

@Component({
  selector: 'topic',
  moduleId: module.id,
  templateUrl: './topic.component.html',
  pipes: [LocalDatePipe],
  providers: [TopicService],
  directives: [ CommentListComponent, TopicEditComponent, TopicRevision]
})
export class TopicComponent {

  showTopicForm: boolean = false;
  @Output() topicSelectedEvent: EventEmitter<any> = new EventEmitter();
  @Input() study: any;

  private topics:any;
  private topic: any;

  constructor(private topicService: TopicService) {
    this.topic = new Topic();
  }

  ngAfterViewInit() {
    console.log('gei');
    this.topicService.getAll(this.study).subscribe(result => this.topics = result);
  }

  onToggleTopicForm() {
    this.showTopicForm = !this.showTopicForm;
  }

  onSelectTopic(topic: any) {
    this.topicSelectedEvent.emit(topic);
  }

  onSave() {
    this.showTopicForm = false;
    this.topicService.save(this.topic,this.study.id)
      .subscribe(result => {
        this.topics.push(result);
      });
    this.topic  = new Topic();
  }



}
