import {AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ElementKind,
  ElementRevisionRef, IRevisionRef,
  MessageService,
  TemplateService
} from '../../../lib';


@Component({
  selector: 'qddt-question-items',
  template:
`
<div class="collection with-header row hoverable"
    (mouseenter)="showbutton = !readonly" (mouseleave)="showbutton = false">
    <a class="collection-header">
      <label><i class="material-icons small">help_outline</i>Question Items</label>
      <a class="secondary-content btn-flat btn-floating btn-small waves-effect waves-light teal"
        [ngClass]="{ hide: !showbutton }"  (click)="onQuestionItemSearch($event)">
        <i class="material-icons" title="Associate QuestionItem with element">playlist_add</i>
      </a>
    </a>
    <a class="col s12 collection-item grey-text text-darken-1" *ngFor="let cqi of questionItems.sort()"
      (mouseover)="cqi.hover=true" (mouseleave)="cqi.hover=false" (click)="onPreview($event,cqi)">
      <qddt-version-label class="right" [revisionRef]="cqi" ></qddt-version-label>
      <div style="float: left; z-index:2;" [hidden]="!cqi.hover" >
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
      <div [innerHtml]="cqi?.name || cqi?.element?.name && ' - ' && cqi?.element?.question"
      style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">
      </div>
    </a>
  </div>
<!-- Modal Structure -->
<div id="MODAL-{{modalId}}" class="modal modal-fixed-footer">
  <div class="modal-content white black-text" >
    <h4>Select QuestionItem version</h4>
    <qddt-element-revision-select
        [source] = "SOURCE"
        (revisionSelected)="onRevisionSelect($event)"
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
styles: [
  '.collection.with-header .collection-header {border-bottom: none; padding: 0px;}',
  '.collection a.collection-item { min-height: 3rem; border-bottom: none; color: rgb(3, 155, 229); cursor: pointer; padding:5px 10px 5px 10px ; }',
  '.collection {border:none; }'],
})
export class QuestionItemsComponent implements AfterViewInit {
  @Input() questionItems: ElementRevisionRef[];
  @Input() readonly = true;
  @Output() createdEvent = new EventEmitter<ElementRevisionRef>();
  @Output() deletedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() modifiedEvent = new EventEmitter<ElementRevisionRef>();

  public readonly QUESTION = ElementKind.QUESTION_ITEM;
  public modalId = Math.round( Math.random() * 10000);
  public showbutton = false;

  public SOURCE: ElementKind| IRevisionRef;
  private modalRef: M.Modal;

  constructor(private service: TemplateService, public message: MessageService, private router: Router ) {  }

  ngAfterViewInit(): void {
    this.modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
  }

  public onRevisionSelect(ref: ElementRevisionRef) {
    console.log(ref || JSON );
    // if (this.selectedItem) {
    //   this.deletedEvent.emit(this.selectedItem);
    //   // this.questionItems = this.questionItems.filter( qi => qi.elementId !== ref.elementId);
    //   this.createdEvent.emit(ref);
    // } else {
    this.createdEvent.emit(ref);
    // }
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
    this.questionItems = this.questionItems.filter( qi => qi.elementId !== cqi.elementId);
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

  public onPreview(event: Event, item: ElementRevisionRef) {
    event.stopPropagation();
    this.message.sendMessage(item);
      // { elementId: item.elementId,
      //   elementRevision: item.elementRevision,
      //   elementKind: item.elementKind} as IRevisionRef);
  }


}
