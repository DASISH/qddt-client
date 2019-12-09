import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {Category, ElementKind, TemplateService, ActionKind,  LANGUAGE_MAP} from 'src/app/lib';


@Component({
  selector: 'qddt-category-form',
  templateUrl: './category.form.component.html'
})

export class CategoryFormComponent implements AfterViewInit {
  @Input() category: Category;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<Category>();

  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly CATEGORY = ElementKind.CATEGORY;
  public readonly formId = Math.round( Math.random() * 10000);

  constructor(private categoryService: TemplateService) {
    this.readonly = !this.categoryService.can(ActionKind.Create, ElementKind.CATEGORY);
    if (!this.category) {
      this.category = new Category();
    }
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  onSave() {
    this.categoryService.update<Category>(this.category).subscribe(
      (result) => {
        this.category = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
