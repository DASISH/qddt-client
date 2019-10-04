import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  ActionKind,
  DOMAIN_TYPE_DESCRIPTION, DomainKind,
  ElementKind,
  ElementRevisionRef,
  IElement,
  IRevisionRef,
  Page, ResponseDomain, TemplateService, UserService
} from '../../../lib';

declare var $: any;

@Component({
  selector: 'qddt-responsedomain-reuse-dialog',
  styles: ['.qddt-hide { visibility: hidden}'],
  template: `
  <a *ngIf="!responseDomain" class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
    (click)="openModal()" [ngClass]="{'qddt-hide': !showbutton}" >
    <i class="material-icons left medium" title="Add element">add</i>
  </a>
  <a *ngIf="canDelete && responseDomain" class="btn-flat btn-floating waves-effect waves-light red" [ngClass]="{'qddt-hide': !showbutton}">
     <i class="material-icons" (click)="onConfirmDeleting()" title="Remove" >remove</i>
  </a>
  <a *ngIf="canEdit && responseDomain"class="btn-flat btn-floating waves-effect waves-light green darken-1" [ngClass]="{'qddt-hide': !showbutton}">
    <i class="material-icons" (click)="onGetLatest()" title="Get latest">autorenew</i>
  </a>

  <qddt-dialog-big [modalId] = "modalId">
    <div class="row">
      <h4>Select Domain</h4>
      <div class="response-domain-title"><span name="text">Domain Type</span></div>
      <div class="col left" *ngFor="let domain of domainTypeDescription">
        <input name="domaintypegroup" type="radio" id="rdomain-type-{{domain.id}}" (click)="selectDomainType(domain.id)" [checked]="currentdomainKind === domain.id" >
        <label for="rdomain-type-{{domain.id}}">{{ domain.label }}</label>
      </div>
    </div>
    <qddt-item-revision-select
      [showProgressBar] = "showProgressBar"
      [kind] = "RESPONSEDOMAIN"
      [itemList] = "responseDomains"
      [revisionList] = "revisionResults"
      (searchItems)="onResponseDomainSearch($event)"
      (searchRevision)="onRevisonSearch($event)"
      (revisionSelected)="onRevisionSelect($event)"
      (dismissEvent) ="onDismiss()">
    </qddt-item-revision-select>
    <p></p>
  </qddt-dialog-big>
 `
})

export class ResponsedomainReuseComponent implements  OnChanges {
  @Input() showbutton = true;
  @Input() responseDomain: ResponseDomain;
  @Output() createdEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public readonly RESPONSEDOMAIN = ElementKind.RESPONSEDOMAIN;
  public readonly domainTypeDescription: any[];
  public readonly modalId = Math.round( Math.random() * 10000).toString();

  public showProgressBar = false;
  public canDelete: boolean;
  public canEdit: boolean;
  public responseDomains: ResponseDomain[];
  public revisionResults: any[];

  private _domainKind: DomainKind;

  constructor(private service: TemplateService, private access: UserService) {
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);
    this.canDelete = access.canDo(ActionKind.Delete, this.RESPONSEDOMAIN);
    this.canEdit =  access.canDo(ActionKind.Update, this.RESPONSEDOMAIN);

  }

  ngOnChanges() {
    if (this.responseDomain) {
      this.currentdomainKind = DomainKind[this.responseDomain.responseKind];
    }
  }

  selectDomainType(id: DomainKind) {
    this.currentdomainKind = id;
  }

  public get currentdomainKind(): DomainKind {
    return this._domainKind || DomainKind.SCALE;
  }

  public set currentdomainKind(value: DomainKind) {
    this._domainKind = (value) && (value < DomainKind.MIXED) ? value : DomainKind.SCALE;
  }


  // -----------------------------------------

  onRevisionSelect(ref: ElementRevisionRef) {
    this.createdEvent.emit(ref);
    $('#' + this.modalId ).modal('close');
  }

  onRevisonSearch(ref: IRevisionRef) {
    this.showProgressBar = true;
    this.service.getByKindRevisions( this.RESPONSEDOMAIN, ref.elementId).then(
      (result) => { this.revisionResults =
        result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.showProgressBar = false;
      } );
  }

  onResponseDomainSearch(ref: IElement) {
    this.showProgressBar = true;
    this.service.searchByKind<ResponseDomain>( {
      kind: this.RESPONSEDOMAIN,
      key: ref.element,
      keys: new Map( [ ['ResponseKind',  DomainKind[this.currentdomainKind] ] ] ),
      page: new Page() } )
    .then((result) => this.responseDomains = result.content)
    .then(() => this.showProgressBar = false );
  }

  onDismiss() {
    this.dismissEvent.emit(true);
    $('#' + this.modalId ).modal('close');
  }

  openModal() {
    $('#' + this.modalId ).modal('open');
    this.onResponseDomainSearch( { element: '*', elementKind: this.RESPONSEDOMAIN });
  }
}
