import { debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import { MaterializeAction} from 'angular2-materialize';
import { Subject} from 'rxjs';
import { TemplateService} from '../../components/template/template.service';
import { DOMAIN_TYPE_DESCRIPTION, DomainKind, ResponseDomain} from '../../modules/responsedomain/responsedomain.classes';
import { ElementKind, ElementRevisionRef, IElement, IPageSearch, Page} from '../../classes';

@Component({
  selector: 'qddt-responsedomain-reuse',

  templateUrl: './responsedomain.reuse.component.html',
})

export class ResponsedomainReuseComponent implements OnChanges  {
  @Input() readOnly: boolean;
  @Input() showbutton: boolean;
  @Input() responseDomain: ResponseDomain;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() removeEvent = new EventEmitter<any>();

  public modalActions = new EventEmitter<MaterializeAction>();

  public readonly ELEMENT_KIND = ElementKind.RESPONSEDOMAIN;
  public readonly domainTypeDescription: any[];

  public responseDomainList = [];
  public revisionList: any[];
  public formId = Math.round( Math.random() * 10000);

  private searchKeysListener = new Subject<string>();
  private pageSearch: IPageSearch;
  private selectedDomainKind = DomainKind.SCALE;

  constructor(private responseDomainService: TemplateService) {
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);
    this.pageSearch = { kind: this.ELEMENT_KIND, page: new Page(), key: '' };
    this.searchKeysListener.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(val => val.length > 0), )
      .subscribe((search: string) => {
        this.loadPage(search);
      });
  }

  searchResponseDomains(key: string) {
    this.searchKeysListener.next(key);
  }

  selectDomainType(id: DomainKind) {
    this.currentdomainKind = id;
    console.log(this.selectedDomainKind);
    this.loadPage('*');
  }

  ngOnChanges() {
    if (this.responseDomain) {
      this.currentdomainKind = DomainKind[this.responseDomain.responseKind];
    }
  }

  public get currentdomainKind(): DomainKind {
    return this.selectedDomainKind || DomainKind.SCALE;
  }

  public set currentdomainKind(value: DomainKind) {
    this.selectedDomainKind = (value) && (value < DomainKind.MIXED) ? value : DomainKind.SCALE;
  }
  onResponseDomainSelected(element: IElement) {
    this.responseDomainService.getByKindRevisions(this.ELEMENT_KIND , element.element.id).then(
      (result) => { this.revisionList = result.content; },
      (error) => { throw error; });
  }

  onRevisionSelected(item: ElementRevisionRef) {
    this.selectedEvent.emit(item);
    this.closeModal();
  }


  removeResponseDomain() {
    this.responseDomain = null;
    this.removeEvent.emit(true);
  }


  public openModal() {
    this.loadPage('*');
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  public closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  private loadPage(search: string): any {
    this.pageSearch.key = search;
    this.pageSearch.keys = new Map( [ ['ResponseKind',  DomainKind[this.currentdomainKind] ] ] );
    this.responseDomainService.searchByKind(this.pageSearch).then(
      (result) => { this.responseDomainList = result.content; });
  }

}
