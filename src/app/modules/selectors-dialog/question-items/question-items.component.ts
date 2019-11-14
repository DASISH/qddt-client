import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ElementKind,
  ElementRevisionRef, IRevisionRef,
  MessageService,
  TemplateService
} from '../../../lib';


@Component({
  selector: 'qddt-question-items',
  styles: [
          '.qlabel { padding-top: 5px; }',
          '.qmenu { float: left; z-index:2;}',
          '.question { white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-top:5px; }',
          '.collection a.collection-item { cursor: pointer; padding-left: 10px;}'
  ],
  template:
`
<div class="collection with-header hoverable" (mouseenter)="showButton = !readonly" (mouseleave)="showButton = false">
    <a class="collection-header col s12"  (click)="onQuestionItemSearch($event)" style="cursor: zoom-in">
      <label><i class="material-icons small">help_outline</i>Question Items</label>
      <a class="secondary-content btn-flat btn-floating btn-small waves-effect waves-light teal"
        [ngClass]="{ hide: !showButton }" >
        <i class="material-icons" title="Associate QuestionItem with element">playlist_add</i>
      </a>
    </a>
    <a class="collection-item col s12 grey-text text-darken-1" *ngFor="let cqi of revisionRefs.sort()"
      (mouseover)="cqi.hover=true" (mouseleave)="cqi.hover=false" (click)="onQuestionItemPreview($event,cqi)" >
      <qddt-version-label class="right" [revisionRef]="cqi" ></qddt-version-label>
      <div class="qmenu" [hidden]="!cqi.hover" >
        <a class="btn-flat btn-floating btn-small waves-effect waves-light green lighten-2"
            (click)="onQuestionItemEdit($event,cqi)">
          <i class="material-icons" title="Edit question">edit</i>
        </a>
        <a class="btn-flat btn-floating btn-small waves-effect waves-light blue lighten-2"
          (click)="onQuestionItemUpdate($event, cqi )">
          <i class="material-icons" title="update selected">sync</i>
        </a>
        <a class="btn-flat btn-floating btn-small waves-effect waves-light red lighten-2"
            (click)="onQuestionItemRemove($event, cqi )">
          <i class="material-icons" title="Remove selected">remove</i>
        </a>
      </div>
      <div class="question" [innerHtml]="cqi?.name || cqi?.element?.name && ' - ' && cqi?.element?.question"></div>
    </a>
  </div>
<!-- Modal Structure -->
<div  *ngIf="showRevision" id="MODAL-{{modalId}}" class="modal modal-fixed-footer">
  <div class="modal-content white black-text" >
    <h4>Select QuestionItem version</h4>
    <qddt-element-revision-select
        [source] = "SOURCE"
        (revisionSelectedEvent)="revisionSelectedEvent($event)"
        (dismissEvent) ="onDismiss()">
    </qddt-element-revision-select>
  </div>
  <div class="modal-footer">
    <button
      class="btn btn-default red modal-action modal-close waves-effect waves-red" (click)="onDismiss()" >
      Dismiss
    </button>
  </div>
</div>
`,
})
export class QuestionItemsComponent {
  @Input() revisionRefs: ElementRevisionRef[];
  @Input() readonly = true;
  @Output() createdEvent = new EventEmitter<ElementRevisionRef>();
  @Output() deletedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() modifiedEvent = new EventEmitter<ElementRevisionRef>();

  public readonly QUESTION = ElementKind.QUESTION_ITEM;
  public readonly modalId = Math.round( Math.random() * 10000);

  public SOURCE: ElementKind| IRevisionRef| null;
  private _modalRef: M.Modal;
  private _ShowRef = false;
  private _showButton = false;

  constructor(private service: TemplateService, public message: MessageService, private router: Router ) {
  }

  get showButton(): boolean {
    return this._showButton;
  }
  set showButton(value: boolean) {
    if (value) {
      this._ShowRef = true;
    }
    this._showButton = value;
  }

  get showRevision(): boolean { return this._ShowRef; }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
    }
    return this._modalRef;
  }

  public revisionSelectedEvent(ref: ElementRevisionRef) {
    this.createdEvent.emit(ref);
    this.SOURCE = null;
    this.modalRef.close();
  }

  public onDismiss() {
    this.SOURCE = null;
    this.modalRef.close();
  }

  public onQuestionItemSearch(event: Event) {
    event.stopPropagation();
    this.SOURCE = this.QUESTION;
    this.modalRef.open();
  }

  public onQuestionItemRemove(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.revisionRefs = this.revisionRefs.filter(qi => !(qi.elementId === cqi.elementId && qi.elementRevision === cqi.elementRevision));
    this.deletedEvent.emit(cqi);
  }

  public onQuestionItemEdit(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.service.searchByUuid(cqi.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }

  public onQuestionItemUpdate(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.SOURCE = cqi;
    this.modalRef.open();
  }

  public onQuestionItemPreview(event: Event, item: ElementRevisionRef) {
    event.stopPropagation();
    this.message.sendMessage(item);
  }


}
