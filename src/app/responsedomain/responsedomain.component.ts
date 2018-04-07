import { Component, OnInit, AfterContentChecked, EventEmitter, Input } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainKind, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { PropertyStoreService } from '../core/global/property.service';
import { Category } from '../category/category.service';
import { ElementKind } from '../shared/elementinterfaces/elements';
import { Page } from '../shared/table/table.page';

// declare var Materialize: any;

@Component({
  selector: 'qddt-responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
})

export class ResponsedomainComponent implements OnInit, AfterContentChecked {
  public domainType: DomainKind;
  public deleteAction = new EventEmitter<any>();
  public responseDomains: ResponseDomain[] = [];
  public isNewFormVisible: boolean;
  public isProgressBarVisible: boolean;
  public isEditFormVisible: boolean;
  public isRevisionVisible: boolean;
  public selectedResponseDomain: ResponseDomain;
  public domainTypeDescription: any[];

  private responseDomain: ResponseDomain;
  private searchKeys: string;
  private page: Page;
  private savedObject: string;
  private savedResponseDomainsIndex: number;
  private searchKeysSubject: Subject<string> = new Subject<string>();
  private previewObject: any;
  private revisionKind = ElementKind.RESPONSEDOMAIN;

  constructor(private responseDomainService: ResponseDomainService, private property: PropertyStoreService) {
    this.responseDomain = new ResponseDomain();
    this.isNewFormVisible = false;
    this.isProgressBarVisible = false;
    this.isEditFormVisible = false;
    this.isRevisionVisible = false;
    this.searchKeys = '';
    this.domainType = DomainKind.SCALE;
    this.domainTypeDescription = DomainTypeDescription.filter((e: any) => e.id !== DomainKind.MIXED);
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.isProgressBarVisible = true;
        const domainType = DomainTypeDescription.find((e: any) => e.id === this.domainType).name;
        this.responseDomainService
          .getAll(domainType, name, this.page).then((result: any) => {
            this.page = result.page;
            this.responseDomains = result.content;
            this.buildAnchorLabel();
            this.isProgressBarVisible = false;
          });
      });
  }

  ngOnInit() {
    const config = this.property.get('responsedomains');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.responseDomains = config.collection;
      this.selectedResponseDomain = config.item;
      this.isEditFormVisible = true;
    } else {
      this.searchKeys = config.key;
      this.searchKeysSubject.next('');
    }
  }

  ngAfterContentChecked() {
    const config = this.property.get('responsedomains');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.responseDomains = config.collection;
      this.selectedResponseDomain = config.item;
      this.searchKeys = config.key;
      this.isEditFormVisible = true;
    } else {
      this.isEditFormVisible = false;
      if (config.key === null || config.key === undefined) {
        this.property.set('responsedomains', {'current': 'list', 'key': ''});
        this.searchKeys = '';
        this.searchKeysSubject.next('');
      }
    }
  }

  selectDomainType(id: DomainKind) {
    this.isNewFormVisible = false;
    this.domainType = id;
    this.searchKeys = '';
    this.searchKeysSubject.next(this.searchKeys);
  }

  select(suggestion: any) {
    this.responseDomain = suggestion;
  }

  onToggleResponseDomainForm() {
    this.isNewFormVisible = !this.isNewFormVisible;
    if (this.isNewFormVisible) {
      this.responseDomain = new ResponseDomain();
      this.responseDomain['isNew'] = true;
      this.responseDomain.responseKind = DomainKind[this.domainType];
    }
  }

  formCreate(managedRepresentation: Category ) {
    this.searchKeys = '';
    this.isNewFormVisible = false;
    this.responseDomain.managedRepresentation = managedRepresentation;
    this.responseDomainService.create(this.responseDomain).subscribe((result: any) => {
      this.responseDomain = result;
      this.responseDomains = [result].concat(this.responseDomains); });
  }

  formChange() {
    this.searchKeys = '';
    this.responseDomainService.update(this.selectedResponseDomain).subscribe((result: any) => {
      const index = this.responseDomains.findIndex((e: any) => e.id === result.id);
      if (index >= 0) {
        this.responseDomains[index] = result;
        this.buildAnchorLabel();
      } else if (this.selectedResponseDomain.id === null && this.savedResponseDomainsIndex >= 0) {
        this.responseDomains[this.savedResponseDomainsIndex] = JSON.parse(this.savedObject);
        this.responseDomains.push(result);
      }
      this.hideDetail(); });
  }

  onSelectDetail(response: ResponseDomain) {
    this.responseDomainService.getResponseDomain(response.id)
      .then((result: any) => {
        this.selectedResponseDomain = result;
        this.savedObject = JSON.stringify(result);
        this.savedResponseDomainsIndex = this.responseDomains
          .findIndex(q => q['id'] === result['id']);
        this.isEditFormVisible = true;
        this.property.set('responsedomains',
          {
            'current': 'detail',
            'page': this.page,
            'key': this.searchKeys,
            'item': this.selectedResponseDomain,
            'collection': this.responseDomains
          });
      });
  }

  hideDetail() {
    this.savedObject = null;
    this.selectedResponseDomain = null;
    this.savedResponseDomainsIndex = -1;
    this.isEditFormVisible = false;
    this.property.set('responsedomains', {'current': 'list', 'key': this.searchKeys});
  }

  onPage(page: Page) {
    this.page = page;
    this.searchKeysSubject.next(this.searchKeys);
  }

  onDeleteResponseDomainModal() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleting() {
    this.responseDomainService.deleteResponseDomain(this.selectedResponseDomain.id)
      .subscribe(() => {
        const i = this.responseDomains.findIndex(q => q['id'] === this.selectedResponseDomain.id);
        if (i >= 0) {
          this.responseDomains.splice(i, 1);
        }
        this.hideDetail();
      });
  }

  onShowRevision(element: any) {
    this.previewObject = element;
  }

  searchResponseDomains(name: string) {
    this.searchKeys = name;
    this.searchKeysSubject.next(name);
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

}
