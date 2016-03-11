import {Component, EventEmitter, Output, Input} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {TopicService, Topic} from './topic.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {TopicEditComponent} from './edit/topic_edit.component';
import {TopicRevision} from './topic_revision.component';
import {TopicCreateComponent} from './create.component';

@Component({
  selector: 'topic',
  moduleId: module.id,
  templateUrl: './topic.component.html',
  pipes: [LocalDatePipe],
  providers: [TopicService],
  directives: [TopicCreateComponent, CommentListComponent, TopicEditComponent, TopicRevision]
})
export class TopicComponent {

  showTopicForm: boolean = false;
  @Output() topicSelectedEvent: EventEmitter<any> = new EventEmitter();
  @Input() study: any;

  private _topics:any;
  private _topic: any;

  constructor(private topicService: TopicService) {
    this._topic = new Topic();
  }

  ngOnChanges() {
    if (this.study.topicGroups !== null) {
      this._topics = this.study.topicGroups;
    } else {
      this._topics = this.topicService.getAll(this.study.id);
    }
  }

  ngAfterViewInit() {
    console.log('gei');
    this.topicService.getAll(this.study).subscribe(result => this.topics = result);

  }

  onToggleTopicForm() {
    this.showTopicForm = !this.showTopicForm;
  }

  onSelectTopic(topic: any) {
    this._topic = topic;
    this.topicSelectedEvent.emit(topic);
  }

  onSave() {
    this.showTopicForm = false;
    this.topicService.save(this._topic,this.study.id).subscribe(result => {
      this._topics.push(result);
    });
    this._topic  = new Topic();
  }



}
