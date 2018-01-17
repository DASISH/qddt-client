import {
  Component, EventEmitter, Output,  AfterContentChecked, OnInit,
} from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { TopicService, Topic } from './topic.service';
import { MaterializeAction } from 'angular2-materialize';
import { QuestionItem } from '../../question/question.service';
import { AuthService } from '../../auth/auth.service';
import 'rxjs/add/operator/switchMap';
import { Study } from '../study/study.service';
const saveAs = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-topic',
  moduleId: module.id,
  styles: [':host /deep/ .collection-item .row { min-height:3rem; margin-bottom:0px;border-bottom: none;}',
          '.collection .collection-item {border-bottom: none; }',
          '.collection.with-header .collection-header {border-bottom: none; padding: 0px;}',
          '.collection {border:none; }'],
  templateUrl: './topic.component.html',
  providers: [TopicService],
})

export class TopicComponent implements  OnInit {
  questionItemActions = new EventEmitter<string|MaterializeAction>();
  previewActions = new EventEmitter<string|MaterializeAction>();

  protected study: Study;

  private topics: Topic[];
  private newTopic: Topic;
  private revision: any;
  private showTopicForm = false;
  private questionItem: QuestionItem;
  private parentId: string;
  private config: any;

  constructor(private router: Router, private route: ActivatedRoute,
              private topicService: TopicService,private auth: AuthService) {
    this.newTopic = new Topic();
    this.config = this.buildRevisionConfig();
  }

  ngOnInit(): void {
    this.parentId  = this.route.snapshot.paramMap.get('studyId');
    this.study = this.auth.getGlobalObject('study');
    this.topicService.getAll(this.parentId).then((result) =>this.topics = result);
  }

  // ngAfterContentChecked(): void {
  //   Materialize.updateTextFields();
  // }

  showPreview(topic: any) {
    this.revision = topic;
    this.previewActions.emit({action: 'modal', params: ['open']});
  }

  onToggleTopicForm() {
    this.showTopicForm = !this.showTopicForm;
  }

  onSelectTopic(topic: any) {
    this.auth.setGlobalObject('topic',topic);
    this.router.navigate(['concept/',topic.id]);
  }

  onTopicSavedEvent(topic: any) {
    this.topics =this.topics.filter((s: any) => s.id !== topic.id).concat(topic);
  }

  onNewSave() {
    this.showTopicForm = false;
    this.topicService.save(this.newTopic, this.parentId)
      .subscribe((result: any) => this.onTopicSavedEvent(result));
    this.newTopic  = new Topic();
  }

  onDownloadFile(o: any) {
    const fileName = o.originalName;
    this.topicService.getFile(o.id).then(
      (data: any) => saveAs(data, fileName));
  }

  onGetPdf(element: Topic) {
    const fileName = element.name + '.pdf';
    this.topicService.getPdf(element.id).then(
      (data: any) => saveAs(data, fileName));
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
          });
    }
  }

  private buildRevisionConfig(): any[] {
    const config: any[] = [];
    config.push({'name': 'name', 'label': 'Name'});
    config.push({'name': 'description', 'label': 'Description'});
    config.push({'name': ['otherMaterials'], 'label': 'Files', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map(element => {return element['originalName'] || ''; }).sort().join(',');
      }
      return '';
    }});
    return config;
  }

  private isBlank(str: any): boolean {
    return (!str || /^\s*$/.test(str));
  }
}
