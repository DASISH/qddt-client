import { Component, OnInit } from '@angular/core';

import { CategoryService, Category } from './category.service';

@Component({
  selector: 'category',
  moduleId: module.id,
  templateUrl: './category.component.html',
  providers: [CategoryService]
})
export class CategoryComponent implements OnInit {

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
    this.columns = [{ 'label': 'Label', 'name': 'label', 'sortable': true, 'direction': '' },
      { 'label': 'Description', 'name': 'description', 'sortable': true, 'direction': '' }];
  }

  ngOnInit() {
    this.categoryService.getByCategoryKind('CATEGORY', '0').subscribe(
      (result: any) => { this.page = result.page; this.categories = result.content; });
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
    this.categoryService.getAllByLevelAndPage('ENTITY', this.searchKeys, page, this.getSort()).subscribe(
      (result: any) => { this.page = result.page; this.categories = result.content; });
  }

  onCreateCategory() {
    this.showCategoryForm = false;
    this.categoryService.save(this.category)
      .subscribe((result: any) => {
        this.categories.push(result);
      });
    this.isDetail = false;
  }

  searchCategories(name: string) {
    this.searchKeys = name;
    this.categoryService.getAllByLevel('ENTITY', name, this.getSort()).subscribe((result: any) => {
      this.page = result.page;
      this.categories = result.content;
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
