import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ElementKind, IElement, IEntityAudit,
  MessageService, TemplateService
} from '../../../lib';


@Component({
  selector: 'qddt-element-collection',
  styles: [
          '.qlabel { padding-top: 5px; }',
          '.collection a.collection-item { cursor: pointer; padding-left: 10px;}',
          '.question { white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-top:5px; }',
          '.collection-item:hover > ul.dropleft { display:block; } ',
          'ul.dropleft { position: absolute; display: none; margin-top: 0px; margin-bottom: 0px; z-index: 1;}',
          'ul.dropleft li { display:inline-flex; }',
   ],
  template: `
<div class="collection with-header hoverable row">
    <a class="collection-header col s12"  (click)="onItemSearch($event)" style="cursor: zoom-in">
      <label><i class="material-icons tiny">format_list_bulleted</i>{{labelName}}</label>
      <a class="secondary-content btn-flat btn-floating btn-small waves-effect waves-light teal"
        [ngClass]="{ hide: !showButton }" >
        <i class="material-icons" title="add Item">playlist_add</i>
      </a>
    </a>
    <a class="collection-item col s12 grey-text text-darken-1" *ngFor="let item of listItems.sort()" (click)="onItemPreview($event,item)" >
      <qddt-version-label class="right" [revisionRef]="item" ></qddt-version-label>
      <ul *ngIf="!readonly" class="dropleft">
        <li>
          <a class="btn-flat btn-floating btn-small waves-effect waves-light lighten-2 green" (click)="onItemEdit($event,item)">
            <i class="material-icons" title="Edit Item">edit</i>
          </a>
        </li>
        <li>
          <a class="btn-flat btn-floating btn-small waves-effect waves-light lighten-2 red" (click)="onItemRemove($event, item)">
            <i class="material-icons" title="Remove item">remove</i>
          </a>
        </li>
      </ul>
      <div class="question" [innerHtml]="item?.description"></div>
    </a>
  </div>
<!-- Modal Structure -->
<div id="MODAL-{{modalId}}" class="modal modal-fixed-footer">
  <div class="modal-content white black-text" >
    <h4>Search for item</h4>
<!--    <qddt-element-select [source] = "SOURCE" (elementSelectedEvent)="elementSelectedEvent($event)">-->
<!--    </qddt-element-select>-->
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
export class ElementCollectionComponent {
  @Input() listItems: IEntityAudit[];
  @Input() elementKind: ElementKind;
  @Input() labelName = 'where is my label?';
  @Input() readonly = true;
  @Output() createdEvent = new EventEmitter<IElement>();
  @Output() deletedEvent = new EventEmitter<IElement>();
  @Output() modifiedEvent = new EventEmitter<IElement>();

  public readonly modalId = Math.round( Math.random() * 10000);

  private _modalRef: M.Modal;

  constructor(private service: TemplateService, public message: MessageService, private router: Router ) {
  }

  // get showButton(): boolean {
  //   return this._showButton;
  // }
  // set showButton(value: boolean) {
  //   if (value) {
  //     this._ShowRef = true;
  //   }
  //   this._showButton = value;
  // }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
    }
    return this._modalRef;
  }

  public elementSelectedEvent(ref: IElement) {
    this.createdEvent.emit(ref);
    this.modalRef.close();
  }

  public onDismiss() {
    this.modalRef.close();
  }

  public onItemRemove(event: Event, item: IEntityAudit) {
    event.stopPropagation();
    this.listItems = this.listItems.filter(qi => qi.id !== item.id);
    this.deletedEvent.emit({ element: item, elementKind: item.classKind });
  }

  public onItemEdit(event: Event, item: IEntityAudit) {
    event.stopPropagation();
    this.service.searchByUuid(item.id).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }

  public onItemUpdate(event: Event, item: IEntityAudit) {
    event.stopPropagation();
    this.modalRef.open();
  }

  public onItemPreview(event: Event, item: IEntityAudit) {
    event.stopPropagation();
    this.message.sendMessage( { element: item, elementKind: item.classKind });
  }
}
