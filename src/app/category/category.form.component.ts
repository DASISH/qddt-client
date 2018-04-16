import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Category, CATEGORY_INFO, ICategoryInfo, CategoryKind, HierachyLevel } from './category.classes';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';
import { ElementKind } from '../shared/classes/enums';
import { TemplateService } from '../template/template.service';


@Component({
  selector: 'qddt-category-form',
  moduleId: module.id,
  templateUrl: './category.form.component.html'
})

export class CategoryFormComponent implements OnInit {

  @Input() category: Category;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public readonly CATEGORY = ElementKind.CATEGORY;

  public isTemplate: boolean;

  public categoryEnums: ICategoryInfo[];
  private selectedCategoryIndex: number;
  private numberOfCategories: number;

  constructor(private categoryService: TemplateService) {
    this.selectedCategoryIndex = 0;
    this.numberOfCategories = 0;
  }

  ngOnInit() {
    if (!this.category) {
      this.category = new Category();
    }

    this.isTemplate = this.category.hierarchyLevel === 'GROUP_ENTITY';
    this.categoryEnums = CATEGORY_INFO.filter( (e) => e.level ===  HierachyLevel[this.category.hierarchyLevel]);
  }

  setCategoryNumber(event: any) {
    this.numberOfCategories = event.target.value;
    if (this.category.children === undefined) {
      this.category.children = [];
    }
    this.category.children = this.category.children.slice(0, this.numberOfCategories);
    for (let i = this.category.children.length; i < this.numberOfCategories; i++) {
        this.category.children.push(new Category());
    }
  }

  select(candidate: any) {
    this.category.children[this.selectedCategoryIndex] = candidate;
  }

  onSave() {
    this.categoryService.update(this.category).subscribe(
      (result) => { this.category = result; },
      (error) => {
        if (error.status === 409) {
          this.categoryService.getItemByKind<Category>(this.CATEGORY, error.error.id).then(
            (updated) => {  this.category = updated; });
        }
        throw error;
      });
  }

}
