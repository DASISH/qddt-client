import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {ActionKind, ElementKind} from '../shared/classes/enums';
import { TemplateService } from '../template/template.service';
import { Category } from '../lookups/category/category.classes';
import { IPageSearch, IElement } from '../shared/classes/interfaces';
import { Page } from '../shared/classes/classes';


@Component({
  selector: 'qddt-missing-form',
  moduleId: module.id,
  templateUrl: './missing.form.component.html'
})

export class MissingFormComponent implements OnInit {

  @Input() missing: Category;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<Category>();

  public readonly formId = Math.round( Math.random() * 10000);
  public readonly MISSING = ElementKind.MISSING_GROUP;
  public readonly CATEGORY = ElementKind.CATEGORY;

  public missingList: Category[];
  public missingIndex: number;
  private pageSearch: IPageSearch;

  constructor(private missingService: TemplateService) { }

  ngOnInit() {
    // this is for searching categories  , keys: new Map<string, string>([['categoryKind', 'CATEGORY']]) */
    this.pageSearch = { kind: this.CATEGORY, page: new Page(), key: '*'};
    this.readonly = !this.missingService.can(ActionKind.Create, ElementKind.MISSING_GROUP);

  }


  onSelect(item: IElement) {
    if (this.missingIndex === this.missing.children.length) {
      this.missing.children.push(item.element);
    } else {
      this.missing.children[this.missingIndex] = item.element;
    }
    this.missingList = [];
  }

  onSearchMissing(key: string) {
    this.pageSearch.key = key;
    this.missingService.searchByKind<Category>(this.pageSearch).then(
      (result) => {this.missingList = result.content; }
    );
  }

  onSave() {
    this.missingService.update(this.missing).subscribe(
      (result) => {
        this.missing = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
