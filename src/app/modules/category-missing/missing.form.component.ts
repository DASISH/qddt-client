import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActionKind, Category, ElementKind, IElement, LANGUAGE_MAP, TemplateService, } from '../../lib';
import { hasChanges } from '../../lib/consts/functions';
import { style } from '@angular/animations';

@Component({
  selector: 'qddt-missing-form',
  templateUrl: './missing.form.component.html'
})

export class MissingFormComponent implements OnChanges {
  @Input() missing: Category;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<Category>();

  public missingIndex: number;

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly CATEGORY = ElementKind.CATEGORY;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly trackByIndex = (index: number, entity) => entity.id || index;


  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.MISSING_GROUP);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.missing)) {
      this.missing = new Category(changes.missing.currentValue)
    }
  }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // this.buildPreviewResponseDomain();
    }
  }

  public getSource(category: Category): IElement {
    return { element: (category) ? category : '*', elementKind: ElementKind.CATEGORY };
  }

  public numbers(value) {
    if (this.missing.children.length < value) {
      this.missing.children.push(new Category({ label: '' }));
    } else if (this.missing.children.length > value) {
      this.missing.children.pop();
    }
  }

  public onSelectCategory(item: IElement, idx) {
    const code = this.missing.children[idx].code;
    item.element.code = code;
    if (item.element.id === undefined) {
      this.onCreateCategory(item.element, idx);
    } else {
      this.anchorChanged(item.element, idx);
    }
  }
  anchorChanged(event, idx) {
    this.missing.children[idx] = event;
  }

  onCreateCategory(event, idx) {
    this.service.update(event).subscribe(
      (result) => {
        this.anchorChanged(result, idx);
      }
    );
  }

  public onSave() {
    this.service.update<Category>(this.missing).subscribe(
      (result) => {
        this.missing = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
