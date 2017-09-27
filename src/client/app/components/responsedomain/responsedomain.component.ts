import { Component, OnInit, AfterContentChecked, EventEmitter } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainType, DomainTypeDescription, PredefinedColumns } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { UserService } from '../../common/user.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { NG_VALIDATORS } from '@angular/forms';

@Component({
  selector: 'qddt-responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  providers: [ResponseDomainService],
})

export class ResponsedomainComponent implements OnInit, AfterContentChecked {
  domainType: DomainType;
  deleteAction = new EventEmitter<any>();
  errorAction = new EventEmitter<string|MaterializeAction>();
  error: string;
  public domainTypeDef = DomainType;
  responseDomains: any[];
  private selectedResponseDomain: ResponseDomain;
  private responseDomain: ResponseDomain;
  private showResponseDomainForm: boolean;
  private searchKeys: string;
  private domainTypeDescription: any[];
  private page: any;
  private columns: any[];
  private isDetail: boolean;
  private showProgressBar: boolean = false;
  private revisionIsVisible: boolean;
  private savedObject: string;
  private savedResponseDomainsIndex: number;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private responseDomainService: ResponseDomainService, private userService: UserService) {
    this.responseDomain = new ResponseDomain();
    this.responseDomains = [];
    this.searchKeys = '';
    this.isDetail = false;
    this.revisionIsVisible = false;
    this.domainType = DomainType.SCALE;
    this.domainTypeDescription = DomainTypeDescription.filter((e:any) => e.id !== DomainType.MIXED);
    this.showResponseDomainForm = false;
    this.page = {};
    this.columns = PredefinedColumns['SCALE'];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.showProgressBar = true;
        let domainType = DomainTypeDescription.find((e: any) => e.id === this.domainType).name;
        this.responseDomainService
          .getAll(domainType, name, '0', this.getSort()).subscribe((result: any) => {
            this.page = result.page;
            this.responseDomains = result.content;
            this.buildAnchorLabel();
            this.showProgressBar = false;
          });
      });
  }

  ngOnInit() {
    let config = this.userService.getGlobalObject('responsedomains');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.responseDomains = config.collection;
      this.selectedResponseDomain = config.item;
      this.isDetail = true;
    } else {
      this.showProgressBar = true;
      this.searchKeys = config.key;
      let name = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
        this.responseDomainService.getAll(name, '', '0', this.getSort()).subscribe((result: any) => {
        this.page = result.page;
        this.responseDomains = result.content;
        this.buildAnchorLabel();
        this.showProgressBar = false;
      });
    }
  }

  ngAfterContentChecked() {
    let config = this.userService.getGlobalObject('responsedomains');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.responseDomains = config.collection;
      this.selectedResponseDomain = config.item;
      this.searchKeys = config.key;
      this.isDetail = true;
    } else {
      this.isDetail = false;
      if(config.key === null || config.key === undefined) {
        this.userService.setGlobalObject('responsedomains', {'current': 'list', 'key': ''});
        this.searchKeys = '';
        this.searchKeysSubect.next('');
      }
    }
  }

  selectDomainType(id: DomainType) {
    this.showProgressBar = true;
    this.domainType = id;
    this.showResponseDomainForm = false;
    let domainType = DomainTypeDescription.find((e: any)=>e.id === id).name;
    this.columns = PredefinedColumns[domainType];
    this.responseDomains = [];
    this.responseDomainService
      .getAll(domainType, this.searchKeys).subscribe((result: any) => {
      this.page = result.page;
      this.responseDomains = result.content;
      this.buildAnchorLabel();
      this.showProgressBar = false;
    });
  }

  select(suggestion: any) {
    this.responseDomain = suggestion;
  }

  onToggleResponseDomainForm() {
    this.showResponseDomainForm = !this.showResponseDomainForm;
    if(this.showResponseDomainForm) {
      this.responseDomain = new ResponseDomain();
      this.responseDomain['isNew'] = true;
      let name = DomainTypeDescription.find((e: any)=>e.id === this.domainType).name;
      this.responseDomain.responseKind = name;
    }
  }

  formCreate() {
    this.searchKeys = '';
    this.showResponseDomainForm = false;
    this.responseDomainService.create(this.responseDomain).subscribe((result: any) => {
      this.responseDomain = result;
      this.responseDomains = [result].concat(this.responseDomains);});
  }

  formChange() {
    this.searchKeys = '';
    this.responseDomainService.update(this.selectedResponseDomain).subscribe((result: any) => {
      let index = this.responseDomains.findIndex((e: any) => e.id === result.id);
      if(index >= 0) {
        this.responseDomains[index] = result;
        this.buildAnchorLabel();
      } else if(this.selectedResponseDomain.id === null && this.savedResponseDomainsIndex >= 0) {
        this.responseDomains[this.savedResponseDomainsIndex] = JSON.parse(this.savedObject);
        this.responseDomains.push(result);
      }
      this.hideDetail();});
  }

  onDetail(responsedomain: any) {
    this.selectedResponseDomain = responsedomain;
    // this.selectedResponseDomain['workinprogress'] = this.selectedResponseDomain['changeKind'] === 'IN_DEVELOPMENT';
    this.savedObject = JSON.stringify(responsedomain);
    this.savedResponseDomainsIndex = this.responseDomains
      .findIndex(q => q['id'] === responsedomain['id']);
    this.selectedResponseDomain['config'] = this.buildRevisionConfig();
    this.isDetail = true;
    this.userService.setGlobalObject('responsedomains',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': this.selectedResponseDomain,
        'collection': this.responseDomains});
  }

  hideDetail() {
    this.savedObject = null;
    this.selectedResponseDomain = null;
    this.savedResponseDomainsIndex = -1;
    this.isDetail = false;
    this.userService.setGlobalObject('responsedomains', {'current': 'list', 'key': this.searchKeys});
  }

  onPage(page: string) {
    this.showProgressBar = true;
    let domainType = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
    this.responseDomainService
      .getAll(domainType, this.searchKeys, page, this.getSort()).subscribe(
      (result: any) => { this.page = result.page;
        this.responseDomains = result.content;
        this.buildAnchorLabel();
        this.showProgressBar = false;
      });
  }

  onDeleteResponseDomainModal() {
    this.deleteAction.emit({action:'modal', params:['open']});
  }

  onConfirmDeleting() {
    this.responseDomainService.deleteResponseDomain(this.selectedResponseDomain.id)
      .subscribe((result: any) => {
        let i = this.responseDomains.findIndex(q => q['id'] === this.selectedResponseDomain.id);
        if (i >= 0) {
          this.responseDomains.splice(i, 1);
        }
        this.hideDetail();
      },
      (error: any) => {this.error = error; this.errorAction.emit({action:'modal', params:['open']});});
  }

  searchResponseDomains(name: string) {
    this.searchKeys = name;
    this.searchKeysSubect.next(name);
  }

  buildRevisionConfig(): any[] {
    let config: any[] = [];
    config.push({'name':'name','label':'Name'});
    config.push({'name':'description','label':'Description'});
    if(this.domainType === DomainType.SCALE) {
      config.push({'name':['managedRepresentation', 'inputLimit', 'minimum'],'label':'Start'});
      config.push({'name':['managedRepresentation', 'inputLimit', 'maximum'],'label':'End'});
      config.push({'name':'displayLayout','label':'display Layout'});
      let children: any[] = this.selectedResponseDomain.managedRepresentation.children;
      for (let i = 0; i < children.length; i++) {
        config.push({'name':['managedRepresentation', 'children', i, 'label'],'label':'Category' + i});
        config.push({'name':['managedRepresentation', 'children', i, 'code', 'codeValue'],'label':'Code' + i});
      }
    } else if(this.domainType === DomainType.LIST) {
      config.push({'name':['managedRepresentation', 'inputLimit', 'maximum'],'label':'Number of Codes'});
      let children: any[] = this.selectedResponseDomain.managedRepresentation.children;
      for (let i = 0; i < children.length; i++) {
        config.push({'name':['managedRepresentation', 'children', i, 'label'],'label':'Category' + i});
        config.push({'name':['managedRepresentation', 'children', i, 'code', 'codeValue'],'label':'Code' + i});
      }
    } else if(this.domainType === DomainType.NUMERIC) {
      config.push({'name':['managedRepresentation', 'inputLimit', 'minimum'],'label':'Low'});
      config.push({'name':['managedRepresentation', 'inputLimit', 'maximum'],'label':'High'});
      config.push({'name':['managedRepresentation', 'format'],'label':'descimal'});
    } else if(this.domainType === DomainType.DATETIME) {
      config.push({'name':['managedRepresentation', 'inputLimit', 'minimum'],'label':'After'});
      config.push({'name':['managedRepresentation', 'inputLimit', 'maximum'],'label':'Before'});
      config.push({'name':['managedRepresentation', 'format'],'label':'Date format'});
    } else if(this.domainType === DomainType.TEXT) {
      config.push({'name':['managedRepresentation', 'inputLimit', 'minimum'],'label':'Min Length'});
      config.push({'name':['managedRepresentation', 'inputLimit', 'maximum'],'label':'Max Length'});
    }
    return config;
  }

  private buildAnchorLabel() {
    if(this.domainType === DomainType.SCALE) {
      for (let rd of this.responseDomains) {
        let label = '';
        let children = rd.managedRepresentation.children;
        if (children.length > 0) {
          label = (children[0].code.codeValue || '') + ' ' + (children[0].label || '');
        }
        if (children.length > 1) {
          let last = children.length - 1;
          label += ' - ' + (children[last].code.codeValue || '') + ' ' + (children[last].label || '');
        }
        rd['anchorLabel'] = label;
      }
    }
  }

  private getSort() {
    let i = this.columns.findIndex((e: any) => e.sortable && e.direction !== '');
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
