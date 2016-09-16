import {Component, EventEmitter, Output} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {CategoryService, Category, ResponseCardinality} from './category.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {CategoryEditComponent} from './edit/category_edit.component';
import {RevisionComponent} from '../revision/revision.component';
import {CategoryType} from './category_kind';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {QddtTableComponent} from '../table/table.component';
import {Change} from '../../common/change_status';

@Component({
  selector: 'category-scheme',
  moduleId: module.id,
  templateUrl: './category.scheme.component.html',
  pipes: [LocalDatePipe],
  providers: [CategoryService],
  directives: [AutocompleteComponent, MaterializeDirective,
    QddtTableComponent, CommentListComponent,
    CategoryEditComponent, RevisionComponent]
})
export class CategorySchemeComponent {

  showCategoryForm: boolean = false;
  @Output() categorySelectedEvent: EventEmitter<any> = new EventEmitter();

  private categories: any[];
  private missingCategories: any;
  private category: Category;
  private categoryEnums: any;
  private selectedCategoryIndex: number;
  private isDetail: boolean;
  private page: any;
  private columns: any[];
  private selectedCategory: Category;
  private searchKeys: string;
  private changeEnums: any;

  constructor(private categoryService: CategoryService) {
    this.category = new Category();
    this.isDetail = false;
    this.page = {};
    this.changeEnums = Change.status;
    this.category.categoryType = 'MISSING_GROUP';
    this.categoryEnums =  CategoryType.group;
    this.selectedCategoryIndex = 0;
    this.categories = [];
    this.missingCategories = [];
    this.columns = [{'name':'name', 'label':'Name', 'sortable':true}
      ,{'name':'description', 'label':'Description', 'sortable':true}];
  }

  ngOnInit() {
    this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP').subscribe(result => {
      this.page = result.page;
      this.missingCategories = result.content;
    });
    this.categoryService.getAllByLevel('ENTITY').subscribe(result => {
      this.categories = result.content;
    });
  }

  onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
  }

  onSelectCategory(category: any) {
    this.categorySelectedEvent.emit(category);
  }

  setCategoryNumber(event:any) {
    let c: any = this.category;
    if (this.isDetail) {
      c = this.selectedCategory;
    }
    if (c.inputLimit === undefined)
      c.inputLimit = new ResponseCardinality();
    c.inputLimit.maximum = event.target.value;
    if (c.children === undefined) {
      c.children = [];
    }
    c.children = c.children.slice(0, parseInt(c.inputLimit.maximum));
    for(let i = c.children.length; i < parseInt(c.inputLimit.maximum); i++) {
        c.children.push(new Category());
    }
  }

  select(candidate: any) {
    if(this.isDetail) {
      this.selectedCategory.children[this.selectedCategoryIndex] = candidate;
    } else {
      this.category.children[this.selectedCategoryIndex] = candidate;
    }
  }

  onSave() {
    this.showCategoryForm = false;
    if (this.isDetail) {
      this.categoryService.edit(this.selectedCategory)
        .subscribe(result => {
          let id = this.missingCategories.findIndex(e => e.id === result.id);
          if (id !== undefined) {
            this.missingCategories[id] = result;
          }
          this.hideDetail();
          this.selectedCategory = null;
        });
    } else {
      this.categoryService.save(this.category)
        .subscribe(result => {
          this.missingCategories.push(result);
          this.category = new Category();
          this.category.categoryType = 'MISSING_GROUP';
        });
    }
  }

  onDetail(category: any) {
    this.selectedCategory = category;
    this.isDetail = true;
  }

  hideDetail() {
    this.isDetail = false;
  }

  onPage(page: string) {
    this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP', this.searchKeys, page)
      .subscribe(
        result => { this.page = result.page; this.missingCategories = result.content; }
      );
  }

  searchCategories(name: string) {
    this.categoryService.getAllByLevel('ENTITY', name).subscribe(result => {
      this.categories = result.content;
    });
  }

  searchMissingCategories(name: string) {
    this.searchKeys = name;
    this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP', name).subscribe(result => {
      this.page = result.page;
      this.missingCategories = result.content;
    });
  }

}
