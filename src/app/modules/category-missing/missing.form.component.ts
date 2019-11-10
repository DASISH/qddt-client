import {Component, Input, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {ActionKind, Category, ElementKind, IElement, IPageSearch, Page, TemplateService} from '../../lib';



@Component({
  selector: 'qddt-missing-form',
  templateUrl: './missing.form.component.html'
})

export class MissingFormComponent implements OnInit, AfterViewInit {
  @Input()
  set missing(value: Category) {
    this._missing = new Category(value);
  }
  get missing(): Category {
    return this._missing;
  }
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<Category>();

  public readonly formId = Math.round( Math.random() * 10000);
  public readonly CATEGORY = ElementKind.CATEGORY;

  public missingList: Category[];
  public missingIndex: number;
  private pageSearch: IPageSearch;
  private _missing: Category;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.MISSING_GROUP);
  }

  ngOnInit() {
    this.pageSearch = { kind: this.CATEGORY, page: new Page(), key: ''};
  }

  public ngAfterViewInit(): void {
    M.updateTextFields();
  }

  public onSelect(item: IElement) {
    if (this.missingIndex === this.missing.children.length) {
      this.missing.children.push(item.element);
    } else {
      this.missing.children[this.missingIndex] = item.element;
    }
    this.missingList = [];
  }

  public onSearchMissing(key: string) {
    this.pageSearch.key = key;
    this.service.searchByKind<Category>(this.pageSearch).then(
      (result) => {this.missingList = result.content; }
    );
  }

  public onSave() {
    this.service.update<Category>(this._missing).subscribe(
      (result) => {
        this.missing = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
