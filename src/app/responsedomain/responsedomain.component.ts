import { Component, OnInit,  EventEmitter } from '@angular/core';
import { DomainKind, DOMAIN_TYPE_DESCRIPTION, ResponseDomain} from './responsedomain.classes';
import { Subject } from 'rxjs/Subject';
import { QddtPropertyStoreService } from '../core/global/property.service';
import { TemplateService } from '../template/template.service';
import { ElementKind } from '../shared/classes/enums';
import { Category } from '../category/category.classes';
import { IPageSearch } from '../shared/classes/interfaces';
import { Page } from '../shared/classes/classes';

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

  public domainTypeDescription: any[];
  public selectedResponseDomain: ResponseDomain;
  public responseDomain: ResponseDomain;

  private savedResponseDomainsIndex: number;
  private searchKeysListener: Subject<string> = new Subject<string>();
  private pageSearch: IPageSearch;

  constructor(private service: TemplateService, private property: QddtPropertyStoreService) {
    this.pageSearch = { kind: this.RESPONSEDOMAIN, key: '*', page : new Page(), sort: 'modified,desc' };
    this.domainType = DomainKind.SCALE;
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id !== DomainKind.MIXED);
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => this.loadPage(name) );
  }

  ngOnInit() {
    const config = this.property.get('responsedomains');
    if (config.current === 'detail' ) {
      this.selectedResponseDomain = config.item;
      this.isEditFormVisible = true;
    } else {
      this.domainType = (config.domainType) ? config.domainType :  DomainKind.SCALE;
      this.loadPage();
    }
  }

  public onSelectDomainType(id: DomainKind) {
    this.isNewFormVisible = false;
    this.domainType = id;
    this.loadPage();
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
    this.isNewFormVisible = false;
    this.responseDomain.managedRepresentation = managedRepresentation;
    this.service.update(this.responseDomain).subscribe(
      (result) => {
        this.responseDomain = result;
        this.responseDomains = [result].concat(this.responseDomains); });
  }

  public onFormSave() {
    this.service.update(this.selectedResponseDomain).subscribe(
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
    this.service.getItemByKind<ResponseDomain>(this.RESPONSEDOMAIN, response.id).then(
      (result) => {
        this.selectedResponseDomain = result;
        this.isEditFormVisible = true;
        this.property.set('responsedomains',
          {
            'current': 'detail',
            'pageSearch': this.pageSearch,
            'domainType': this.domainType,
            'item': this.selectedResponseDomain,
          });
      });
  }

  onHideDetail() {
    this.selectedResponseDomain = null;
    this.savedResponseDomainsIndex = -1;
    this.isEditFormVisible = false;
    this.property.set('responsedomains', {'current': 'list', 'pageSearch': this.pageSearch });
  }

  public onFetchItems(search: IPageSearch ) {
    this.pageSearch = search;
    this.loadPage();
  }



  public onDeleteResponseDomainModal() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  public onConfirmDeleting() {
    this.service.delete(this.selectedResponseDomain)
      .subscribe(() => {
        const i = this.responseDomains.findIndex(q => q['id'] === this.selectedResponseDomain.id);
        if (i >= 0) {
          this.responseDomains.splice(i, 1);
        }
        this.onHideDetail();
      });
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

  private loadPage(search?: string ) {
    const domainTypeName = DOMAIN_TYPE_DESCRIPTION.find( (e) => e.id === this.domainType).name;
    this.isProgressBarVisible = true;
    if (search) {
      this.pageSearch.key = search;
    }
    this.pageSearch.keys = new Map([['ResponseKind',  DomainKind[this.domainType]]);
    this.service.searchByKind(this.pageSearch).then(
        (result: any) => {
          this.pageSearch.page = new Page(result.page);
          this.responseDomains = result.content;
          this.isProgressBarVisible = false;
          this.buildAnchorLabel(); },
        (error) => { this.isProgressBarVisible = false; throw error; }
      );
  }
}
