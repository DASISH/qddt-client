import {Component, Input, EventEmitter, Output, AfterContentChecked, AfterViewInit} from '@angular/core';
import {ElementKind, TemplateService, Topic} from '../../../lib';

@Component({
  selector: 'qddt-topic-edit',
  styles: [
    // '.nomargin { margin:0; }',
    // ':host ::ng-deep .hoverable { margin-bottom:0px;}',
    // ':host ::ng-deep .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  template: `
<div [hidden]="!(topic && isVisible)">
  <form id="{{formId}}" (ngSubmit)="onSave()" #topicForm="ngForm">
    <div class="row input-field">
      <input  type="text" name="name"
        [(ngModel)]="topic.name" required data-length ="250">
      <label class="active">Name</label>
    </div>

    <div class="row input-field">
      <textarea name="description" class="materialize-textarea"
        [(ngModel)]="topic.description" required  data-length ="10000" >
      </textarea>
      <label>Description</label>
    </div>

    <qddt-download [fileStore]="fileStore" [entity]="topic" [readonly]="readonly"></qddt-download>

    <qddt-rational [formName]="'RationalComp'" [element]="topic" [config]="{hidden: [2,3]}"></qddt-rational>

    <qddt-element-footer [element]="topic"></qddt-element-footer>

    <div class="row right-align">
      <button type="submit" class="btn btn-default" [disabled]="topicForm.form.invalid" >Submit</button>
    </div>

  </form>
</div>
`})

export class TopicEditComponent  implements AfterContentChecked, AfterViewInit {
  @Input() topic: Topic;
  @Input() readonly = false;
  @Input() isVisible = false;
  @Output() savedEvent = new EventEmitter<any>();

  public readonly formId = Math.round( Math.random() * 10000);
  private readonly TOPIC_KIND = ElementKind.TOPIC_GROUP;

  public fileStore: File[] = [];

  constructor(private service: TemplateService) {
   }

  ngAfterContentChecked(): void {
    // document.querySelectorAll('textarea').forEach(
    //   input => M.textareaAutoResize(input));
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
      input => M.CharacterCounter.init(input));
    M.updateTextFields();
  }


  public async onSave() {
    const formData = new FormData();
    formData.append('topicgroup', JSON.stringify(this.topic));
    this.fileStore.forEach( (file) => { formData.append('files', file); });

    this.topic = await this.service.updateWithFiles(this.TOPIC_KIND, formData).toPromise();

    this.savedEvent.emit(this.topic);
  }

}
