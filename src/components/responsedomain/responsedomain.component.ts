import {Component} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';
import {LocalDatePipe} from '../../common/date_pipe';
import {CommentListComponent} from '../comment/comment_list.component';
import {ResponsedomainNumericComponent} from './responsedomain.numeric.component';
import {ResponsedomainTextComponent} from './responsedomain.text.component';
import {ResponsedomainScaleComponent} from './responsedomain.scale.component';
import {ResponsedomainDatetimeComponent} from './responsedomain.datetime.component';
import {ResponsedomainCodeListComponent} from './responsedomain.codelist.component';
import {ResponsedomainCategoryListComponent} from './responsedomain.categorylist.component';
import {ResponsedomainMissingComponent} from './responsedomain.missing.component';
import {DomainType, DomainTypeDescription} from './responsedomain.constant';
import {ResponseDomainService} from './responsedomain.service';
import {ResponsedomainFormComponent} from './responsedomain.form.component';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';

@Component({
  selector: 'responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  styles: [],
  pipes: [LocalDatePipe],
  providers: [ResponseDomainService],
  directives: [CommentListComponent, ResponsedomainCodeListComponent,
    ResponsedomainNumericComponent,ResponsedomainScaleComponent,
    ResponsedomainDatetimeComponent,ResponsedomainTextComponent,
    ResponsedomainTextComponent, ResponsedomainFormComponent,
    ResponsedomainCategoryListComponent, ResponsedomainMissingComponent,
    AutocompleteComponent]
})

export class ResponsedomainComponent {
  domainType: DomainType;
  public domainTypeDef = DomainType;
  private responseDomains: any;
  private responseDomain: ResponseDomain;
  private showResponseDomainForm: boolean;
  private isVisible: boolean;
  private scaleDomainDemo: any;
  private domainTypeDescription: any[];


  constructor(private responseDomainService: ResponseDomainService) {
    this.responseDomain = new ResponseDomain();
    this.responseDomains = null;
    this.isVisible = false;
    this.domainType = DomainType.SCALE;
    this.domainTypeDescription = DomainTypeDescription;
    this.scaleDomainDemo =  ['less than 1/2 hour',
                              '1/2 hour to 1 hour',
                              '1/2 hour to 1 hour',
                              'more than 1 hour, up to 1 1/2 hour',
                              'more than 1 1/2 hour, up to 2 hour',
                              'more than 2 hour, up to 2 1/2 hour',
                              'more than 2 1/2 hour, up to 3 hour',
                              'more than 3 hours'
                            ];
  }

  ngOnInit() {
    this.responseDomainService.getAll(DomainTypeDescription[this.domainType - 1].name).subscribe(result => {
      this.responseDomains = result.content;});
  }

  selectDomainType(id: DomainType) {
      this.domainType = id;
      this.responseDomain = new ResponseDomain();
      this.isVisible = false;
      this.responseDomain.responseKind = DomainTypeDescription[id - 1].name;
      this.responseDomainService.getAll(DomainTypeDescription[this.domainType - 1].name).subscribe(result => {
      this.responseDomains = result.content;});
  }

  select(suggestion: any) {
    this.responseDomain = suggestion;
  }

  onToggleResponseDomainForm() {
    this.showResponseDomainForm = !this.showResponseDomainForm;
  }

  formChange() {
    this.isVisible = false;
    if(this.responseDomain.id !== undefined && this.responseDomain.id !== '') {
      this.responseDomainService.update(this.responseDomain).subscribe(result => {
      this.responseDomain = result;});
      return;
    }
    this.responseDomainService.create(this.responseDomain).subscribe(result => {
      this.responseDomain = result;
      this.responseDomains.push(this.responseDomain);});
  }

  createResponseDomain() {
    this.isVisible = true;
    this.responseDomain = new ResponseDomain();
    this.responseDomain.responseKind = DomainTypeDescription[this.domainType - 1].name;
  }

}
