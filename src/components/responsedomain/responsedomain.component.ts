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
import {DomainType} from './responsedomain.constant';
import {ResponseDomainService} from './responsedomain.service';
import {ResponsedomainFormComponent} from './responsedomain.form.component';

@Component({
  selector: 'responsedomain',
  moduleId: module.id,
  templateUrl: './responsedomain.component.html',
  styles: [
    '.searchcard i.material-icons { position: absolute;top: 10px;right: 10px;cursor: pointer;}',
    '.autocomplete { width: 100%; position: relative;}',
    '.autocomplete input{width: 80%;}',
    `.autocomplete ul{ position: absolute; left: 0;
        width: 100%; border-left: 1px solid #888;
        border-right: 1px solid #888;
        border-bottom: 1px solid #888;
        margin-top: 2px;
        z-index: 100;}`,
     `.autocomplete li{
        text-align: left;
        list-style:none;
        width: 100%;
        padding:0.4em;
        background-color: #fff;}`,
      `.autocomplete li.active{ width: 100%;background-color: #4bf;}`,
      `.autocomplete .highlight { background-color: #E2E2E2;}`,
      `.autocomplete li.active .highlight { background: #666; color: #fff;}`,
  ],
  pipes: [LocalDatePipe],
  providers: [ResponseDomainService],
  directives: [CommentListComponent, ResponsedomainCodeListComponent,
    ResponsedomainNumericComponent,ResponsedomainScaleComponent,
    ResponsedomainDatetimeComponent,ResponsedomainTextComponent,
    ResponsedomainTextComponent, ResponsedomainFormComponent,
    ResponsedomainCategoryListComponent, ResponsedomainMissingComponent]
})

export class ResponsedomainComponent {
  domainType: DomainType;
  showAutoComplete: boolean;
  selectedIndex: any;
  suggestions: any[];
  DomainTypeDescription = [
    {id: DomainType.Scale, label:'Scale Domain', support: []},
    {id: DomainType.CodeList, label:'Code List',
      support: []},
    {id: DomainType.CategoryList, label:'Category List',
      support: []},
    {id: DomainType.Datetime, label: 'Datetime Domain', support: []},
    {id: DomainType.Numeric, label:'Numeric Domain', support: []},
    {id: DomainType.Text, label:'Text Domain', support: []},
    {id: DomainType.Missing, label:'Missing Value Domain', support: []}];

  allsuggestions:any[] = [{id: 'domain1', label:'domain test 1'},
                       {id: 'domain2', label:'yes or no test'},
                       {id: 'domain3', label:'begin and end 3'},];
  public domainTypeDef = DomainType;
  private responseDomains: any;
  private responseDomain: ResponseDomain;
  private showResponseDomainForm: boolean;
  private isVisible: boolean;
  private scaleDomainDemo: any;
  constructor(private responseDomainService: ResponseDomainService) {
    this.responseDomain = new ResponseDomain();
    this.responseDomains = null;
    this.selectedIndex = 0;
    this.showAutoComplete = false;
    this.suggestions = this.allsuggestions;
    this.isVisible = false;
    this.domainType = DomainType.Scale;
    this.scaleDomainDemo =  ['less than 1/2 hour', '1/2 hour to 1 hour',
                               '1/2 hour to 1 hour', 'more than 1 hour, up to 1 1/2 hour',
                               'more than 1 1/2 hour, up to 2 hour',
                               'more than 2 hour, up to 2 1/2 hour',
                               'more than 2 1/2 hour, up to 3 hour',
                               'more than 3 hours'
                               ];
  }

  ngAfterViewInit() {
    this.responseDomainService.getAll().subscribe(result => this.responseDomain = result);
  }

  enterText($event) {
    let search = $event.target.value;
    this.suggestions = this.allsuggestions.filter(
      function (suggestion) {
        return suggestion.label.indexOf(search) >= 0;
    });
  }

  select(suggestion: any) {
    this.showAutoComplete = false;
    console.log(suggestion);
  }

  onToggleResponseDomainForm() {
    this.showResponseDomainForm = !this.showResponseDomainForm;
  }
}
