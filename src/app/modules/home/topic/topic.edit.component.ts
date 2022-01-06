import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ElementKind, TemplateService, Topic, LANGUAGE_MAP } from '../../../lib';

@Component({
  selector: 'qddt-topic-edit',
  template: `
<div [hidden]="!(topic && isVisible)">
  <form class="row" id="{{formId}}" (ngSubmit)="onSave()" #topicForm="ngForm">

    <qddt-input class="col s10" required name="name" label="Name" type="text" placeholder="If not specified, same as Label, but must be unique within the Agencys TopicGroups"
      [(ngModel)]="topic.name" data-length="250">
    </qddt-input>
    <qddt-select class="col s2" required name="xmlLang" label="Language" [(ngModel)]="topic.xmlLang"
      [lockups]="LANGUAGES">
    </qddt-select>
    <qddt-input class="col s12" required name="label" label="Label" type="text" placeholder="This will be the visual representation of this Topic"
                [(ngModel)]="topic.name" data-length="250">
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

    <div class="col s12 right-align">
      <button type="submit" class="btn btn-default" [disabled]="topicForm.form.invalid" >Submit</button>
    </div>

  </form>
</div>
`})

export class TopicEditComponent {
  @Input() topic: Topic;
  @Input() readonly = false;
  @Output() savedEvent = new EventEmitter<any>();

  public readonly formId = Math.round(Math.random() * 10000);
  private readonly TOPIC_KIND = ElementKind.TOPIC_GROUP;
  public readonly LANGUAGES = LANGUAGE_MAP;

  public isVisible = false;
  public showRevision = false;
  public fileStore: File[] = [];

  constructor(private service: TemplateService) {
  }

  public async onSave() {
    const formData = new FormData();
    formData.append('topicgroup', JSON.stringify(this.topic));
    this.fileStore.forEach((file) => { formData.append('files', file); });

    this.topic = await this.service.updateWithFiles(this.TOPIC_KIND, formData).toPromise();

    this.savedEvent.emit(this.topic);
  }

}
