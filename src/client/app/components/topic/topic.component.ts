import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { TopicService, Topic } from './topic.service';

@Component({
  selector: 'topic',
  moduleId: module.id,
  templateUrl: './topic.component.html',
  providers: [TopicService],
})
export class TopicComponent implements OnInit {

  showTopicForm: boolean = false;
  @Output() topicSelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() study: any;
  @Input() show: boolean;

  private topics:any;
  private topic: any;

  constructor(private topicService: TopicService) {
    this.topic = new Topic();
  }

  ngOnInit() {
    this.topicService.getAll(this.study.id)
      .subscribe((result: any) => this.topics = result);
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
      .subscribe((result: any) => {
        this.topics.push(result);
      });
    this.topic  = new Topic();
  }

  getDefaultConcept(topic: any): any {
    return topic.concepts.find( (item: any) => ( this.isBlank(item.name) && this.isBlank(item.description) && this.isBlank(item.label)));
  }

  private isBlank(str: any): boolean {
    return (!str || /^\s*$/.test(str));
  }
}
