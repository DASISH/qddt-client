
import {filter, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Subject } from 'rxjs';
import { MaterializeAction } from 'angular2-materialize';
import { ElementRevisionRef, Page } from '../../shared/classes/classes';
import { ElementKind } from '../../shared/classes/enums';
import { IPageSearch, IElement } from '../../shared/classes/interfaces';
import { TemplateService } from '../../template/template.service';
import { ResponseDomain, makeMixed } from '../../responsedomain/responsedomain.classes';
import { Category } from '../../category/category.classes';


@Component({
  selector: 'qddt-responsedomain-select-missing',
  moduleId: module.id,
  styles: [ '.minHeight { min-height: 400px; height: auto; }',
  ],
  templateUrl: 'responsedomain.select-missing.component.html',
})

export class ResponsedomainSelectMissingComponent implements OnInit, OnChanges {
  @Input() responseDomain: ResponseDomain;
  @Input() modalId =  Math.round( Math.random() * 10000);
  @Input() readonly = false;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() removeEvent = new EventEmitter<any>();

  public readonly CATEGORY_KIND = ElementKind.MISSING_GROUP;
  public findMissingAction = new EventEmitter<MaterializeAction>();
  public showbutton: any;
  public missingGroups: Category[];
  public selectedCategoryIndex: number;
  public missingRd: ResponseDomain;

  private _rd: ResponseDomain;
  private searchKeysListener = new Subject<string>();
  private pageSearch: IPageSearch;

  /* keys: new Map([['categoryKind', 'MISSING_GROUP']]), */

  constructor(private service: TemplateService) {
    this.pageSearch = { kind: this.CATEGORY_KIND, key: '*',
                        page: new Page(), sort: 'name,asc' };
    this.selectedCategoryIndex = 0;
    this.missingGroups = [];
    this.searchKeysListener.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(val => val.length > 0),)
      .subscribe((name: string) => {
        this.pageSearch.key = name;
        this.service.searchByKind<Category>(this.pageSearch).then(
          (result) => { this.missingGroups = result.content; });
      });
  }

  ngOnInit() {
    if (!this.readonly) { this.readonly = false; }
  }

  onSearchCategories(name: string) {
    this.searchKeysListener.next(name);
  }

  onAddMissing() {
    this.searchKeysListener.next('*');
    this.findMissingAction.emit({action: 'modal', params: ['open']});
  }

  onDismiss() {
    this._rd = new ResponseDomain(this.responseDomain);
    this.missingRd = null;
    return false; // funker  dette da?
  }

  onSave() {
    this.findMissingAction.emit({action: 'modal', params: ['close']});
    if (this._rd.getMissing()) {
      if (this._rd.changeKind) {
        this._rd.changeKind = 'TYPO';
        this._rd.changeComment = 'Comment by rule';    // but why this rule?
        console.log('changeKind set, ready for persisting');
      }
      console.log(this._rd.getMissing());
      this.selectedEvent.emit(
        { elementRevision: 0, element: this._rd, elementKind: ElementKind.RESPONSEDOMAIN, elementId: this._rd.id  } );
    }
  }

  public getMissing(): Category {
    return this._rd.getMissing();
  }

  public setMissing(missing: IElement) {
    console.log('add missing ' + missing.element);
    let rd = this._rd;

    if (!rd.isMixed()) {
      rd = makeMixed(rd);
    }
    rd.addManagedRep(missing.element);

    rd.name = rd.managedRepresentation.name =
      'Mixed [' + this.getGroupEntities(rd.managedRepresentation)[0].name + '+' + missing.element.name + ']';
    this.missingRd = this._rd = rd;
  }


  private getGroupEntities(representation: Category): Category[] {
    if (representation.categoryType === 'MIXED') {
      return representation.children;
    } else {
      return [representation];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['responseDomain']) {
      this._rd = new ResponseDomain(this.responseDomain);
    }
  }

}
