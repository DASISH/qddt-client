import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {ActionKind, ElementKind, IElement, IPageSearch, Page} from '../../classes';
import {Category} from '../category/category.classes';
import {TemplateService} from '../../components/template';



@Component({
  selector: 'qddt-missing-form',
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
    this.pageSearch = { kind: this.CATEGORY, page: new Page(), key: ''};
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
