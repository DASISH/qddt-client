import {AfterViewInit, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {
  Category,
  ElementKind,
  ElementRevisionRef,
  IElement,
  IPageSearch,
  Page,
  ResponseDomain,
  TemplateService
} from '../../../lib';


declare var $;

@Component({
  selector: 'qddt-select-missing',
  templateUrl: './select-missing.component.html'
})
export class SelectMissingComponent  implements AfterViewInit {
  @Input() responseDomain: ResponseDomain;
  @Input() readonly = false;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() removeEvent = new EventEmitter<any>();

  public formId = Math.round( Math.random() * 10000);
  public readonly CATEGORY_KIND = ElementKind.MISSING_GROUP;

  public showbutton: any;
  public missingGroups: Category[];
  public selectedCategoryIndex: number;
  public missingRd: ResponseDomain;

  private _rd: ResponseDomain;
  private searchKeysListener = new Subject<string>();
  private pageSearch: IPageSearch;

  constructor(private router: Router, private service: TemplateService) {
    this.pageSearch = { kind: this.CATEGORY_KIND, key: '',
      page: new Page(), sort: 'name,asc' };
    this.selectedCategoryIndex = 0;
    this.missingGroups = [];
    this.searchKeysListener.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(val => val.length > 0), )
    .subscribe((name: string) => {
      this.pageSearch.key = name;
      this.service.searchByKind<Category>(this.pageSearch).then(
        (result) => { this.missingGroups = result.content; });
    });

  }

  onClose() {
    $('#select-missing-01').modal('close');
  }

  ngAfterViewInit(): void {
    $('.modal').modal({
      ready: () => {
        M.updateTextFields();
      },
      complete: () => {
        this.router.navigate([{ outlets: { popup : null }}]);
      }
    });
    $('#select-missing-01').modal('open');
  }

  onDismiss() {
    this._rd = new ResponseDomain(this.responseDomain);
    this.missingRd = null;
    this.onClose();
  }

  onSave() {
    // this.modalActions.emit({action: 'modal', params: ['close']});
    if (this._rd.missing) {
      if (this._rd.changeKind) {
        this._rd.changeKind = 'TYPO';
        this._rd.changeComment = 'Comment by rule';    // but why this rule?
        console.log('changeKind set, ready for persisting');
      }
      console.log(this._rd.missing);
      this.selectedEvent.emit(
        { elementRevision: 0, element: this._rd, elementKind: ElementKind.RESPONSEDOMAIN, elementId: this._rd.id  } );
    }
    this.onClose();
  }

  public getMissing(): Category {
    return this._rd.missing;
  }

  public setMissing(missing: IElement) {
    console.log('add missing ' + missing.element);
    let rd = this._rd;

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
