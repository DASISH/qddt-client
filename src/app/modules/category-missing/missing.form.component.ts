import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActionKind, Category, ElementKind, IElement, LANGUAGE_MAP, TemplateService, } from '../../lib';

@Component({
  selector: 'qddt-missing-form',
  templateUrl: './missing.form.component.html'
})

export class MissingFormComponent implements OnChanges {
  @Input() missing: Category;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<Category>();

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly CATEGORY = ElementKind.CATEGORY;
  public readonly LANGUAGES = LANGUAGE_MAP;

  public missingIndex: number;



  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.MISSING_GROUP);
    // if (!this.missing) {
    //   this.missing = new Category();
    // }
  }


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.missing) {
      const element = document.getElementById('MISS' + this.formId);
      if (element) {

        const getData = async () => {
          return await M.updateTextFields();
        }

        getData().then(data => {
          console.log(data);
          M.updateTextFields();
        });
      }
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
