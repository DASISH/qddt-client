import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PropertyStoreService } from '../core/global/property.service';
import { Page } from '../shared/classes/classes';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';
import { ElementKind } from '../shared/classes/enums';
import { Category, ResponseCardinality } from './category.classes';
import { CategoryService } from './category.service';

declare let Materialize: any;

@Component({
  selector: 'qddt-category-scheme',
  moduleId: module.id,
  templateUrl: './category.scheme.component.html',
})

export class CategorySchemeComponent implements OnInit {
  @Output() selectedEvent =  new EventEmitter<any>();

  public readonly CATEGORY_KIND = QDDT_QUERY_INFOES[ElementKind.CATEGORY];
  public readonly CATEGORY = ElementKind.CATEGORY;

  public deleteAction = new EventEmitter<any>();
  public showCategoryForm = false;
  public isDetail = false;
  public revisionIsVisible = false;

  public selectedCategoryIndex: number;
  public selectedCategory: Category;
  public category: Category;

  public page = new Page();
  public missingCategories: any[];
  public categories: any[];

  private searchKeys: string;
  private searchKeysListener: Subject<string> = new Subject<string>();

  constructor(private categoryService: CategoryService, private property: PropertyStoreService) {
    this.categories = [];
    this.missingCategories = [];
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => this.loadPage(name));
  }

  public onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
    if (this.showCategoryForm) {
      this.category = new Category();
      this.category.categoryType = 'MISSING_GROUP';
      Materialize.updateTextFields();
    }
  }

  public onHideDetail() {
    const config = this.property.get('schemes');
    this.property.set('schemes', {'current': 'list'});
    this.searchKeys = config.key;
    this.isDetail = false;
    this.onPage(config.page);
  }

  public onDeleteMissingModal() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  public onConfirmDeleting() {
    this.categoryService.deleteCategory(this.selectedCategory.id).subscribe(
      (result) => {
        const i = this.missingCategories.findIndex(q => q['id'] === this.selectedCategory.id);
        if (i >= 0) { this.missingCategories.splice(i, 1); } },

      (error) => { throw error; },

      () => { this.onHideDetail(); }
    );
  }

  public onSetCategoryNumber(event: any) {
    let c: any = this.category;
    if (this.isDetail) {
      c = this.selectedCategory;
    }
    if (c.inputLimit === undefined) {
      c.inputLimit = new ResponseCardinality();
    }
    c.inputLimit.maximum = event.target.value;
    if (c.children === undefined) {
      c.children = [];
    }
    c.children = c.children.slice(0, parseInt(c.inputLimit.maximum));
    for (let i = c.children.length; i < parseInt(c.inputLimit.maximum); i++) {
        c.children.push(new Category());
    }
  }

  public onSelect(candidate: any) {
    if (this.isDetail) {
      this.selectedCategory.children[this.selectedCategoryIndex] = candidate;
    } else {
      this.category.children[this.selectedCategoryIndex] = candidate;
    }
  }

  public onSave() {
    this.showCategoryForm = false;
    if (this.isDetail) {
      this.categoryService.edit(this.selectedCategory)
        .subscribe((result) => {
          const id = this.missingCategories.findIndex((e: any) => e.id === result.id);
          if (id >= 0) {
            this.missingCategories[id] = result;
          } else {
            this.missingCategories.push(result);
          }
          this.onHideDetail();
        });
    } else {
      this.categoryService.save(this.category)
        .subscribe((result) => {
          this.missingCategories = [result].concat(this.missingCategories);
          this.category = new Category();
          this.category.categoryType = 'MISSING_GROUP';
        });
    }
  }

  public onSearchCategories(name: string) {
    this.categoryService.getAllByLevelAndPage('ENTITY', name, this.page)
    .then((result: any) => {
      this.categories = result.content;
    });
  }

  public ngOnInit(): void {
    const config = this.property.get('schemes');
    if (config.current === 'detail' ) {
      this.selectedCategory = config.item;
      this.isDetail = true;
    } else {
      this.page = (config.page) ? config.page : new Page();
      this.onSearchKey(config.key);
    }
    this.onSearchCategories('');
  }

  public onPage(page: Page) {
    this.page = page;
    this.loadPage(this.searchKeys);
  }

  public onSearchKey(search: string ) {
    this.searchKeys = (search) ? search : '*';
    this.searchKeysListener.next(search);
  }

  public onDetail(item: Category ) {
    // this.router.navigate(['./', item.id ], { relativeTo: this.route });
    this.selectedCategory = item;
    this.isDetail = true;
    this.property.set('schemes',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': item});

    Materialize.updateTextFields();
  }

  private loadPage(name: string) {
    this.categoryService.getAllTemplatesByCategoryKind('MISSING_GROUP', name, this.page)
    .then((result: any) => {
      this.page = new Page(result.page);
      this.missingCategories = result.content;
    });
  }
}
