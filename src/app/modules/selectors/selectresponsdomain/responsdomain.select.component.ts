import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  ActionKind, Category,
  DOMAIN_TYPE_DESCRIPTION, DomainKind,
  ElementKind,
  ElementRevisionRef,
  IElement, IIdRef,
  IRevisionRef,
  Page, ResponseDomain, TemplateService, UserService
} from '../../../lib';

@Component({
  selector: 'qddt-responsedomain-select',
  template: `
<div class="row hoverable" (mouseenter)="showbutton = !readonly" (mouseleave)="showbutton = false">
  <div class="row">
    <div class="col s7">
      <div class="row">
        <label>Response Domain (V <qddt-version [element]="responseDomain"></qddt-version>) </label>
      </div>
      <div class="row">
        <a *ngIf="!responseDomain" class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
          (click)="openResponseDomain()" [ngClass]="{'qddt-hide': !showbutton}" >
          <i class="material-icons left medium" title="Add element">add</i>
        </a>
        <a *ngIf="canDelete && responseDomain" class="btn-flat btn-floating waves-effect waves-light red" [ngClass]="{'qddt-hide': !showbutton}">
           <i class="material-icons" (click)="onDeletResponsDomain()" title="Remove" >remove</i>
        </a>
        <a *ngIf="canEdit && responseDomain" class="btn-flat btn-floating waves-effect waves-light green darken-1" [ngClass]="{'qddt-hide': !showbutton}">
          <i class="material-icons" (click)="onGetLatest()" title="Get latest">autorenew</i>
        </a>
        <span style="min-height:max-content; ">{{ responseDomain?.name }}</span>
      </div>
    </div>
    <div class="col s5">
      <div class="row">
        <label>Missing</label>
      </div>
      <div class="row">
        <a *ngIf="responseDomain &&  !responseDomain?.missing" class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
            (click)="openMissing()" [ngClass]="{'qddt-hide': !showbutton}" >
            <i class="material-icons left medium" title="Add element">add</i>
        </a>
        <a *ngIf="canDelete && responseDomain?.missing" class="btn-flat btn-floating waves-effect waves-light red" [ngClass]="{'qddt-hide': !showbutton}">
            <i class="material-icons" (click)="onConfirmDeleting()" title="Remove" >remove</i>
        </a>
        <a *ngIf="canEdit && responseDomain?.missing" class="btn-flat btn-floating waves-effect waves-light green darken-1" [ngClass]="{'qddt-hide': !showbutton}">
            <i class="material-icons" (click)="openMissing()" title="Edit">edit</i>
        </a>
        <span style="min-height:max-content; ">{{responseDomain?.missing?.label}}</span>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col s10 offset-s1 ">
      <div class="row" *ngIf="showResponsDomain">
        <div class="row">
          <h4>Select Domain</h4>
          <div class="response-domain-title"><span name="text">Domain Type</span></div>
          <div class="col left" *ngFor="let domain of domainTypeDescription">
            <input name="domaintypegroup" type="radio" id="rd{{domain.id}}"
            (click)="onSelectDomainKind(domain.id)" [checked]="selectedDomainId === domain.id" >
            <label>{{ domain.label }}</label>
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
          (dismissEvent) ="showResponsDomain = false">
        </qddt-item-revision-select>
      </div>
      <div class="row" *ngIf="showMissing">
        <qddt-auto-complete *ngIf="!responseDomain.missing"
          [items]="categories"
          [elementKind]="MISSING_GROUP"
          [autoCreate]="false"
          (selectEvent)="onMissingSelect($event)"
          (enterEvent)="onMissingSearch($event)">
        </qddt-auto-complete>
        <form #missingForm="ngForm">
          <table *ngIf="responseDomain.missing">
            <thead><tr><td>Code</td><td>Category</td></tr></thead>
            <tbody>
            <tr *ngFor="let category of responseDomain.missing.children; let idx=index">
              <td><input id="{{category?.id}}-code-value"
                         name="{{category?.id}}-code-value"
                         type="text" [(ngModel)]="category.code.codeValue" required></td>
              <td>{{ category?.label }}</td>
            </tr>
            </tbody>
          </table>
          <div class="row right-align">
            <a  class="btn btn-flat waves-effect waves-light green white-text" (click)="closeMissing()">
                <i class="material-icons medium white-text">done</i>
            </a>
            <a class="brn btn-flat btn-medium waves-effect waves-light red white-text" (click)="showMissing = false">
                <i class="material-icons medium white-text">close</i>
            </a>
          </div>
        </form>
      </div>
      <p></p>
    </div>
  </div>
</div>
 `
})

