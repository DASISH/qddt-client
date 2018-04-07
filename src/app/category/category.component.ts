import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { CategoryService, Category } from './category.service';
import { Subject } from 'rxjs/Subject';
import { PropertyStoreService } from '../core/global/property.service';
import { Column } from '../shared/table/table.column';
import { Page } from '../shared/table/table.page';

@Component({
  selector: 'qddt-category',
  moduleId: module.id,
  templateUrl: './category.component.html',
})

export class CategoryComponent implements OnInit, AfterContentChecked {

  public isDetail: boolean;
  public showCategoryForm = false;
  public categories: any;
  public category: any;
  public selectedCategory: any;
  public page: Page;

  private searchKeys: string;
  private searchKeysSubject: Subject<string> = new Subject<string>();

  constructor(private categoryService: CategoryService, private property: PropertyStoreService) {
    this.isDetail = false;
    this.categories = [];
    this.searchKeys = '';
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.categoryService.getAllByLevel('ENTITY', name, this.page)
        .then((result: any) => {
          this.page = result.page;
          this.categories = result.content;
        });
      });
  }

  ngOnInit() {
    const config = this.property.get('categories');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.categories = config.collection;
      this.selectedCategory = config.item;
      this.isDetail = true;
    } else {
      this.categoryService.getByCategoryKind('CATEGORY', '*', this.page)
      .then((result: any) => {
         this.page = result.page;
         this.categories = result.content;
        });
    }
  }

  ngAfterContentChecked() {
    const config = this.property.get('categories');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.categories = config.collection;
      this.selectedCategory = config.item;
      this.searchKeys = config.key;
      this.isDetail = true;
    } else {
      this.isDetail = false;
      if (config.key === null || config.key === undefined) {
        this.property.set('categories', {'current': 'list', 'key': ''});
        this.searchKeys = '';
        this.searchKeysSubject.next('');
      }
    }
  }

  onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
    if (this.showCategoryForm) {
      this.category = new Category();
    }
  }

  onHideDetail() {
    this.isDetail = false;
    this.property.set('categories', {'current': 'list', 'key': this.searchKeys});
  }

  onCreateCategory() {
    this.showCategoryForm = false;
    this.categoryService.save(this.category)
      .subscribe((result: any) => {
        this.categories = [result].concat(this.categories);
      });
    this.isDetail = false;
  }

  onTableSearchCategories(name: string) {
    this.searchKeys = name;
    this.searchKeysSubject.next(name);
  }

  onTablePage(page: Page) {
    this.categoryService.getAllByLevelAndPage('ENTITY', this.searchKeys, page)
    .then((result: any) => {
      this.page = result.page;
      this.categories = result.content;
    });
  }

  onTableDetail(category: any) {
    this.selectedCategory = category;
    this.isDetail = true;
    this.property.set('categories',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': this.selectedCategory,
        'collection': this.categories});
  }
}
