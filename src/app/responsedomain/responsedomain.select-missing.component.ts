import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { ElementRevisionRef, Page} from '../shared/classes/classes';
import { ElementKind } from '../shared/classes/enums';
import { Category } from '../category/category.classes';
import { IElement, IPageSearch } from '../shared/classes/interfaces';
import { makeMixed, ResponseDomain} from './responsedomain.classes';
import { TemplateService } from '../template/template.service';

@Component({
  selector: 'qddt-responsedomain-select-missing',
  moduleId: module.id,
  styles: [ '.minHeight { min-height: 400px; height: auto; }',
  ],
  templateUrl: 'responsedomain.select-missing.component.html',
})

export class ResponsedomainSelectMissingComponent implements OnInit, OnChanges {
  @Input() responseDomain: ResponseDomain;
  @Input() modalId: any = 'RSMC-1';
  @Input() readonly = false;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() removeEvent = new EventEmitter<any>();

  public readonly CATEGORY_KIND = ElementKind.CATEGORY;
  public findMissingAction = new EventEmitter<MaterializeAction>();
  public showbutton: any;
  public missingGroups: Category[];
  public selectedCategoryIndex: number;

  private searchKeysListener = new Subject<string>();
  private _rd: ResponseDomain;
  private pageSearch: IPageSearch;

  constructor(private service: TemplateService) {
    this.pageSearch = { kind: this.CATEGORY_KIND, key: '*',
                        keys: new Map([['categoryKind', 'MISSING_GROUP']]),
                        page: new Page(), sort: 'name.asc' };
    this.selectedCategoryIndex = 0;
    this.missingGroups = [];
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(val => val.length > 0)
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
    return false; // funker  dette da?
  }

  onSave() {
    this.findMissingAction.emit({action: 'modal', params: ['close']});
    if (this._rd.getMissing()) {
      if (this._rd['changeKind']) {
        this._rd['changeKind'] = 'TYPO';
        this._rd['changeComment'] = 'Comment by rule';
        console.log('changeKind set, ready for persisting');
      }
      this.selectedEvent.emit(
        { elementRevision: 0,
        element: this._rd,
        elementKind: ElementKind.RESPONSEDOMAIN,
        elementId: this._rd.id  } );
    }
  }

  public getMissing(): Category {
    return this._rd.getMissing();
  }

  public setMissing(missing: IElement) {
    let rd = this._rd;

    if (!rd.isMixed()) {
      rd = makeMixed(rd);
    }
    rd.addManagedRep(missing.element)

    rd.name = rd.managedRepresentation.name =
      'Mixed [' + this.getGroupEntities(rd.managedRepresentation)[0].name + '+' + missing.element.name + ']';
    this._rd = rd;
  }


  private getGroupEntities(representation: Category): Category[] {
    if (representation.categoryType !== 'MIXED') {
      return [representation];
    } else {
      return representation.children;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['responseDomain']) {
    this._rd = new ResponseDomain(this.responseDomain);
    }
  }

}
