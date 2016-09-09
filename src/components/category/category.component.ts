import {Component} from 'angular2/core';

import {CategoryService, Category} from './category.service';
import {QddtTableComponent} from '../table/table.component';
import {CategoryDetailComponent} from './category.detail.component';

@Component({
  selector: 'category',
  moduleId: module.id,
  templateUrl: './category.component.html',
  providers: [CategoryService],
  directives: [QddtTableComponent, CategoryDetailComponent]
})
export class CategoryComponent {

  showCategoryForm: boolean = false;

  private categories: any;
  private page: any;
  private category: any;
  private searchKeys: string;
  private selectedCategory: any;
  private isDetail: boolean;
  private columns: any[];

  constructor(private categoryService: CategoryService) {
    this.isDetail = false;
    this.categories = [];
    this.searchKeys = '';
    this.page = {};
    this.columns = [{ 'label': 'Label', 'name': 'label', 'sortable': true },
      { 'label': 'Description', 'name': 'description', 'sortable': true }];
  }

  ngOnInit() {
    this.categoryService.getByCategoryKind('CATEGORY', '0').subscribe(
      result => { this.page = result.page; this.categories = result.content; });
  }

  onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
    if (this.showCategoryForm) {
      this.category = new Category();
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
    this.categoryService.getAllByLevelAndPage('ENTITY', this.searchKeys, page).subscribe(
      result => { this.page = result.page; this.categories = result.content; });
  }

  onCreateCategory() {
    this.showCategoryForm = false;
    this.categoryService.save(this.category)
      .subscribe(result => {
        this.categories.push(result);
      });
    this.isDetail = false;
  }

  searchCategories(name: string) {
    this.searchKeys = name;
    this.categoryService.getAllByLevel('ENTITY', name).subscribe(result => {
      this.page = result.page;
      this.categories = result.content;
    });
  }
}
