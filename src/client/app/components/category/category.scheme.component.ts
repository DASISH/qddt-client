import { Component, EventEmitter, Output, OnInit, AfterContentChecked } from '@angular/core';
import { CategoryService, Category, ResponseCardinality } from './category.service';
import { CategoryType } from './category_kind';
import { UserService } from '../../shared/user/user.service';
import { Subject } from 'rxjs/Subject';
import { ElementKind, QddtElementType,QddtElementTypes } from '../../shared/preview/preview.service';

@Component({
  selector: 'category-scheme',
  moduleId: module.id,
  templateUrl: './category.scheme.component.html',
  providers: [CategoryService],
})

export class CategorySchemeComponent implements OnInit, AfterContentChecked {

  @Output() categorySelectedEvent: EventEmitter<any> = new EventEmitter<any>();

  public deleteAction = new EventEmitter<any>();
  public showCategoryForm: boolean = false;
  public selectedCategoryIndex: number;
  public categories: any[];
  private missingCategories: any[];
  private category: Category;
  private categoryEnums: any;
  private isDetail: boolean;
  private page: any;
  private columns: any[];
  private selectedCategory: Category;
  private searchKeys: string;
  private savedObject: string;
  private savedCategoriesIndex: number;
  private searchKeysSubect: Subject<string> = new Subject<string>();
  private revisionIsVisible: boolean = false;
  private readonly  CATEGORY_KIND :QddtElementType= QddtElementTypes[ElementKind.CATEGORY];

  constructor(private categoryService: CategoryService, private userService: UserService) {
    this.category = new Category();
    this.isDetail = false;
    this.page = {};
    this.category.categoryType = 'MISSING_GROUP';
    this.categoryEnums =  CategoryType.group;
    this.selectedCategoryIndex = 0;
    this.categories = [];
    this.missingCategories = [];
    this.columns = [{'name':'name', 'label':'Name', 'sortable':true, 'direction': '' },
      {'name':'description', 'label':'Description', 'sortable':true, 'direction': '' },
      { 'label': 'Modified', 'name': 'modified', 'sortable': true, 'direction': 'desc' }];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP', name, '0', this.getSort()).subscribe((result: any) => {
          this.page = result.page;
          this.missingCategories = result.content;
        });
      });
  }

  ngOnInit() {
    let config = this.userService.getGlobalObject('schemes');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.missingCategories = config.collection;
      this.selectedCategory = config.item;
      this.searchKeys = config.key;
      this.isDetail = true;
    } else {
      this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP', '', '0', this.getSort()).subscribe((result: any) => {
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
      this.searchKeys = config.key;
      this.isDetail = true;
    } else {
      this.isDetail = false;
      if(config.key === null || config.key === undefined) {
        this.userService.setGlobalObject('schemes', {'current': 'list', 'key': ''});
        this.searchKeys = '';
        this.searchKeysSubect.next('');
      }
    }
  }

  onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
  }

  onSelectCategory(category: any) {
    this.categorySelectedEvent.emit(category);
  }

  onDeleteMissingModal() {
    this.deleteAction.emit({action:'modal', params:['open']});
  }

  onConfirmDeleting() {
    this.categoryService.deleteCategory(this.selectedCategory.id)
      .subscribe((result: Response) => {
        if(result.status === 200) {
          let i = this.missingCategories.findIndex(q => q['id'] === this.selectedCategory.id);
          if (i >= 0) {
            this.missingCategories.splice(i, 1);
            this.hideDetail();
          }
        }
      },
      (error: any) => console.log(error));
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
          if (id >= 0) {
            this.missingCategories[id] = result;
          } else {
            if (this.savedCategoriesIndex >= 0) {
              this.missingCategories[this.savedCategoriesIndex] = JSON.parse(this.savedObject);
            }
            this.missingCategories.push(result);
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
    // this.selectedCategory['workinprogress'] = this.selectedCategory['changeKind'] === 'IN_DEVELOPMENT';
    this.savedObject = JSON.stringify(category);
    this.savedCategoriesIndex = this.missingCategories
      .findIndex(q => q['id'] === category['id']);
    this.isDetail = true;
    this.userService.setGlobalObject('schemes',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': this.selectedCategory,
        'collection': this.missingCategories});
  }

  hideDetail() {
    this.isDetail = false;
    this.userService.setGlobalObject('schemes', {'current': 'list', 'key': this.searchKeys});
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
    this.searchKeysSubect.next(name);
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
