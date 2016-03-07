import {Component,  EventEmitter, Output, Input, ElementRef} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';
import {CommentListComponent} from '../comment/comment_list';
import {TopicService, Topic} from './topicservice';
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
  @Output() selectedTopic: EventEmitter<any> = new EventEmitter();
  @Input() study: any;
  private topics: any;
  private activeTopic: any;

  constructor(private topicService: TopicService, private elementRef: ElementRef) {
    console.log('topic ' + this.study);
    this.ngOnChanges();
  }

  ngOnChanges() {
    if (!this.study.topics.length >0) {
      this.study.topics = this.topicService.getAll(this.study.id);
    }

    this.topics = this.study.topics;

  }

  selectTopic(study: any) {
    this.selectedTopic.emit(study);
    this.activeTopic = study;
    console.log('topic-select');
  }

  save() {
    this.showTopicForm = false;
    this.topicService.save(this.activeTopic,this.study.id);
    this.activeTopic  = new Topic();
  }

  toggleTopicForm() {
    //jQuery(this.elementRef.nativeElement).find('select').material_select();
    this.showTopicForm = !this.showTopicForm;
    console.log('topic-toggle');

  }


}
