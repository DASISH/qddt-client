import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Category, CATEGORY_INFO, ICategoryInfo, HierachyLevel } from './category.classes';
import { ActionKind, ElementKind} from '../shared/classes/enums';
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
    this.readonly = !this.categoryService.can(ActionKind.Create, ElementKind.CATEGORY);
    this.isTemplate = this.category.hierarchyLevel === 'GROUP_ENTITY';
    this.categoryEnums = CATEGORY_INFO.filter( (e) => e.level ===  HierachyLevel[this.category.hierarchyLevel]);
  }


  select(candidate: any) {
    this.category.children[this.selectedCategoryIndex] = candidate;
  }

  onSave() {
    this.categoryService.update(this.category).subscribe(
      (result) => {
        this.category = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
