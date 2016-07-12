import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {Change} from '../../common/change_status';
import {CategoryService, Category, ResponseCardinality} from '../category/category.service';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {DomainType, DomainTypeDescription} from './responsedomain.constant';
import {PreviewComponent} from './responsedomain.preview.component';

@Component({
  selector: 'responsedomain-form',
  moduleId: module.id,
  templateUrl: './responsedomain.form.component.html',
  styles: [],
  pipes: [],
  providers: [CategoryService],
  directives: [MaterializeDirective, AutocompleteComponent, PreviewComponent]
})

export class ResponsedomainFormComponent {
  @Input() responsedomain: any;
  @Input() domainType: DomainType;
  @Output() formChange: EventEmitter<any>;

  public domainTypeDef = DomainType;
  private categories: any;
  private _ChangeEnums: any;
  private codes: string[];
  private selectedCategoryIndex: number;
  private suggestions: Category[];
  private numberOfAnchors: number;

  constructor(private categoryService: CategoryService) {
    this._ChangeEnums = Change.status;
    this.codes = [];
    this.selectedCategoryIndex = 0;
    this.formChange = new EventEmitter();
    this.numberOfAnchors = 0;
  }

  ngOnInit() {
    if (this.responsedomain.managedRepresentation === undefined) {
      this.responsedomain.managedRepresentation = new Category();
    }
    if (this.responsedomain.managedRepresentation.inputLimit === undefined) {
      this.responsedomain.managedRepresentation.inputLimit = new ResponseCardinality();
      this.responsedomain.managedRepresentation.inputLimit = { 'minimum': 1, 'maximum': 1 };
    }
    if (this.responsedomain.managedRepresentation.children === undefined) {
      this.responsedomain.managedRepresentation.children = [];
    }
    if (this.domainType === DomainType.SCALE) {
      this.responsedomain.managedRepresentation.categoryType = 'SCALE';
      this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;
    } else {
      this.responsedomain.managedRepresentation.categoryType = 'LIST';
      this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;
    }
    if (this.domainType === DomainType.SCALE || this.domainType === DomainType.LIST) {
      let categoryType = DomainTypeDescription.find(e=>e.id === this.domainType).categoryType;
      this.categoryService.getAllTemplatesByCategoryKind(categoryType)
        .subscribe(result => this.suggestions = result.content);
    } else {
      let categoryType = DomainTypeDescription.find(e=>e.id === this.domainType).categoryType;
      this.categoryService.getByCategoryKind(categoryType, '')
        .subscribe(result => this.suggestions = result.content);
    }
    this.categoryService.getAllByLevel('ENTITY').subscribe(result => {
      this.categories = result.content;
    });
  }

  select(candidate: any) {
    candidate.code = this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].code;
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex] = candidate;
  }

  save() {
    this.categoryService.save(this.responsedomain.managedRepresentation)
      .subscribe(result => {
        for(let i = 0; i < this.responsedomain.managedRepresentation.children.length; i++) {
          result.children[i].code = this.responsedomain.managedRepresentation.children[i].code;
        }
        this.responsedomain.managedRepresentation = result;
        this.formChange.emit(this.responsedomain);
      });
  }

  changeNumberOfCategories(num: number) {
    this.responsedomain.managedRepresentation.inputLimit.maximum  = num;
    this.changeNumberOfAnchors(num);
  }

  changeNumberOfAnchors(num: number) {
    let rep = this.responsedomain.managedRepresentation;
    if (rep.inputLimit.maximum < num) {
      this.numberOfAnchors = rep.inputLimit.maximum;
    } else {
      this.numberOfAnchors = num;
    }

    if (this.domainType === DomainType.SCALE || this.domainType === DomainType.LIST) {
      rep.children = rep.children.slice(0, num);
      for (let i = rep.children.length; i < num; i++) {
        let c = new Category();
        c.code = { codeValue: String(i + 1) };
        rep.children.push(c);
      }
    }
  }

}
