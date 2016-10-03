import { Component, OnInit } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainType, DomainTypeDescription, PredefinedColumns } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';

@Component({
  selector: 'responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  styles: [],
  providers: [ResponseDomainService],
})

export class ResponsedomainComponent implements OnInit {
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

  constructor(private responseDomainService: ResponseDomainService) {
    this.responseDomain = new ResponseDomain();
    this.responseDomains = [];
    this.searchKeys = '';
    this.isDetail = false;
    this.revisionIsVisible = false;
    this.domainType = DomainType.SCALE;
    this.domainTypeDescription = DomainTypeDescription;
    this.showResponseDomainForm = false;
    this.page = {};
    this.columns = PredefinedColumns['SCALE'];
  }

  ngOnInit() {
    let name = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
    this.responseDomainService.getAll(name).subscribe((result: any) => {
      this.page = result.page;
      this.responseDomains = result.content;
      this.buildAnchorLabel();
    });
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
      this.hideDetail();});
  }

  onDetail(responsedomain: any) {
    this.selectedResponseDomain = responsedomain;
    this.isDetail = true;
  }

  hideDetail() {
    this.selectedResponseDomain = null;
    this.isDetail = false;
  }

  onPage(page: string) {
    let domainType = DomainTypeDescription.find((e: any) =>e.id === this.domainType).name;
    this.responseDomainService
      .getAll(domainType, this.searchKeys, page).subscribe(
      (result: any) => { this.page = result.page;
        this.responseDomains = result.content;
        this.buildAnchorLabel();
      });
  }

  searchResponseDomains(name: string) {
    this.searchKeys = name;
    let domainType = DomainTypeDescription.find((e: any)=>e.id === this.domainType).name;
    this.responseDomainService
      .getAll(domainType, name).subscribe((result: any) => {
      this.page = result.page;
      this.responseDomains = result.content;
      this.buildAnchorLabel();
    });
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

}
