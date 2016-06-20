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
    this.categoryService.getAllTemplatesByCategoryKind(DomainTypeDescription[this.domainType - 1].categoryType)
        .subscribe(result => this.suggestions = result.content);
  }

  select(candidate: any) {
    this.responsedomain.managedRepresentation = candidate;
    let index = 1;
    for(let category of this.responsedomain.managedRepresentation.children) {
      if(category.code === undefined || category.code === null) {
        category.code = {'codeValue' : index};
        index = index + 1;
      }
    }
  }

  save() {
    this.formChange.emit('change');
  }

}
