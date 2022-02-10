// import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ElementKind, TemplateService, Topic, LANGUAGE_MAP } from '../../../lib';

@Component({
  selector: 'qddt-topic-edit',
  providers: [{ provide: 'elementKind', useValue: 'TOPIC_GROUP' }],
  template: `
  <ng-container *ngIf="(topic && isVisible)">
    <form class="row" id="{{formId}}" (ngSubmit)="onSave()" #hf="ngForm">

    <qddt-input class="col s10" required name="name" label="Name" type="text" placeholder="If not specified, same as Label, but must be unique within the Agencys TopicGroups"
      [(ngModel)]="topic.name" data-length="250">
    </qddt-input>
    <qddt-select class="col s2" required name="xmlLang" label="Language" [(ngModel)]="topic.xmlLang"
      [lockups]="LANGUAGES">
    </qddt-select>
    <qddt-input class="col s12" required name="label" label="Label" type="text" placeholder="This will be the visual representation of this Topic"
                [(ngModel)]="topic.label" data-length="250">
    </qddt-input>

    <qddt-textarea class="col s12" name="description"
        required
        placeholder="Describe each TopicGroup in a broad sense, if the TopicGroup is very narrow, you can choose to treat it as a Concept"
        label="Description"
        [(ngModel)]="topic.description"
        data-length="20000">
    </qddt-textarea>

    <qddt-download class="col s12" [fileStore]="fileStore" [entity]="topic" [readonly]="readonly"></qddt-download>

    <qddt-rational class="col s12" [formName]="'RationalComp'" [element]="topic" [config]="{hidden: [2,3]}"></qddt-rational>

    <qddt-element-footer class="col s12" [element]="topic"></qddt-element-footer>

    <div class="col s12 right-align" *ngIf="!readonly">
      <button type="submit" class="btn btn-default" [disabled]="!hf.form.valid" >Submit</button>
    </div>


  </form>
</ng-container>
`})

export class TopicEditComponent {
  @Input() topic: Topic;
  @Output() topicChanged = new EventEmitter<Topic>();
  @Input() readonly = false;

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly TOPIC_KIND = ElementKind.TOPIC_GROUP;
  public showRevision = false;
  public showNew = false;
  public isVisible = false;
  public fileStore: File[] = [];


  constructor(private service: TemplateService) { }

  public async onSave() {
    console.debug('onSave')
    const formData = new FormData();
    formData.append('topicgroup', JSON.stringify(this.topic));
    this.fileStore.forEach((file) => { formData.append('files', file); });

    this.topic = await this.service.updateWithFiles(this.TOPIC_KIND, formData).toPromise();
    this.topicChanged.emit(this.topic);
    this.isVisible = false
  }

}
