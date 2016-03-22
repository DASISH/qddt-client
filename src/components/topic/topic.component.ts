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
  @Input() show: boolean;

  private topics:any;
  private topic: any;

  constructor(private topicService: TopicService) {
    this.topic = new Topic();
  }

  ngAfterViewInit() {
    this.topicService.getAll(this.study.id).subscribe(result => this.topics = result);
    console.log('gei '+ this.study.name);
  }

  ngOnChanges() {
    this.topicService.getAll(this.study.id)
      .subscribe(result => {
        this.topics = result;
        console.log('Topics ' + result.length);
      });
  }

  onToggleTopicForm() {
    this.showTopicForm = !this.showTopicForm;
  }

  onSelectTopic(topic: any) {
    this.topicSelectedEvent.emit(topic);
  }

  onSave() {
    this.showTopicForm = false;
    this.topicService.edit(this.topic)
      .subscribe(result => {
        this.topics.push(result);
      });
    this.topic  = new Topic();
  }



}
