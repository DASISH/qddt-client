import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';

import { HIERARCHY_POSITION, QddtPropertyStoreService } from '../../core/global/property.service';
import { HomeService } from '../home.service';
import { QddtMessageService } from '../../core/global/message.service';
import { ElementKind, ActionKind } from '../../shared/classes/enums';
import { Study, Topic } from '../home.classes';
import {IRevisionRef, IOtherMaterial} from '../../shared/classes/interfaces';
import { TemplateService } from '../../template/template.service';

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
  public newTopic: Topic;

  public showReuse = false;
  public showTopicForm = false;
  public readonly: boolean;
  public canDelete: boolean;

  private refreshCount = 0;

  constructor(private router: Router, private route: ActivatedRoute,
              private property: QddtPropertyStoreService, private message: QddtMessageService,
              private topicService: HomeService, private service: TemplateService ) {
    this.readonly = !service.can(ActionKind.Create, ElementKind.TOPIC_GROUP );
    this.canDelete = service.can(ActionKind.Delete, ElementKind.TOPIC_GROUP );
    this.newTopic = new Topic();
  }

  ngAfterContentChecked(): void {
    if (this.refreshCount < 10) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) {}
    }
  }

  ngOnInit(): void {
    this.study = this.property.get('study');
    this.topics = this.property.get('topics');
    if (!this.topics) {
      this.topicService.getAllTopic(this.study.id)
        .then((result) => {
          this.topics = result.sort( (a, b) => a.name.localeCompare(b.name));
          this.property.set('topics', this.topics);
          this.showReuse = false;
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
    this.onTopicSaved(topic);
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

  onTopicSaved(topic: any) {
    if (topic !== null) {
      const topics = this.topics.filter((q) => q.id !== topic.id);
      topics.push(topic);
      this.topics = topics.sort( (a, b) => a.name.localeCompare(b.name));
      this.property.set('topics', this.topics);
    }
  }

  onNewSave() {
    this.showTopicForm = false;
    this.topicService.createTopic(this.newTopic, this.study.id)
      .subscribe((result: any) => this.onTopicSaved(result));
    this.newTopic  = new Topic();
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.topicService.getFile(o).then(
      (data: any) => filesaver.saveAs(data, fileName));
  }

  getPdf(element: Topic) {
    const fileName = element.name + '.pdf';
    this.topicService.getPdf(element).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  getXml(element: Topic) {
    const fileName = element.name + '.xml';
    this.topicService.getXml(element).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  onClickQuestionItem(questionItem) {
    this.message.sendMessage( { element: questionItem, elementKind: ElementKind.QUESTION_ITEM } );
  }

  onAddQuestionItem(ref: IRevisionRef, topicId: any) {
    this.topicService.attachTopicQuestion(topicId, ref.elementId, ref.elementRevision)
      .subscribe((result: any) => this.onTopicSaved(result));
  }

  onRemoveQuestionItem(ref: IRevisionRef, topicId: any) {
      this.topicService.deattachTopicQuestion(topicId , ref.elementId, ref.elementRevision)
      .subscribe((result: any) => this.onTopicSaved(result));
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
