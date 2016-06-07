import {Component, EventEmitter, Output, Input} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {TopicService, Topic} from './topic.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {TopicEditComponent} from './edit/topic_edit.component';
import {TopicRevision} from './topic_revision.component';
import {AuthorChipComponent} from '../author/author_chip.component';
import {QuestionItemService} from '../questionitem/question_item.service';
import {ConceptQuestionComponent} from '../concept/concept_question.component';


@Component({
  selector: 'topic',
  moduleId: module.id,
  templateUrl: './topic.component.html',
  pipes: [LocalDatePipe],
  providers: [TopicService, QuestionItemService],
  directives: [ CommentListComponent, TopicEditComponent, TopicRevision,AuthorChipComponent, ConceptQuestionComponent]
})
export class TopicComponent {

  showTopicForm: boolean = false;
  @Output() topicSelectedEvent: EventEmitter<any> = new EventEmitter();
  @Input() study: any;
  @Input() show: boolean;

  private topics:any;
  private topic: any;
  private questions: any;


  constructor(private topicService: TopicService, private questionitemService: QuestionItemService) {
    this.topic = new Topic();
  }

  ngAfterViewInit() {
    // this.topicService.getAll(this.study.id)
    //   .subscribe(result => this.topics = result);
    this.getQuestions();
    console.log('AfterViewInit '+ this.study.name);
  }

  ngOnChanges() {
    this.topicService.getAll(this.study.id)
      .subscribe(result => this.topics = result);
    console.log('OnChanges '+ this.study.name);
  }

  onToggleTopicForm() {
    this.showTopicForm = !this.showTopicForm;
  }

  onSelectTopic(topic: any) {
    this.topicSelectedEvent.emit(topic);
    console.log('on select topic ' + topic.name);
  }

  onSave() {
    this.showTopicForm = false;
    this.topicService.save(this.topic,this.study.id)
      .subscribe(result => {
        this.topics.push(result);
      });
    this.topic  = new Topic();
  }

  getQuestions() {
    this.questionitemService.getPage()
      .subscribe(result => {
        this.questions = result.content;
      });
     }

  getDefaultConcept(topic: any): any {
    console.log('DefaultConcept->' + topic.name);
    return topic.concepts.find( item => ( this.isBlank(item.name) && this.isBlank(item.description) && this.isBlank(item.label)));
  }


  private isBlank(str): boolean {
    return (!str || /^\s*$/.test(str));
  }
}
