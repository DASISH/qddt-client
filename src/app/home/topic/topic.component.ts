import { Component, EventEmitter,  OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';
import 'rxjs/add/operator/switchMap';
import { HIERARCHY_POSITION, PropertyStoreService } from '../../core/global/property.service';
import { Study } from '../study/study.service';
import { TopicService, Topic } from './topic.service';
import { QuestionItem } from '../../question/question.service';
import { ElementKind } from '../../preview/preview.service';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-topic',
  moduleId: module.id,
  styles: [':host /deep/ .collection-item .row { min-height:3rem; margin-bottom:0px;border-bottom: none;}',
          '.collection .collection-item {border-bottom: none; }',
          '.collection.with-header .collection-header {border-bottom: none; padding: 0px;}',
          '.collection {border:none; }'],
  templateUrl: './topic.component.html',
})

export class TopicComponent implements  OnInit {
  readonly topicKind = ElementKind.TOPIC_GROUP;
  questionItemActions = new EventEmitter<string|MaterializeAction>();
  previewActions = new EventEmitter<string|MaterializeAction>();

  protected study: Study;

  private topics: Topic[];
  private newTopic: Topic;
  private revision: any;
  private revisionKind = ElementKind.TOPIC_GROUP;
  private showTopicForm = false;
  private showReuse = false;
  private questionItem: QuestionItem;

  constructor(private router: Router, private route: ActivatedRoute,
              private topicService: TopicService, private property: PropertyStoreService) {
    this.newTopic = new Topic();
  }

  ngOnInit(): void {
    this.study = this.property.get('study');
    this.topics = this.property.get('topics');
    if (!this.topics) {
      this.topicService.getAll(this.study.id)
        .then((result) => {
          this.topics = result;
          this.property.set('topics', this.topics);
        });
    }
  }

  showPreview(topic: any) {
    this.revision = topic;
  }

  onToggleTopicForm() {
    this.showTopicForm = !this.showTopicForm;
    if (this.showTopicForm) {
      this.showReuse = false;
    }
  }

  onToggleReuse() {
    this.showReuse = !this.showReuse;
    if (this.showReuse) {
      this.showTopicForm = false;
    }
  }

  onSelectedRevsion(topic: Topic) {
    this.showReuse = false;
    this.onTopicSavedEvent(topic);
  }

  onSelectTopic(topic: any) {
    const prevTopic = this.property.get('topic');
    if (!prevTopic || prevTopic.id !== topic.id) {
      this.property.set('concepts', null);
    }
    this.property.set('topic', topic);
    this.property.setCurrent(HIERARCHY_POSITION.Topic, topic.name);
    this.property.setCurrent(HIERARCHY_POSITION.Concept, 'Concept');
    this.router.navigate(['concept']);
  }

  onTopicSavedEvent(topic: any) {
    if (topic !== null) {
      const index = this.topics.findIndex((q) => q.id === topic.id);
      if (index >= 0) {
        this.topics.splice(index, 1);
      }
      this.topics.push(topic);
      this.property.set('topics', this.topics);
    }
  }

  onNewSave() {
    this.showTopicForm = false;
    this.topicService.save(this.newTopic, this.study.id)
      .subscribe((result: any) => this.onTopicSavedEvent(result));
    this.newTopic  = new Topic();
  }

  onDownloadFile(o: any) {
    const fileName = o.originalName;
    this.topicService.getFile(o.id).then(
      (data: any) => filesaver.saveAs(data, fileName));
  }

  onGetPdf(element: Topic) {
    const fileName = element.name + '.pdf';
    this.topicService.getPdf(element.id).then(
      (data: any) => filesaver.saveAs(data, fileName));
  }

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit({action: 'modal', params: ['open']});
  }

  onAddQuestionItem(questionItem: any, topicId: any) {
    console.log(questionItem);
    this.topicService.attachQuestion(topicId, questionItem.id, questionItem['questionItemRevision'])
      .subscribe((result: any) => this.onTopicSavedEvent(result));
  }

  onRemoveQuestionItem(id: any) {
    this.topicService.deattachQuestion(id.parentId, id.questionItemId)
      .subscribe((result: any) => this.onTopicSavedEvent(result));
  }

  onRemoveTopic(topicId: string) {
    if (topicId && topicId.length === 36) {
      this.topicService.deleteTopic(topicId)
        .subscribe(() => {
            this.topics = this.topics.filter((s: any) => s.id !== topicId);
            this.property.set('topics', this.topics);
          });
    }
  }

}
