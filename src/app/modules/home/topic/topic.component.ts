import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionKind,
  ElementKind,
  IRevisionRef,
  Study,
  Topic,
  PropertyStoreService,
  MessageService,
  HomeService, TemplateService, HierarchyPosition
} from '../../../lib';


@Component({
  selector: 'qddt-topic',
  providers: [{ provide: 'elementKind', useValue: 'TOPIC_GROUP' },],
  templateUrl: './topic.component.html',
})

export class TopicComponent implements OnInit, AfterViewInit {
  public readonly TOPIC_KIND = ElementKind.TOPIC_GROUP;

  public study: Study;
  public topics: Topic[];

  public showReuse = false;
  public showTopicForm = false;
  public readonly: boolean;
  public canDelete: boolean;

  private refreshCount = 0;

  constructor(private router: Router, private property: PropertyStoreService,
              private message: MessageService, private homeService: HomeService<Topic>, private templateService: TemplateService) {

    this.readonly = !homeService.canDo(this.TOPIC_KIND).get(ActionKind.Create);
    this.canDelete = homeService.canDo(this.TOPIC_KIND).get(ActionKind.Delete);
  }

  ngAfterViewInit(): void {
    // M.updateTextFields();
  }


  ngOnInit(): void {
    this.study = this.property.get('study');
    const parentId = this.study.id || this.property.menuPath[HierarchyPosition.Study].id;
    this.homeService.getListByParent(this.TOPIC_KIND, parentId)
      .then((result) => {
        this.property.set('topics', this.topics = result);
        this.showReuse = false;
      });
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
    this.showTopicForm = false;
    this.templateService.create(new Topic(newTopic), this.study.id).subscribe(
      result => this.onTopicSaved(result));
  }

  // onClickQuestionItem(cqi) {
  //   this.message.sendMessage( cqi );
  // }

  onAddQuestionItem(ref: IRevisionRef, topicId: any) {
    this.homeService.attachQuestion(this.TOPIC_KIND, topicId, ref.elementId, ref.elementRevision)
      .subscribe((result: any) => this.onTopicSaved(result));
  }

  public onRemovedQuestionItem(ref: IRevisionRef, topicId: any) {
    this.homeService.deattachQuestion(this.TOPIC_KIND, topicId, ref.elementId, ref.elementRevision)
      .subscribe((result: any) => this.onTopicSaved(result));
  }

  public onEditQuestion(search: IRevisionRef) {
    this.templateService.searchByUuid(search.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }


  onRemoveQuestionItem(ref: IRevisionRef, topicId: any) {
    this.homeService.deattachQuestion(this.TOPIC_KIND, topicId, ref.elementId, ref.elementRevision)
      .subscribe((result: any) => this.onTopicSaved(result));
  }

  onRemoveTopic(topicId: string) {
    if (topicId && topicId.length === 36) {
      this.templateService.delete(new Topic({ id: topicId })).subscribe(() => {
        this.topics = this.topics.filter((s: any) => s.id !== topicId);
        this.property.set('topics', this.topics);
      });
    }
  }

}
