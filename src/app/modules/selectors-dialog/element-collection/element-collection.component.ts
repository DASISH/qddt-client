import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ElementKind, IElement, IEntityAudit,
  MessageService, TemplateService, getIcon, IElementRef
} from '../../../lib';


@Component({
  selector: 'qddt-element-collection',
  template: `
  <div class="collection with-header hoverable row" (mouseenter)="showButton = !readonly"  (mouseleave)="showButton = false">
    <a class="collection-header col s12"  (click)="onItemSearch($event)" style="cursor: zoom-in">
      <label><i class="material-icons small">{{getMatIcon()}}</i>{{labelName}}</label>
      <a *ngIf="showButton" class="secondary-content btn-flat btn-floating btn-small waves-effect waves-light teal">
        <i class="material-icons" title="add Item">playlist_add</i>
      </a>
    </a>
    <a class="collection-item col s12 black-text text-lighten-3" *ngFor="let item of listItems.sort()" (click)="onItemPreview($event,item)" >
      <qddt-version-label class="right" [revisionRef]="item" ></qddt-version-label>
      <ul  class="dropleft">
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
      <div class="question" [innerHtml]="item['description']"></div>
    </a>
  </div>
  <qddt-element-select *ngIf="showSearch" class="input-field" [source]="{ element:'', elementKind: elementKind }" [autoCreate]="true" [xmlLang]="xmlLang"
      (elementSelectedEvent)="onElementSelectedEvent($event)">
  </qddt-element-select>
`,
})
export class ElementCollectionComponent {
  @Input() listItems: IEntityAudit[];
  @Input() elementKind: ElementKind;
  @Input() labelName = 'where is my label?';
  @Input() xmlLang = 'none';
  @Input() readonly = false;
  @Output() createdEvent = new EventEmitter<IElement>();
  @Output() deletedEvent = new EventEmitter<IElementRef>();
  // @Output() modifiedEvent = new EventEmitter<IElement>();

  public readonly modalId = Math.round(Math.random() * 10000);
  public showButton = false;
  showSearch = false;

  constructor(private service: TemplateService, public message: MessageService, private router: Router) {
  }


  public onElementSelectedEvent(ref: IElement) {
    this.listItems.push(ref.element);
    this.createdEvent.emit(ref);
    this.showSearch = false;
  }


  public onItemRemove(event: Event, item: IEntityAudit) {
    event.stopPropagation();
    this.listItems = this.listItems.filter(qi => qi.id !== item.id);
    this.deletedEvent.emit({ elementId: item.id, elementKind: item.classKind });
  }

  public onItemEdit(event: Event, item: IEntityAudit) {
    event.stopPropagation();
    this.service.searchByUuid(item.id).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }

  public onItemUpdate(event: Event, item: IEntityAudit) {
    event.stopPropagation();
  }

  public onItemSearch(event: Event) {
    event.stopPropagation();
    this.showSearch = !this.showSearch;
  }

  public onItemPreview(event: Event, item: IEntityAudit) {
    event.stopPropagation();
    this.message.sendMessage({ element: item, elementKind: item.classKind });
  }

  public getMatIcon(): string {
    return getIcon(this.elementKind);
  }
}
