import { Component, EventEmitter, Output, OnInit, AfterContentChecked } from '@angular/core';
import { CategoryService, Category, ResponseCardinality } from './category.service';
import { CategoryType } from './category_kind';
import { UserService } from '../../common/user.service';

@Component({
  selector: 'category-scheme',
  moduleId: module.id,
  templateUrl: './category.scheme.component.html',
  providers: [CategoryService],
})

export class CategorySchemeComponent implements OnInit, AfterContentChecked {

  showCategoryForm: boolean = false;
  @Output() categorySelectedEvent: EventEmitter<any> = new EventEmitter<any>();

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

  constructor(private categoryService: CategoryService, private userService: UserService) {
    this.category = new Category();
    this.isDetail = false;
    this.page = {};
    this.category.categoryType = 'MISSING_GROUP';
    this.categoryEnums =  CategoryType.group;
    this.selectedCategoryIndex = 0;
    this.categories = [];
    this.missingCategories = [];
    this.columns = [{'name':'name', 'label':'Name', 'sortable':true, 'direction': '' }
      ,{'name':'description', 'label':'Description', 'sortable':true, 'direction': '' }];
  }

  ngOnInit() {
    let config = this.userService.getGlobalObject('schemes');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.missingCategories = config.collection;
      this.selectedCategory = config.item;
      this.isDetail = true;
    } else {
      this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP').subscribe((result: any) => {
        this.page = result.page;
        this.missingCategories = result.content;
      });
    }
    this.categoryService.getAllByLevel('ENTITY').subscribe((result: any) => {
      this.categories = result.content;
    });
  }

  ngAfterContentChecked() {
    let config = this.userService.getGlobalObject('schemes');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.missingCategories = config.collection;
      this.selectedCategory = config.item;
      this.isDetail = true;
    } else {
      this.isDetail = false;
    }
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
        .subscribe((result: any) => {
          let id = this.missingCategories.findIndex((e: any) => e.id === result.id);
          if (id !== undefined) {
            this.missingCategories[id] = result;
          }
          this.hideDetail();
          this.selectedCategory = null;
        });
    } else {
      this.categoryService.save(this.category)
        .subscribe((result: any) => {
          this.missingCategories = [result].concat(this.missingCategories);
          this.category = new Category();
          this.category.categoryType = 'MISSING_GROUP';
        });
    }
  }

  onDetail(category: any) {
    this.selectedCategory = category;
    this.isDetail = true;
    this.userService.setGlobalObject('schemes',
      {'current': 'detail',
        'page': this.page,
        'item': this.selectedCategory,
        'collection': this.missingCategories});
  }

  hideDetail() {
    this.isDetail = false;
    this.userService.setGlobalObject('schemes', {'current': 'list'});
  }

  onPage(page: string) {
    this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP', this.searchKeys, page, this.getSort())
      .subscribe(
        (result: any) => { this.page = result.page; this.missingCategories = result.content; }
      );
  }

  searchCategories(name: string) {
    this.categoryService.getAllByLevel('ENTITY', name).subscribe((result: any) => {
      this.categories = result.content;
    });
  }

  searchMissingCategories(name: string) {
    this.searchKeys = name;
    this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP', name, '0', this.getSort()).subscribe((result: any) => {
      this.page = result.page;
      this.missingCategories = result.content;
    });
  }

  private getSort() {
    let i = this.columns.findIndex((e: any) => e.sortable && e.direction !== '');
    let sort = '';
    if (i >= 0) {
      if (typeof this.columns[i].name === 'string') {
        sort = this.columns[i].name + ',' + this.columns[i].direction;
      } else {
        sort = this.columns[i].name.join('.') + ',' + this.columns[i].direction;
      }
    }
    return sort;
  }

}
