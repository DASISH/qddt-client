import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { HIERARCHY_POSITION, QddtPropertyStoreService } from '../../core/global/property.service';
import { HomeService } from '../home.service';
import { QddtMessageService } from '../../core/global/message.service';
import { ElementKind } from '../../shared/classes/enums';
import { Study, Topic } from '../home.classes';

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

export class TopicComponent implements  OnInit, AfterContentChecked {

  public readonly TOPIC_KIND = ElementKind.TOPIC_GROUP;

  public study: Study;
  public topics: Topic[];
  public showReuse = false;
  public showTopicForm = false;

  public newTopic: Topic;

  constructor(private router: Router, private route: ActivatedRoute,
              private topicService: HomeService, private property: QddtPropertyStoreService,
              private message: QddtMessageService ) {
    this.newTopic = new Topic();
  }

  ngAfterContentChecked(): void {
    Materialize.updateTextFields();
  }

  ngOnInit(): void {
    this.study = this.property.get('study');
    this.topics = this.property.get('topics');
    if (!this.topics) {
      this.topicService.getAllTopic(this.study.id)
        .then((result) => {
          this.topics = result;
          this.property.set('topics', this.topics);
        });
    }
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
    this.topicService.createTopic(this.newTopic, this.study.id)
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
    this.topicService.getTopicPdf(element.id).then(
      (data: any) => filesaver.saveAs(data, fileName));
  }

  onClickQuestionItem(questionItem) {
    this.message.sendMessage( { element: questionItem, elementKind: ElementKind.QUESTION_ITEM } );
  }

  onAddQuestionItem(questionItem: any, topicId: any) {
    console.log(questionItem);
    this.topicService.attachTopicQuestion(topicId, questionItem.id, questionItem['questionItemRevision'])
      .subscribe((result: any) => this.onTopicSavedEvent(result));
  }

  onRemoveQuestionItem(ref) {
    this.topicService.deattachTopicQuestion(ref.topicId, ref.qId)
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
