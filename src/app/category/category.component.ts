import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { Subject } from 'rxjs/Subject';
import { PropertyStoreService } from '../core/global/property.service';
import { Page } from '../shared/classes/classes';
import { ElementKind } from '../shared/classes/enums';
import { Category } from './category.classes';

@Component({
  selector: 'qddt-category',
  moduleId: module.id,
  templateUrl: './category.component.html',
})

export class CategoryComponent implements OnInit {

  public isDetail = false;
  public showCategoryForm = false;
  public categories = [];
  public category: any;
  public selectedCategory: any;
  public page: Page;

  private kind = ElementKind.CATEGORY;
  private searchKeys = '*';
  private searchKeysListener: Subject<string> = new Subject<string>();

  constructor(private categoryService: CategoryService, private property: PropertyStoreService) {
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => this.loadPage(name));
  }


  onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
    if (this.showCategoryForm) {
      this.category = new Category();
    }
  }

  onHideDetail() {
    this.isDetail = false;
    const config = this.property.get('categories');
    this.property.set('categories', {'current': 'list'});
    this.searchKeys = config.key;
    this.onPage(config.page);
  }

  public onDetail(item: Category ) {
    // this.router.navigate(['./', item.id ], { relativeTo: this.route });
    this.selectedCategory = item;
    this.isDetail = true;
    this.property.set('categories',
      {'current': 'detail', 'page': this.page, 'key': this.searchKeys, 'item': item});
  }

  onCreateCategory() {
    this.showCategoryForm = false;
    this.categoryService.save(this.category).subscribe(
      (result) => { this.categories = [result].concat(this.categories); },
      (error) => { throw error; });
    this.isDetail = false;
  }

  public ngOnInit(): void {
    const config = this.property.get('categories');
    if (config.current === 'detail' ) {
      this.selectedCategory = config.item;
      this.isDetail = true;
    } else {
      this.page = (config.page) ? config.page : new Page();
      this.onSearchKey(config.key);
    }
  }

  public onPage(page: Page) {
    this.page = page;
    this.loadPage(this.searchKeys);
  }

  public onSearchKey(search: string ) {
    this.searchKeys = (search) ? search : '*';
    this.searchKeysListener.next(search);
  }


  private loadPage(name: string) {
    this.categoryService.getByCategoryKind('CATEGORY', name, this.page)
    .then((result: any) => {
      this.page = new Page(result.page);
      this.categories = result.content;
    });
  }
}
