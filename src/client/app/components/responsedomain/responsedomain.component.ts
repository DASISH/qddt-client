import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainType, DomainTypeDescription, PredefinedColumns } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { UserService } from '../../common/user.service';

@Component({
  selector: 'responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  providers: [ResponseDomainService],
})

export class ResponsedomainComponent implements OnInit, AfterContentChecked {
  domainType: DomainType;
  public domainTypeDef = DomainType;
  private responseDomains: any[];
  private selectedResponseDomain: ResponseDomain;
  private responseDomain: ResponseDomain;
  private showResponseDomainForm: boolean;
  private searchKeys: string;
  private domainTypeDescription: any[];
  private page: any;
  private columns: any[];
  private isDetail: boolean;
  private revisionIsVisible: boolean;

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
  }

  ngOnInit() {
    let config = this.userService.getGlobalObject('responsedomains');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.responseDomains = config.collection;
      this.selectedResponseDomain = config.item;
      this.isDetail = true;
    } else {
      let name = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
        this.responseDomainService.getAll(name).subscribe((result: any) => {
        this.page = result.page;
        this.responseDomains = result.content;
        this.buildAnchorLabel();
      });
    }
  }

  ngAfterContentChecked() {
    let config = this.userService.getGlobalObject('responsedomains');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.responseDomains = config.collection;
      this.selectedResponseDomain = config.item;
      this.isDetail = true;
    } else {
      this.isDetail = false;
    }
  }

  selectDomainType(id: DomainType) {
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
    });
  }

  select(suggestion: any) {
    this.responseDomain = suggestion;
  }

  onToggleResponseDomainForm() {
    this.showResponseDomainForm = !this.showResponseDomainForm;
    if(this.showResponseDomainForm) {
      this.responseDomain = new ResponseDomain();
      let name = DomainTypeDescription.find((e: any)=>e.id === this.domainType).name;
      this.responseDomain.responseKind = name;
    }
  }

  formCreate() {
    this.searchKeys = '';
    this.showResponseDomainForm = false;
    this.responseDomainService.create(this.responseDomain).subscribe((result: any) => {
      this.responseDomain = result;
      this.responseDomains.push(this.responseDomain);});
  }

  formChange() {
    this.searchKeys = '';
    this.responseDomainService.update(this.selectedResponseDomain).subscribe((result: any) => {
      let index = this.responseDomains.findIndex((e: any) => e.id === this.selectedResponseDomain.id);
      if(index >= 0) {
        this.responseDomains[index] = result;
      }
      this.hideDetail();});
  }

  onDetail(responsedomain: any) {
    this.selectedResponseDomain = responsedomain;
    this.selectedResponseDomain['config'] = this.buildRevisionConfig();
    this.isDetail = true;
    this.userService.setGlobalObject('responsedomains',
      {'current': 'detail',
        'page': this.page,
        'item': this.selectedResponseDomain,
        'collection': this.responseDomains});
  }

  hideDetail() {
    this.selectedResponseDomain = null;
    this.isDetail = false;
    this.userService.setGlobalObject('responsedomains', {'current': 'list'});
  }

  onPage(page: string) {
    let domainType = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
    this.responseDomainService
      .getAll(domainType, this.searchKeys, page, this.getSort()).subscribe(
      (result: any) => { this.page = result.page;
        this.responseDomains = result.content;
        this.buildAnchorLabel();
      });
  }

  searchResponseDomains(name: string) {
    this.searchKeys = name;
    let domainType = DomainTypeDescription.find((e: any)=>e.id === this.domainType).name;
    this.responseDomainService
      .getAll(domainType, name, '0', this.getSort()).subscribe((result: any) => {
      this.page = result.page;
      this.responseDomains = result.content;
      this.buildAnchorLabel();
    });
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