export class ResponsedomainSelectComponent implements  OnChanges {
  @Input()
  set responseDomain(responseDomain) {
    this._localresponseDomain = (responseDomain) ? new ResponseDomain(JSON.parse(JSON.stringify(responseDomain))) : null;
  }
  get responseDomain(): ResponseDomain { return this._localresponseDomain; }
  @Input() readonly = false;
  @Output() removeEvent = new EventEmitter<IIdRef>();
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();

  public readonly MISSING_GROUP = ElementKind.MISSING_GROUP;
  public readonly RESPONSEDOMAIN = ElementKind.RESPONSEDOMAIN;
  public readonly domainTypeDescription: any[];
  public readonly canDelete: boolean;
  public readonly canEdit: boolean;

  public showResponsDomain = false;
  public showMissing = false;
  public showProgressBar = false;
  public showbutton = false;
  public selectedDomainId = 1;

  public responseDomains: ResponseDomain[];
  public revisionResults: any[];
  public categories: Category[];

  private _localresponseDomain: ResponseDomain;

  constructor(private service: TemplateService, private access: UserService) {
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);
    this.canDelete = access.canDo(ActionKind.Delete, this.RESPONSEDOMAIN);
    this.canEdit =  access.canDo(ActionKind.Update, this.RESPONSEDOMAIN);
  }

  public onSelectDomainKind(value: number) {
    this.selectedDomainId = (value) && (value < DomainKind.MIXED) ? value : DomainKind.SCALE;
  }

  public ngOnChanges() {
    if (this.responseDomain) {
      this.onSelectDomainKind(DomainKind[this.responseDomain.responseKind]);
    }
  }

  public onGetLatest() {
    this.service.getByKindRevision(this.RESPONSEDOMAIN, this.responseDomain.id).then(
      (result) => {
        this.responseDomain = result.entity as ResponseDomain;
        this.selectedEvent.emit(
          { element: this.responseDomain,
            elementId: this.responseDomain.id,
            elementKind: this.RESPONSEDOMAIN,
            elementRevision : result.revisionNumber });
      });
  }

  public onDeletResponsDomain() {
    this.removeEvent.emit({ elementId: this.responseDomain.id, elementKind: this.responseDomain.classKind });
    this.responseDomain = null;
  }

  public onDeleteMissing() {
    if (this.responseDomain.isMixed) {
      // const rd =  new ResponseDomain(JSON.parse(JSON.stringify(this.responseDomain)));
      const i = this.responseDomain.managedRepresentation.children.findIndex(e => e.categoryType === 'MISSING_GROUP');
      this.responseDomain.managedRepresentation.children.splice(i, 1);
      this.responseDomain.name =
        this.responseDomain.managedRepresentation.label =
          'Mixed [' + this.responseDomain.managedRepresentation.children[0].label + ']';
      // this.responseDomain = rd;
    }
  }

  public onRevisionSelect(ref: ElementRevisionRef) {
    this.responseDomain = ref.element;
    this.selectedEvent.emit(ref);
    this.showResponsDomain = false;
  }

  public onRevisonSearch(ref: IRevisionRef) {
    this.showProgressBar = true;
    this.service.getByKindRevisions( this.RESPONSEDOMAIN, ref.elementId).then(
      (result) => { this.revisionResults =
        result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.showProgressBar = false;
      } );
  }

  public onResponseDomainSearch(ref: IElement) {
    this.showProgressBar = true;
    this.service.searchByKind<ResponseDomain>( {
      kind: this.RESPONSEDOMAIN,
      key: ref.element,
      keys: new Map( [ ['ResponseKind',  DomainKind[this.selectedDomainId] ] ] ),
      page: new Page() } )
    .then((result) => this.responseDomains = result.content)
    .then(() => this.showProgressBar = false );
  }

  public onMissingSearch(ref: IElement) {
    this.showProgressBar = true;
    this.service.searchByKind<Category>( { kind: this.MISSING_GROUP, key: ref.element, page: new Page() } )
    .then((result) => this.categories = result.content)
    .then(() => this.showProgressBar = false );
  }

  public onMissingSelect(ref: IElement) {
    this.responseDomain.addManagedRep(ref.element);
  }

  public openResponseDomain() {
    this.showMissing = !(this.showResponsDomain = true);
    this.onResponseDomainSearch( { element: '*', elementKind: this.RESPONSEDOMAIN });
  }

  public openMissing() {
    this.showResponsDomain = !(this.showMissing = true);
    this.onMissingSearch( { element: '*', elementKind: this.MISSING_GROUP });
  }

  public closeMissing() {
    this.selectedEvent.emit(new ElementRevisionRef({ element: this.responseDomain, elementRevision: 0 }));
    this.showMissing = false;
  }


}
