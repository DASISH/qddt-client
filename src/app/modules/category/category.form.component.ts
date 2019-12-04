import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Category, ElementKind, TemplateService, ActionKind, enumLANGUAGES } from 'src/app/lib';
import { LanguageKind } from 'src/app/lib/enums/language-kind';


@Component({
  selector: 'qddt-category-form',
  templateUrl: './category.form.component.html'
})

export class CategoryFormComponent implements AfterViewInit {
  @Input() category: Category;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<Category>();

  public readonly LANGUAGES = LanguageKind;
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
