import { AfterContentChecked, Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { ActionKind, ElementKind, IRevisionRef, Study, Topic} from '../../../classes';
import { HierarchyPosition} from '../../core/classes';
import { HomeService} from '../home.service';
import { MessageService, PropertyStoreService} from '../../core/services';


declare var Materialize: any;

@Component({
  selector: 'qddt-topic',

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

  constructor(private router: Router, private property: PropertyStoreService, private message: MessageService,
              private homeService: HomeService ) {
    this.readonly = !homeService.canDo.get(this.TOPIC_KIND).get(ActionKind.Create);
    this.canDelete = homeService.canDo.get(this.TOPIC_KIND).get(ActionKind.Delete);
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
    const parentId = this.study.id || this.property.menuPath[HierarchyPosition.Study].id;
    console.log(parentId);
    this.topics = this.property.get('topics');
    if (!this.topics) {
      this.homeService.getByStudyTopic(parentId)
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
    this.homeService.create<Topic>(this.newTopic, this.study.id)
      .subscribe((result: any) => this.onTopicSaved(result));
    this.newTopic  = new Topic();
  }


  onClickQuestionItem(questionItem) {
    this.message.sendMessage( { element: questionItem, elementKind: ElementKind.QUESTION_ITEM } );
  }

  onAddQuestionItem(ref: IRevisionRef, topicId: any) {
    this.homeService.attachTopicQuestion(topicId, ref.elementId, ref.elementRevision)
      .subscribe((result: any) => this.onTopicSaved(result));
  }

  onRemoveQuestionItem(ref: IRevisionRef, topicId: any) {
      this.homeService.deattachTopicQuestion(topicId , ref.elementId, ref.elementRevision)
      .subscribe((result: any) => this.onTopicSaved(result));
  }

  onRemoveTopic(topicId: string) {
    if (topicId && topicId.length === 36) {
      this.homeService.deleteTopic(topicId)
        .subscribe(() => {
            this.topics = this.topics.filter((s: any) => s.id !== topicId);
            this.property.set('topics', this.topics);
          });
    }
  }

}
