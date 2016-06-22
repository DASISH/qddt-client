import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {Change} from '../../common/change_status';
import {CategoryService, Category} from '../category/category.service';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {DomainType, DomainTypeDescription} from './responsedomain.constant';

@Component({
  selector: 'responsedomain-form',
  moduleId: module.id,
  templateUrl: './responsedomain.form.component.html',
  styles: [],
  pipes: [],
  providers: [CategoryService],
  directives: [MaterializeDirective, AutocompleteComponent]
})

export class ResponsedomainFormComponent {
  @Input() responsedomain: any;
  @Input() domainType: DomainType;
  @Output() formChange: EventEmitter<any>;
  public domainTypeDef = DomainType;
  private _ChangeEnums: any;
  private codes: string[];
  private selectedCategoryIndex: number;
  private suggestions:  Category[];
  private start: number;
  private end: number;

  constructor(private categoryService:CategoryService) {
    this._ChangeEnums = Change.status;
    this.codes = [];
    this.selectedCategoryIndex = 0;
    this.formChange =  new EventEmitter();
    this.start = 1;
    this.end = 5;
  }

  ngOnInit() {
    if(this.domainType === DomainType.SCALE || this.domainType === DomainType.LIST) {
      this.categoryService.getAllTemplatesByCategoryKind(DomainTypeDescription[this.domainType - 1].categoryType)
        .subscribe(result => this.suggestions = result.content);
     } else {
       this.categoryService.getByCategoryKind(DomainTypeDescription[this.domainType - 1].categoryType, '')
        .subscribe(result => this.suggestions = result.content);
     }
  }

  select(candidate: any) {
    this.responsedomain.managedRepresentation = candidate;
    if(this.domainType === DomainType.SCALE || this.domainType === DomainType.LIST) {
      let index = 1;
      for(let category of this.responsedomain.managedRepresentation.children) {
        if(category.code === undefined || category.code === null) {
          category.code = {'codeValue' : index};
          index = index + 1;
        }
      }
      this.responsedomain.managedRepresentation.inputLimit = {'minimum': 1, 'maximum': 1};
    } if(this.domainType === DomainType.DATETIME) {
      this.responsedomain.managedRepresentation.inputLimit = {
        'minimum': '2016-01-01 11:11:11', 'maximum': '2016-01-01 22:22:22'};
    } else {
      this.responsedomain.managedRepresentation.inputLimit = {'minimum': 1, 'maximum': 2};
    }
  }

  save() {
    this.formChange.emit(this.responsedomain);
  }

}
