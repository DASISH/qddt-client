import { Component, OnInit, AfterContentChecked, EventEmitter, Input } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainKind, DomainTypeDescription, PredefinedColumns } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { PropertyStoreService } from '../core/global/property.service';

// declare var Materialize: any;

@Component({
  selector: 'qddt-responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  providers: [ResponseDomainService],
})

export class ResponsedomainComponent implements OnInit, AfterContentChecked {
  public domainType: DomainKind;
  // public domainTypeDef = DomainKind;
  public deleteAction = new EventEmitter<any>();
  public errorAction = new EventEmitter<string|MaterializeAction>();
  public error: string;
  public responseDomains: ResponseDomain[] = [];
  private responseDomain: ResponseDomain;
  private selectedResponseDomain: ResponseDomain;
  private searchKeys: string;
  private domainTypeDescription: any[];
  private page: any;
  private columns: any[];
  private isNewFormVisible: boolean;
  private isProgressBarVisible: boolean;
  private isEditFormVisible: boolean;
  private isRevisionVisible: boolean;
  private savedObject: string;
  private savedResponseDomainsIndex: number;
  private searchKeysSubject: Subject<string> = new Subject<string>();

  constructor(private responseDomainService: ResponseDomainService, private property: PropertyStoreService) {
    this.responseDomain = new ResponseDomain();
    this.isNewFormVisible = false;
    this.isProgressBarVisible = false;
    this.isEditFormVisible = false;
    this.isRevisionVisible = false;
    this.searchKeys = '';
    this.domainType = DomainKind.SCALE;
    this.domainTypeDescription = DomainTypeDescription.filter((e: any) => e.id !== DomainKind.MIXED);
    this.page = {};
    this.columns = PredefinedColumns['SCALE'];
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.isProgressBarVisible = true;
        const domainType = DomainTypeDescription.find((e: any) => e.id === this.domainType).name;
        this.responseDomainService
          .getAll(domainType, name, '0', this.getSort()).then((result: any) => {
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
      this.isProgressBarVisible = true;
      this.searchKeys = config.key;
      const name = DomainTypeDescription.find((e: any) => e.id === this.domainType).name;
        this.responseDomainService.getAll(name, '', '0', this.getSort()).then((result: any) => {
        this.page = result.page;
        this.responseDomains = result.content;
        this.buildAnchorLabel();
        this.isProgressBarVisible = false;
      });
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
    // Materialize.updateTextFields();
  }

  selectDomainType(id: DomainKind) {
    this.isProgressBarVisible = true;
    this.isNewFormVisible = false;
    this.domainType = id;
    const domainKind = DomainKind[id];

    this.columns = PredefinedColumns[domainKind];
    this.responseDomains = [];
    this.responseDomainService
      .getAll(domainKind, this.searchKeys).then((result: any) => {
      this.page = result.page;
      this.responseDomains = result.content;
      this.buildAnchorLabel();
      this.isProgressBarVisible = false;
    });
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

  formCreate() {
    this.searchKeys = '';
    this.isNewFormVisible = false;
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
        this.selectedResponseDomain['config'] = this.buildRevisionConfig();
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

  onPage(page: string) {
    this.isProgressBarVisible = true;
    // let domainType = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
    this.responseDomainService
      .getAll(DomainKind[this.domainType], this.searchKeys, page, this.getSort()).then(
      (result: any) => { this.page = result.page;
        this.responseDomains = result.content;
        this.buildAnchorLabel();
        this.isProgressBarVisible = false;
      });
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

  searchResponseDomains(name: string) {
    this.searchKeys = name;
    this.searchKeysSubject.next(name);
  }

  buildRevisionConfig(): any[] {
    const config: any[] = [];
    config.push({'name': 'name', 'label': 'Name'});
    config.push({'name': 'description', 'label': 'Description'});
    if (this.domainType === DomainKind.SCALE) {
      config.push({'name': ['managedRepresentation', 'inputLimit', 'minimum'], 'label': 'Start'});
      config.push({'name': ['managedRepresentation', 'inputLimit', 'maximum'], 'label': 'End'});
      config.push({'name': 'displayLayout', 'label': 'display Layout'});
      const children: any[] = this.selectedResponseDomain.managedRepresentation.children;
      for (let i = 0; i < children.length; i++) {
        config.push({'name': ['managedRepresentation', 'children', i, 'label'], 'label': 'Category' + i});
        config.push({'name': ['managedRepresentation', 'children', i, 'code', 'codeValue'], 'label': 'Code' + i});
      }
    } else if (this.domainType === DomainKind.LIST) {
      config.push({'name': ['managedRepresentation', 'inputLimit', 'maximum'], 'label': 'Number of Codes'});
      const children: any[] = this.selectedResponseDomain.managedRepresentation.children;
      for (let i = 0; i < children.length; i++) {
        config.push({'name': ['managedRepresentation', 'children', i, 'label'], 'label': 'Category' + i});
        config.push({'name': ['managedRepresentation', 'children', i, 'code', 'codeValue'], 'label': 'Code' + i});
      }
    } else if (this.domainType === DomainKind.NUMERIC) {
      config.push({'name': ['managedRepresentation', 'inputLimit', 'minimum'], 'label': 'Low'});
      config.push({'name': ['managedRepresentation', 'inputLimit', 'maximum'], 'label': 'High'});
      config.push({'name': ['managedRepresentation', 'format'], 'label': 'descimal'});
    } else if (this.domainType === DomainKind.DATETIME) {
      config.push({'name': ['managedRepresentation', 'inputLimit', 'minimum'], 'label': 'After'});
      config.push({'name': ['managedRepresentation', 'inputLimit', 'maximum'], 'label': 'Before'});
      config.push({'name': ['managedRepresentation', 'format'], 'label': 'Date format'});
    } else if (this.domainType === DomainKind.TEXT) {
      config.push({'name': ['managedRepresentation', 'inputLimit', 'minimum'], 'label': 'Min Length'});
      config.push({'name': ['managedRepresentation', 'inputLimit', 'maximum'], 'label': 'Max Length'});
    }
    return config;
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

  private getSort() {
    const i = this.columns.findIndex((e: any) => e.sortable && e.direction !== '');
    let sort = '';
    if (i >= 0) {
      if (typeof this.columns[i].name === 'string') {
        sort = this.columns[i].name + ',' + this.columns[i].direction;
      } else {
        sort = this.columns[i].name.join('.') + ',' + this.columns[i].direction;
      }
    }
    return sort;
  }

}
