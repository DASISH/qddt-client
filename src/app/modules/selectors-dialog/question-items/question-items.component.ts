import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ElementKind, ElementRevisionRef,
  IElement, IRevisionRef,
  MessageService,
  TemplateService,
  ActionKind
} from '../../../lib';


@Component({
  selector: 'qddt-question-items',
  template: `
  <div class="collection with-header hoverable row">
      <a class="collection-header col s12"  (click)="onItemSearch($event)" [ngStyle]= " { 'cursor': readonly ? 'normal' : 'zoom-in' }">
        <label><i class="material-icons small">help</i>Question Items</label>
        <a class="secondary-content btn-flat btn-floating btn-small waves-effect waves-light teal"
          [ngClass]="{ hide: !showButton }" >
          <i class="material-icons" title="Associate QuestionItem with element">playlist_add</i>
        </a>
      </a>
      <a class="collection-item col s12 black-text text-lighten-3" *ngFor="let cqi of revisionRefs.sort()" (click)="onItemPreview($event,cqi)" >
        <qddt-version-label class="right" [revisionRef]="cqi" ></qddt-version-label>
        <ul *ngIf="!readonly" class="dropleft">
          <li>
            <a class="btn-flat btn-floating btn-small waves-effect waves-light lighten-2 green" (click)="onItemEdit($event,cqi)">
              <i class="material-icons" title="Edit question">edit</i>
            </a>
          </li>
          <li>
            <a class="btn-flat btn-floating btn-small waves-effect waves-light lighten-2 blue" (click)="onItemUpdate($event, cqi)">
              <i class="material-icons" title="update selected">sync</i>
            </a>
          </li>
          <li>
            <a class="btn-flat btn-floating btn-small waves-effect waves-light lighten-2 red" (click)="confirmDialog.showConfirmDeleting($event, cqi)">
              <i class="material-icons" title="Remove selected">remove</i>
            </a>
          </li>
        </ul>
        <div class="question" [innerHtml]="cqi?.name || cqi?.element?.name &&  ' ➫ ' && cqi?.element?.question"></div>
      </a>
    </div>

    <qddt-confirm-remove (dialogResult)="onItemRemove($event)" #confirmDialog>
    </qddt-confirm-remove>
  <!-- Modal Structure -->
  <div  id="MODAL-{{modalId}}" class="modal modal-fixed-footer">
    <div class="modal-content white black-text" >
      <h4>Select QuestionItem version</h4>
      <qddt-element-revision-select
          [source] = "SOURCE"
          [xmlLang]="xmlLang"
          (revisionSelectedEvent)="revisionSelectedEvent($event)"
          (dismissEvent) ="onDismiss()">
      </qddt-element-revision-select>
    </div>
    <div class="modal-footer">
      <a class="btn btn-default red  waves-effect waves-light" (click)="onDismiss()" >Dismiss</a>
    </div>
  </div>
`,
})
export class QuestionItemsComponent {
  @Input() revisionRefs: ElementRevisionRef[] = [];
  @Input() xmlLang = 'none';
  @Input() readonly = true;
  @Output() createdEvent = new EventEmitter<ElementRevisionRef>();
  @Output() deletedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() modifiedEvent = new EventEmitter<ElementRevisionRef>();

  public readonly QUESTION = ElementKind.QUESTION_ITEM;
  public readonly modalId = Math.round(Math.random() * 10000);

  public SOURCE: IElement | IRevisionRef | null;
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _modalRef: M.Modal;
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _ShowRef = false;
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private _showButton = false;
  private action = ActionKind.Create;


  constructor(private service: TemplateService, public message: MessageService, private router: Router) {
  }

  get showButton(): boolean {
    return this._showButton && this.readonly;
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
      const ref = document.querySelector('#MODAL-' + this.modalId);
      console.debug(ref);
      this._modalRef = M.Modal.init(ref, { inDuration: 750, outDuration: 1000, startingTop: '50%', endingTop: '10%', preventScrolling: true, opacity: 0.3, }
      );
    }
    return this._modalRef;
  }

  public revisionSelectedEvent(ref: ElementRevisionRef) {
    this.SOURCE = null;
    this.modalRef.close();
    if (this.action === ActionKind.Create) {
      this.createdEvent.emit(ref);
    } else {
      this.modifiedEvent.emit(ref);
    }
  }

  public onDismiss() {
    this.SOURCE = null;
    this.modalRef.close();
  }

  public onItemSearch(event: Event) {
    if (this.readonly) { return; }
    event.stopPropagation();
    this.SOURCE = { element: '', elementKind: this.QUESTION };
    this.modalRef.open();
  }

  public onItemRemove(cqi: ElementRevisionRef) {
    if (cqi) {
      this.revisionRefs = this.revisionRefs.filter(qi => !(qi.elementId === cqi.elementId && qi.elementRevision === cqi.elementRevision));
      this.deletedEvent.emit(cqi);
    }
  }

  public onItemEdit(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.service.searchByUuid(cqi.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }

  public onItemUpdate(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.action = ActionKind.Update;
    if (cqi && cqi.elementRevision) {
      this.SOURCE = cqi;
    }
    // console.debug(this.SOURCE || JSON);
    this.modalRef.open();
  }

  public onItemPreview(event: Event, item: ElementRevisionRef) {
    event.stopPropagation();
    this.message.sendMessage(item);
  }


}
