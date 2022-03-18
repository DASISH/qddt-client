import { OnInit, Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionKind,
  ElementKind,
  IRevisionRef,
  Study,
  Topic,
  PropertyStoreService,
  HomeService, TemplateService, HierarchyPosition, ElementRevisionRef, delay, LANGUAGE_MAP, fadeInAnimation
} from 'src/app/lib';


@Component({
  selector: 'qddt-topic',
  providers: [{ provide: 'elementKind', useValue: 'TOPIC_GROUP' },],
  styles: [
    '.card.section.row { margin-left: -0.6rem; }',
    '.dropdownmenu { top:1rem; position:relative;}',
    'ul {  counter-reset: item;}'
  ],
  templateUrl: './topic.component.html',
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class TopicComponent implements OnInit, OnChanges {
  public readonly TOPIC_KIND = ElementKind.TOPIC_GROUP;
  public readonly LANGUAGES = LANGUAGE_MAP;

  public study: Study;
  public topics: Topic[];

  public showReuse = false;
  public showEditForm = false;
  public showProgressBar = false;

  public readonly canCreate: boolean;
  public readonly canUpdate: boolean;
  public readonly canDelete: boolean;

  public readonly trackByIndex = (index: number, entity) => entity.id;

  private readonly getId = (href: string): string => href.split('/').pop();

  constructor(private router: Router, private property: PropertyStoreService,
    private homeService: HomeService<Topic>, private templateService: TemplateService) {

    this.canCreate = this.homeService.canDo(this.TOPIC_KIND).get(ActionKind.Create);
    this.canUpdate = this.homeService.canDo(this.TOPIC_KIND).get(ActionKind.Update);
    this.canDelete = this.homeService.canDo(this.TOPIC_KIND).get(ActionKind.Delete);

  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.debug(changes.)
  }

  public ngOnInit(): void {
    this.study = this.property.get('study');
    const parentId = this.study.id || this.property.menuPath[HierarchyPosition.Study].id;
    if (!this.study) {
      this.templateService.getByKindEntity<Study>(ElementKind.STUDY, parentId)
        .then(result => this.property.set('study', this.study = result));
    }
    this.loadTopics(parentId);
  }

  private loadTopics(parentId: string) {
    this.showProgressBar = true;
    this.topics = []
    this.homeService.getListByParent(this.TOPIC_KIND, parentId)
      .then((result) => {
        console.debug(result)
        this.topics = result
        this.property.set('topics', this.topics)
        this.showReuse = false;
        this.showProgressBar = false;
      });
  }

  public onToggleTopicForm() {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm) {
      this.showReuse = false;
    }
  }

  public onToggleReuse() {
    this.showReuse = !this.showReuse;
    if (this.showReuse) {
      this.showEditForm = false;
    }
  }


  public onSelectedRevision(topic: Topic) {
    this.showReuse = false;
    this.onTopicSaved(topic);
  }


  public async onGotoChild(topic: Topic) {
    console.debug('onSelectTopic')
    const prevTopic = this.property.get('topic');
    if (!prevTopic || prevTopic.id !== topic.id) {
      this.property.set('concepts', null);
    }
    this.property.set('topic', topic);
    this.property.setCurrentMenu(HierarchyPosition.Topic, { id: topic.id, name: topic.label });
    this.property.setCurrentMenu(HierarchyPosition.Concept, { id: null, name: 'Concept' });

    this.router.navigate(['concept', topic.id]);
  }


  async onToggleEdit(edit, topicId) {
    if (!edit.isVisible) {
      let index = this.topics.findIndex(pre => pre.id == topicId)
      this.topics[index] = await this.homeService.get(this.TOPIC_KIND, topicId)
    }
    edit.isVisible = !edit.isVisible;
  }


  public onTopicSaved(topic: Topic) {
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

  public onNewSave(newTopic) {
    this.showEditForm = false;
    this.templateService.create(new Topic(newTopic)
      .setLanguage(this.property.userSetting.xmlLang), this.study.id).subscribe(
        result => this.onTopicSaved(result));
  }


  public onEditQuestion(search: IRevisionRef) {
    this.templateService.searchByUuid(search.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }


  public onQuestionItemRemoved(ref: ElementRevisionRef, topic: Topic) {
    this.homeService.deattachQuestion(this.TOPIC_KIND, topic.id, ref.elementId, ref.elementRevision)
      .subscribe(result => {
        topic.questionItems = result
        this.onTopicSaved(topic)
      });
  }

  public onQuestionItemAdded(ref: ElementRevisionRef, topic: Topic) {
    this.homeService.attachQuestion(this.TOPIC_KIND, topic.id, ref)
      .subscribe(result => {
        topic.questionItems = result
        this.onTopicSaved(topic)
      });
  }

  public onQuestionItemModified(ref: ElementRevisionRef, topic: Topic) {
    console.debug('onItemModified -> ' + ref || JSON);
    const idx = topic.questionItems.findIndex(f => f.equal(ref.uri));
    const seqNew: ElementRevisionRef[] = [].concat(
      topic.questionItems.slice(0, idx),
      ref,
      topic.questionItems.slice(idx + 1)
    );
    topic.questionItems = seqNew;

    this.templateService.update<Topic>(topic).subscribe(
      (result) => this.onTopicSaved(result));
  }


  public onRemoveTopic(topic: Topic) {
    if (topic && topic.id) {
      this.templateService.delete(topic).subscribe(() => {
        this.topics = this.topics.filter((s: any) => s.id !== topic.id);
        this.property.set('topics', this.topics);
      });
    }
  }


  onHierarchyChanged(event) {
    // console.debug('moving event?');
    this.study.changeKind = 'UPDATED_HIERARCHY_RELATION';
    this.study.changeComment = 'Topic order changed';
    this.study._embedded.children = this.topics;
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
