import {Component} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';
import {LocalDatePipe} from '../../common/date_pipe';
import {CommentListComponent} from '../comment/comment_list.component';
import {DomainType, DomainTypeDescription, PredefinedColumns} from './responsedomain.constant';
import {ResponseDomainService} from './responsedomain.service';
import {ResponsedomainFormComponent} from './responsedomain.form.component';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {ResponsedomainListComponent} from './responsedomain.list.component';
import {PreviewComponent} from './responsedomain.preview.component';
import {QddtTableComponent} from '../table/table.component';
import {RevisionComponent} from '../revision/revision.component';

@Component({
  selector: 'responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  styles: [],
  pipes: [LocalDatePipe],
  providers: [ResponseDomainService],
  directives: [CommentListComponent,
    ResponsedomainFormComponent, QddtTableComponent, RevisionComponent,
    AutocompleteComponent, ResponsedomainListComponent, PreviewComponent]
})

export class ResponsedomainComponent {
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
    let name = DomainTypeDescription.find(e=>e.id === this.domainType).name;
    this.responseDomainService.getAll(name).subscribe(result => {
      this.page = result.page;
      this.responseDomains = result.content;
      this.buildAnchorLabel();
    });
  }

  selectDomainType(id: DomainType) {
    this.domainType = id;
    this.showResponseDomainForm = false;
    let domainType = DomainTypeDescription.find(e=>e.id === id).name;
    this.columns = PredefinedColumns[domainType];
    this.responseDomains = [];
    this.responseDomainService
      .getAll(domainType, this.searchKeys).subscribe(result => {
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
      let name = DomainTypeDescription.find(e=>e.id === this.domainType).name;
      this.responseDomain.responseKind = name;
    }
  }

  formCreate() {
    this.searchKeys = '';
    this.showResponseDomainForm = false;
    this.responseDomainService.create(this.responseDomain).subscribe(result => {
      this.responseDomain = result;
      this.responseDomains.push(this.responseDomain);});
  }

  formChange() {
    this.searchKeys = '';
    this.responseDomainService.update(this.selectedResponseDomain).subscribe(result => {
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
    let domainType = DomainTypeDescription.find(e=>e.id === this.domainType).name;
    this.responseDomainService
      .getAll(domainType, this.searchKeys, page).subscribe(
      result => { this.page = result.page;
        this.responseDomains = result.content;
        this.buildAnchorLabel();
      });
  }

  searchResponseDomains(name: string) {
    this.searchKeys = name;
    let domainType = DomainTypeDescription.find(e=>e.id === this.domainType).name;
    this.responseDomainService
      .getAll(domainType, name).subscribe(result => {
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
