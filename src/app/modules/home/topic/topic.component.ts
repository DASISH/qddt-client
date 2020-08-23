import { Factory } from './../../../lib/factory';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionKind,
  ElementKind,
  IRevisionRef,
  Study,
  Topic,
  PropertyStoreService,
  MessageService,
  HomeService, TemplateService, HierarchyPosition, ElementRevisionRef, delay, LANGUAGE_MAP
} from '../../../lib';


@Component({
  selector: 'qddt-topic',
  providers: [{ provide: 'elementKind', useValue: 'TOPIC_GROUP' },],
  templateUrl: './topic.component.html',
})

export class TopicComponent implements OnInit {
  public readonly TOPIC_KIND = ElementKind.TOPIC_GROUP;
  public readonly LANGUAGES = LANGUAGE_MAP;

  public study: Study;
  public topics: Topic[];

  public showReuse = false;
  public showEditForm = false;
  public showProgressBar = false;
  public readonly: boolean;
  public canDelete: boolean;

  constructor(private router: Router, private property: PropertyStoreService,
    private message: MessageService, private homeService: HomeService<Topic>,
    private templateService: TemplateService) {

    this.readonly = !homeService.canDo(this.TOPIC_KIND).get(ActionKind.Create);
    this.canDelete = homeService.canDo(this.TOPIC_KIND).get(ActionKind.Delete);
  }

  ngOnInit(): void {
    this.study = this.property.get('study');
    const parentId = this.study.id || this.property.menuPath[HierarchyPosition.Study].id;
    if (!this.study) {
      this.homeService.get(ElementKind.STUDY, parentId)
        .then(result => this.property.set('study', this.study = result));
    }
    this.loadTopics(parentId);
  }

  private loadTopics(parentId: string) {
    this.showProgressBar = true;
    this.homeService.getListByParent(this.TOPIC_KIND, parentId)
      .then((result) => {
        this.property.set('topics', this.topics = result);
        this.showReuse = false;
        this.showProgressBar = false;
      });
  }

  onToggleTopicForm() {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm) {
      this.showReuse = false;
    }
  }

  onToggleReuse() {
    this.showReuse = !this.showReuse;
    if (this.showReuse) {
      this.showEditForm = false;
    }
  }


  onSelectedRevsion(topic: Topic) {
    this.showReuse = false;
    this.onTopicSaved(topic);
  }

  onSelectTopic(topic: Topic) {
    const prevTopic = this.property.get('topic');
    if (!prevTopic || prevTopic.id !== topic.id) {
      this.property.set('concepts', null);
    }
    this.property.set('topic', topic);
    this.property.setCurrentMenu(HierarchyPosition.Topic, { id: topic.id, name: topic.name });
    this.property.setCurrentMenu(HierarchyPosition.Concept, { id: null, name: 'Concept' });
    this.router.navigate(['concept']);
  }

  onTopicSaved(topic: Topic) {
    if (topic !== null) {
      const index = this.topics.findIndex((f) => f.id === topic.id);
      if (index > -1) {
        this.topics.splice(index, 1, topic);
      } else {
        this.topics.push(topic);
      }
      this.property.set('topics', this.topics);
    }
  }

  onNewSave(newTopic) {
    this.showEditForm = false;
    this.templateService.create(new Topic(newTopic), this.study.id).subscribe(
      result => this.onTopicSaved(result));
  }


  public onEditQuestion(search: IRevisionRef) {
    this.templateService.searchByUuid(search.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }

  public onQuestionItemRemoved(ref: ElementRevisionRef, topicId) {
    this.homeService.deattachQuestion(this.TOPIC_KIND, topicId, ref.elementId, ref.elementRevision)
      .subscribe(result => this.onTopicSaved(result));
  }

  public onQuestionItemAdded(ref: ElementRevisionRef, topicId) {
    this.homeService.attachQuestion(this.TOPIC_KIND, topicId, ref.elementId, ref.elementRevision)
      .subscribe(result => this.onTopicSaved(result));
  }

  public onQuestionItemModified(ref: ElementRevisionRef, topicId) {
    const topic = this.topics.find((f) => f.id === topicId);
    const idx = topic.topicQuestionItems.findIndex(f => f.elementId === ref.elementId);
    const seqNew: ElementRevisionRef[] = [].concat(
      topic.topicQuestionItems.slice(0, idx),
      ref,
      topic.topicQuestionItems.slice(idx + 1)
    );
    topic.topicQuestionItems = seqNew;

    this.templateService.update<Topic>(topic).subscribe(
      (result) => this.onTopicSaved(result));
  }

  onRemoveTopic(topic: Topic) {
    if (topic && topic.id) {
      this.templateService.delete(topic).subscribe(() => {
        this.topics = this.topics.filter((s: any) => s.id !== topic.id);
        this.property.set('topics', this.topics);
      });
    }
  }

  onHierarchyChanged(event) {
    // console.log('moving event?');
    this.study.changeKind = 'UPDATED_HIERARCHY_RELATION';
    this.study.changeComment = 'Topic order changed';
    this.study.topicGroups = this.topics;
    this.templateService.update<Study>(this.study).subscribe((result) => {
      this.property.set('study', this.study = result);
      this.loadTopics(this.study.id);
    });
  }

  initComp() {
    delay(20).then(() => {
      document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
        input => M.CharacterCounter.init(input));
    });
  }

}
