import { Component, OnInit,  EventEmitter } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainKind, DOMAIN_TYPE_DESCRIPTION } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { PropertyStoreService } from '../core/global/property.service';
import { Page } from '../shared/classes/classes';
import { ElementKind } from '../shared/classes/enums';
import { Category } from '../category/category.classes';

// declare var Materialize: any;

@Component({
  selector: 'qddt-responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
})

export class ResponsedomainComponent implements OnInit {
  public readonly  RESPONSEDOMAIN = ElementKind.RESPONSEDOMAIN;
  public domainType: DomainKind;
  public deleteAction = new EventEmitter<any>();
  public responseDomains: ResponseDomain[];

  public isNewFormVisible = false;
  public isProgressBarVisible = false;
  public isEditFormVisible = false;
  public isRevisionVisible = false;

  public page: Page;
  public domainTypeDescription: any[];
  public selectedResponseDomain: ResponseDomain;
  public responseDomain: ResponseDomain;

  private searchKeys: string;

  private savedResponseDomainsIndex: number;
  private searchKeysListener: Subject<string> = new Subject<string>();

  constructor(private responseDomainService: ResponseDomainService, private property: PropertyStoreService) {
    this.searchKeys = '*';
    this.domainType = DomainKind.SCALE;
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e: any) => e.id !== DomainKind.MIXED);
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => this.loadPage(name) );
  }

  ngOnInit() {
    const config = this.property.get('responsedomains');
    this.page = (config.page) ? config.page : new Page();
    if (config.current === 'detail' ) {
      this.selectedResponseDomain = config.item;
      this.isEditFormVisible = true;
    } else {
      this.domainType = (config.domainType) ? config.domainType :  DomainKind.SCALE;
      this.searchKeys = (config.key) ? config.key : '*';
      this.searchKeysListener.next(this.searchKeys);
    }
  }

  public onSelectDomainType(id: DomainKind) {
    this.isNewFormVisible = false;
    this.domainType = id;
    this.loadPage(this.searchKeys);
  }

  public onToggleResponseDomainForm() {
    this.isNewFormVisible = !this.isNewFormVisible;
    if (this.isNewFormVisible) {
      this.responseDomain = new ResponseDomain();
      this.responseDomain['isNew'] = true;
      this.responseDomain.responseKind = DomainKind[this.domainType];
    }
  }

  public onFormCreate(managedRepresentation: Category ) {
    this.searchKeys = '';
    this.isNewFormVisible = false;
    this.responseDomain.managedRepresentation = managedRepresentation;
    this.responseDomainService.create(this.responseDomain).subscribe((result: any) => {
      this.responseDomain = result;
      this.responseDomains = [result].concat(this.responseDomains); });
  }

  public onFormSave() {
    this.searchKeys = '';
    this.responseDomainService.update(this.selectedResponseDomain).subscribe(
      (result) => {
        const index = this.responseDomains.findIndex((e) => e.id === result.id);
        if (index >= 0) {
          this.responseDomains[index] = result;
          this.buildAnchorLabel();
        } else {
          this.responseDomains.push(result);
        }
        this.onHideDetail(); },
      (error) => { throw error; });
  }

  public onSelectDetail(response: ResponseDomain) {
    this.responseDomainService.getResponseDomain(response.id).then(
      (result: any) => {
        this.selectedResponseDomain = result;
        this.isEditFormVisible = true;
        this.property.set('responsedomains',
          {
            'current': 'detail',
            'page': this.page,
            'key': this.searchKeys,
            'domainType': this.domainType,
            'item': this.selectedResponseDomain,
          });
      });
  }

  onHideDetail() {
    this.selectedResponseDomain = null;
    this.savedResponseDomainsIndex = -1;
    this.isEditFormVisible = false;
    this.property.set('responsedomains', {'current': 'list', 'key': this.searchKeys});
  }

  public onPage(page: Page) {
    this.page = page;
    this.loadPage(this.searchKeys);
  }

  public onDeleteResponseDomainModal() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  public onConfirmDeleting() {
    this.responseDomainService.deleteResponseDomain(this.selectedResponseDomain.id)
      .subscribe(() => {
        const i = this.responseDomains.findIndex(q => q['id'] === this.selectedResponseDomain.id);
        if (i >= 0) {
          this.responseDomains.splice(i, 1);
        }
        this.onHideDetail();
      });
  }

  public onSearchResponseDomains(name: string) {
    this.searchKeys = name;
    this.searchKeysListener.next(name);
  }

  private buildAnchorLabel() {
    if (this.domainType === DomainKind.SCALE) {
      for (const rd of this.responseDomains) {
        let label = '';
        const children = rd.managedRepresentation.children;
        if (children.length > 0) {
          label = (children[0].code.codeValue || '') + ' ' + (children[0].label || '');
        }
        if (children.length > 1) {
          const last = children.length - 1;
          label += ' - ' + (children[last].code.codeValue || '') + ' ' + (children[last].label || '');
        }
        rd['anchorLabel'] = label;
      }
    }
  }

  private loadPage(search: string ) {
    const domainTypeName = DOMAIN_TYPE_DESCRIPTION.find( (e) => e.id === this.domainType).name;
    this.isProgressBarVisible = true;
    this.responseDomainService.getAll(domainTypeName, search, this.page).then(
        (result: any) => {
          this.page = new Page(result.page);
          this.responseDomains = result.content;
          this.isProgressBarVisible = false;
          this.buildAnchorLabel(); },
        (error) => { this.isProgressBarVisible = false; throw error; }
      );
  }
}
