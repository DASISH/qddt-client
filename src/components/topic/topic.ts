import {Component, EventEmitter, Output, Input} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {TopicService, Topic} from './topicservice';
import {CommentListComponent} from '../comment/comment_list';
import {TopicEditComponent} from './edit/topic_edit';
import {TopicRevision} from './topic_revision';

@Component({
  selector: 'topic',
  templateUrl: './components/topic/topic.html',
  directives: [CommentListComponent, TopicEditComponent, TopicRevision],
  pipes: [LocalDatePipe],
  providers: [TopicService]
})
export class TopicComponent {

  showTopicForm: boolean = false;
  @Output() selectedTopic: EventEmitter<any> = new EventEmitter();
  @Input() study: any;
  topic: Topic;
  topics: Array<Topic> = [];

  constructor(private topicService: TopicService) {
    this.topic = new Topic();
  }

  ngAfterContentInit() {
    console.log('das topic!');
    console.log(this.study);
  }

  save() {
    this.showTopicForm = false;
    this.topicService.save(this.topic).subscribe(result => {
      this.topics.push(result);
    });
    this.topic  = new Topic();
  }

  toggleTopicForm() {
    this.showTopicForm = !this.showTopicForm;
  }

  create(topic: any) {
    //nothng
  }

}
