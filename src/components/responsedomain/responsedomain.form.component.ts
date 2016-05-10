import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {Change} from '../../common/change_status';
import {CategoryService, Category} from '../category/category.service';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {DomainType} from './responsedomain.constant';

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
  @Input() domainType: string;
  @Output() formChange: EventEmitter<any>;
  public domainTypeDef = DomainType;
  private _ChangeEnums: any;
  private numberOfCategories: number;
  private categories: Category[];
  private selectedCategoryIndex: number;
  private suggestions:  Category[];

  constructor(private categoryService:CategoryService) {
    this._ChangeEnums = Change.status;
    this.categories = [];
    this.selectedCategoryIndex = 0;
    this.formChange =  new EventEmitter();
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe(result => this.suggestions = result.content);
  }

  setCategoryNumber(event:any) {
    this.numberOfCategories = event.target.value;
    this.categories= this.categories.slice(0, this.numberOfCategories);
    for(let i = this.categories.length; i < this.numberOfCategories; i++) {
        this.categories.push(new Category());
    }
  }

  select(candidate: any) {
    this.categories[this.selectedCategoryIndex] = candidate;
  }

  save() {
    this.formChange.emit('change');
  }

}
