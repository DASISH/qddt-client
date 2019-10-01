import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import {
  Category,
  ElementKind,
  ElementRevisionRef, IElement,
  IRevisionRef,
  Page,
  ResponseDomain,
  TemplateService
} from '../../../lib';

@Component({
  selector: 'qddt-select-missing-dialog',
  template: `
<!--     [ngClass]="{hide: !showbutton}"-->
  <a class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
     [ngClass]="{disabled:responseDomain === null || responseDomain === undefined}"
     (click)="onOpenModal()">
    <i class="material-icons left medium" title="Add element">add</i>
  </a>
  <div class="modal modal-fixed-footer"
       materialize="modal" [materializeActions]="closeReuseActions">
    <div class="modal-content white black-text" >
      <qddt-item-revision-select
        [showProgressBar] = "showProgressBar"
        [kind] = "MISSING_GROUP"
        [itemList] = "categories"
        [revisionList] = "revisionResults"
        (searchItems)="onResponseDomainSearch($event)"
        (searchRevision)="onRevisonSearch($event)"
        (revisionSelected)="onRevisionSelect($event)"
        (dismissEvent) ="onDismiss()">
      </qddt-item-revision-select>
    </div>
    <div class="modal-footer">
      <button class="btn red waves-effect waves-red" (click)="onDismiss()" >Dismiss</button>
    </div>
  </div>`
})

export class ResponsedomainSelectMissingComponent {
  @Input() parentId: string;
  @Input() name: string;
  @Input() responseDomain: ResponseDomain;
  @Output() createdEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  closeReuseActions = new EventEmitter<any>();

  public readonly MISSING_GROUP = ElementKind.MISSING_GROUP;
  public showProgressBar = false;

  public categories: Category[];
  public revisionResults: any[];

  constructor(private service: TemplateService) {  }

  onRevisionSelect(ref: ElementRevisionRef) {
    this.createdEvent.emit(ref);
    this.closeReuseActions.emit({action: 'modal', params: ['close']});
  }

  onRevisonSearch(ref: IRevisionRef) {
    this.showProgressBar = true;
    this.service.getByKindRevisions( this.MISSING_GROUP, ref.elementId).then(
      (result) => { this.revisionResults =
        result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.showProgressBar = false;
      } );
  }

  onResponseDomainSearch(ref: IElement) {
    this.showProgressBar = true;
    this.service.searchByKind<Category>( { kind: this.MISSING_GROUP, key: ref.element, page: new Page() } )
    .then((result) => this.categories = result.content)
    .then(() => this.showProgressBar = false );
  }

  onDismiss() {
    this.dismissEvent.emit(true);
    this.closeReuseActions.emit({action: 'modal', params: ['close']});
  }

  onOpenModal() {
    this.closeReuseActions.emit({action: 'modal', params: ['open']});
    this.onResponseDomainSearch( { element: '*', elementKind: this.MISSING_GROUP });
  }


  public getMissing(): Category {
    return this.responseDomain.getMissing();
  }


  // private getGroupEntities(representation: Category): Category[] {
  //   if (representation.categoryType === 'MIXED') {
  //     return representation.children;
  //   } else {
  //     return [representation];
  //   }
  // }



}
