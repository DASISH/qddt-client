import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';
import { ElementKind } from '../shared/classes/enums';
import { TemplateService } from '../template/template.service';
import { Category, ICategoryInfo, CATEGORY_INFO, HierachyLevel } from '../category/category.classes';
import { IPageSearch, IElement } from '../shared/classes/interfaces';
import { ElementRevisionRef, Page } from '../shared/classes/classes';


@Component({
  selector: 'qddt-missing-form',
  moduleId: module.id,
  templateUrl: './missing.form.component.html'
})

export class MissingFormComponent implements OnInit {

  @Input() missing: Category;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public readonly formId = Math.round( Math.random() * 10000);
  public readonly MISSING = ElementKind.CATEGORY;
  public missingList: Category[];
  public missingIndex: number;
  private pageSearch: IPageSearch;

  constructor(private missingService: TemplateService) { }

  ngOnInit() {
    this.pageSearch = { kind: this.MISSING, page: new Page(), key: '*' };
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
      (result) => { this.missing = result; },
      (error) => {
        if (error.status === 409) {
          this.missingService.getItemByKind<Category>(this.MISSING, error.error.id).then(
            (updated) => {  this.missing = updated; });
        }
        throw error;
      });
  }

}
