import {Component} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';
import {LocalDatePipe} from '../../common/date_pipe';
import {CommentListComponent} from '../comment/comment_list.component';
import {DomainType, DomainTypeDescription} from './responsedomain.constant';
import {ResponseDomainService} from './responsedomain.service';
import {ResponsedomainFormComponent} from './responsedomain.form.component';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {ResponsedomainListComponent} from './responsedomain.list.component';
import {PreviewComponent} from './responsedomain.preview.component';

@Component({
  selector: 'responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  styles: [],
  pipes: [LocalDatePipe],
  providers: [ResponseDomainService],
  directives: [CommentListComponent,
    ResponsedomainFormComponent,
    AutocompleteComponent, ResponsedomainListComponent, PreviewComponent]
})

export class ResponsedomainComponent {
  domainType: DomainType;
  public domainTypeDef = DomainType;
  private responseDomains: any;
  private responseDomain: ResponseDomain;
  private showResponseDomainForm: boolean;
  private isVisible: boolean;
  private domainTypeDescription: any[];

  constructor(private responseDomainService: ResponseDomainService) {
    this.responseDomain = new ResponseDomain();
    this.responseDomains = null;
    this.isVisible = false;
    this.domainType = DomainType.SCALE;
    this.domainTypeDescription = DomainTypeDescription;
    this.showResponseDomainForm = false;
  }

  ngOnInit() {
    let name = DomainTypeDescription.find(e=>e.id === this.domainType).name;
    this.responseDomainService.getAll(name).subscribe(result => {
      this.responseDomains = result.content;});
  }

  selectDomainType(id: DomainType) {
    this.domainType = id;
    this.responseDomain = new ResponseDomain();
    this.isVisible = false;
    this.responseDomain.responseKind = DomainTypeDescription.find(e=>e.id === id).name;
    this.responseDomainService.getAll(this.responseDomain.responseKind).subscribe(result => {
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
    this.isVisible = !this.isVisible;
    if(this.isVisible) {
      this.responseDomain = new ResponseDomain();
      let name = DomainTypeDescription.find(e=>e.id === this.domainType).name;
      this.responseDomain.responseKind = name;
    }
  }

}
