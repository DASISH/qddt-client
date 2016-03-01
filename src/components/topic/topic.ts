import {Component, Input, EventEmitter, Output, ElementRef} from '../../../node_modules/angular2/core.d';

import {LocalDatePipe} from '../../common/date_pipe';

import {TopicService, Topic} from './topicservice';
import {CommentListComponent} from '../comment/comment_list';
import {TopicEditComponent} from './edit/topic_edit';
import {TopicRevision} from './topic_revision';

declare var jQuery:any;

@Component({
  selector: 'topic',
  templateUrl: './components/topic/topic.html',
  directives: [CommentListComponent, TopicEditComponent, TopicRevision],
  pipes: [LocalDatePipe],
  providers: [TopicService]
})
export class TopicComponent {

  showTopicForm: boolean = false;
  @Input() showTopic: boolean;
  model: Topic;
  topics: Array<Topic> = [];
  @Output() surveyCreateEvent: EventEmitter<String> = new EventEmitter();

  constructor(private topicService: TopicService, private elementRef: ElementRef) {
    this.model = new Topic();
    this.topics = this.topicService.getModel();
  }

  ngOnInit() {
    console.log("init");
    jQuery(this.elementRef.nativeElement).find('select').material_select();
  }

  save() {
    this.showTopicForm = false;
    this.topicService.save(this.model);
    this.topics = this.topicService.getModel();
    this.model = new Topic();
  }

  toggleTopicForm() {
    jQuery(this.elementRef.nativeElement).find('select').material_select();
    this.showTopicForm = !this.showTopicForm;
  }

  create(topic: any) {
    this.topicCreateEvent.emit(topic);
  }

}
