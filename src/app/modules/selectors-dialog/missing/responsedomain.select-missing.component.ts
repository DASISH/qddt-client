import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ActionKind,
  Category, ElementKind,
  ElementRevisionRef, IElement,
  IRevisionRef,
  Page,
  ResponseDomain,
  TemplateService, UserService
} from '../../../lib';

declare var $: any;

@Component({
  selector: 'qddt-select-missing-dialog',
  styles: ['.qddt-hide { visibility: hidden}'],
  template: `
  <a *ngIf="!getMissing()" class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
    (click)="openModal()" [ngClass]="{'qddt-hide': !showbutton}" >
    <i class="material-icons left medium" title="Add element">add</i>
  </a>
  <a *ngIf="canDelete && getMissing()" class="btn-flat btn-floating waves-effect waves-light red" [ngClass]="{'qddt-hide': !showbutton}">
     <i class="material-icons" (click)="onConfirmDeleting()" title="Remove" >remove</i>
  </a>
  <a *ngIf="canEdit && getMissing()" class="btn-flat btn-floating waves-effect waves-light green darken-1" [ngClass]="{'qddt-hide': !showbutton}">
    <i class="material-icons" (click)="onGetLatest()" title="Get latest">autorenew</i>
  </a>
  <qddt-dialog-big [modalId] = "modalId" [confirm] = true>
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
    <form #missingForm="ngForm" class="black-text">
      <table *ngIf="missingRd">
        <thead><tr><td>Code</td><td>Category</td></tr></thead>
        <tbody>
        <tr *ngFor="let category of getMissing().children; let idx=index">
          <td><input id="{{category?.id}}-code-value"
                     name="{{category?.id}}-code-value"
                     type="text" [(ngModel)]="category.code.codeValue" required></td>
          <td>{{ category?.label }}</td>
        </tr>
        </tbody>
      </table>
    </form>
  </qddt-dialog-big>
`
})

export class ResponsedomainSelectMissingComponent {
  @Input() showbutton = true;
  @Input() responseDomain: ResponseDomain;
  @Output() createdEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public readonly MISSING_GROUP = ElementKind.MISSING_GROUP;
  public readonly modalId = Math.round( Math.random() * 10000).toString();

  public showProgressBar = false;
  public categories: Category[];
  public revisionResults: any[];
  public canDelete: boolean;
  public canEdit: boolean;

  constructor(private service: TemplateService, private access: UserService) {
    this.canDelete = access.canDo(ActionKind.Delete, this.MISSING_GROUP);
    this.canEdit = access.canDo(ActionKind.Update, this.MISSING_GROUP);
  }

  onRevisionSelect(ref: ElementRevisionRef) {
    this.createdEvent.emit(ref);
    $('#' + this.modalId ).modal('close');
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
    $('#' + this.modalId ).modal('close');
  }

  openModal() {
    $('#' + this.modalId ).modal('open');
    this.onResponseDomainSearch( { element: '*', elementKind: this.MISSING_GROUP });
  }


  public getMissing(): Category {
    return new ResponseDomain(this.responseDomain).getMissing();
  }



  // private getGroupEntities(representation: Category): Category[] {
  //   if (representation.categoryType === 'MIXED') {
  //     return representation.children;
  //   } else {
  //     return [representation];
  //   }
  // }



}
