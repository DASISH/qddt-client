import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  DOMAIN_TYPE_DESCRIPTION, DomainKind,
  ElementKind,
  ElementRevisionRef,
  IElement,
  IRevisionRef,
  Page, ResponseDomain, TemplateService
} from '../../../lib';

@Component({
  selector: 'qddt-responsedomain-reuse-dialog',
  styles: [ '.hidden { display:none; }',
            '.parent:hover .hidden { display:block; }',
            ],
  template: `
  <a class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"  (click)="openModal()">
    <i class="material-icons left medium" title="Add element">add</i>
  </a>
  <div class="modal modal-fixed-footer"
       materialize="modal" [materializeActions]="closeReuseActions">
    <div class="modal-content white black-text" >
    <div class="row">
        <h4>Reuse Domain</h4>
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
    </div>
    <div class="modal-footer">
      <div class="input-field right">
        <a class="waves-effect waves-light btn right red" (click)="onDismiss()">Dismiss</a>
      </div>
    </div>
  </div>`
})

export class ResponsedomainReuseComponent implements  OnChanges{
  @Input() parentId: string;
  @Input() name: string;
  @Input() responseDomain: ResponseDomain;
  @Output() createdEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  closeReuseActions = new EventEmitter<any>();

  public readonly RESPONSEDOMAIN = ElementKind.RESPONSEDOMAIN;
  public readonly domainTypeDescription: any[];

  public showProgressBar = false;
  public responseDomains: ResponseDomain[];
  public revisionResults: any[];
  private _domainKind: DomainKind;

  constructor(private service: TemplateService) {
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);

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

  // private loadPage(search: string): any {
  //   this.pageSearch.key = search;
  //   this.pageSearch.keys = new Map( [ ['ResponseKind',  DomainKind[this.currentdomainKind] ] ] );
  //   this.responseDomainService.searchByKind(this.pageSearch).then(
  //     (result) => { this.responseDomainList = result.content; });
  // }

  // -----------------------------------------

  onRevisionSelect(ref: ElementRevisionRef) {
    this.createdEvent.emit(ref);
    this.closeReuseActions.emit({action: 'modal', params: ['close']});
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
    this.closeReuseActions.emit({action: 'modal', params: ['close']});
  }

  openModal() {
    this.closeReuseActions.emit({action: 'modal', params: ['open']});
    this.onResponseDomainSearch( { element: '*', elementKind: this.RESPONSEDOMAIN });
  }
}
