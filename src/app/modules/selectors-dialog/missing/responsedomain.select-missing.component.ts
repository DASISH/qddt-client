import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import {Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {
  Category,
  ElementKind,
  ElementRevisionRef,
  IPageSearch,
  Page,
  ResponseDomain,
  TemplateService
} from '../../../lib';

@Component({
  selector: 'qddt-select-missing-dialog',

  template: `
    <div class="modal modal-fixed-footer" id="select-missing-id"
         materialize="modal" [materializeActions]="dialogOpenAction">
      <div class="modal-content teal-text" style="padding:36px;">
    <div class="row">
        <qddt-auto-complete
          [items]="missingGroups"
          [elementKind]="CATEGORY_KIND"
          [autoCreate]="false"
          (enterEvent)="onSearchCategories($event)"
          (selectEvent)="setMissing($event)">
        </qddt-auto-complete>
        <table *ngIf="missingRd">
          <thead><tr><td>Code</td><td>Category</td></tr></thead>
          <tbody>
          <tr *ngFor="let category of getMissing().children; let idx=index">
            <td><input id="{{category?.id}}-code-value"
                       name="{{category?.id}}-code-value"
                       type="text" [(ngModel)]="category.code.codeValue" required></td>
            <td>{{ category?.label }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <a class="modal-action modal-close waves-effect waves-purple btn-flat teal white-text" (close)="onClose()">Close</a>
      </div>
    </div>`
})

export class ResponsedomainSelectMissingComponent implements OnInit, OnChanges {
  @Input() responseDomain: ResponseDomain;
  @Input() modalId =  Math.round( Math.random() * 10000);
  @Input() readonly = false;
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() removeEvent = new EventEmitter<any>();

  // @Output() close = new EventEmitter<boolean>(false);

  dialogOpenAction = new EventEmitter<string|MaterializeAction>();

  public readonly CATEGORY_KIND = ElementKind.MISSING_GROUP;
  public formId = Math.round( Math.random() * 10000);

  public showbutton: any;
  public missingGroups: Category[];
  public selectedCategoryIndex: number;
  public missingRd: ResponseDomain;


  private _rd: ResponseDomain;
  private searchKeysListener = new Subject<string>();
  private pageSearch: IPageSearch;

  constructor(private service: TemplateService) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['responseDomain']) {
      this._rd = new ResponseDomain(this.responseDomain);
      this.dialogOpenAction.emit({action: 'modal', params: ['open']});
    }
    console.log('preview');

  }

  ngOnInit() {
    if (!this.readonly) { this.readonly = false; }
  }

  onSearchCategories(name: string) {
    this.searchKeysListener.next(name);
  }

  onAddMissing() {
    // this.searchKeysListener.next('*');
    // this.modalActions.emit({action: 'modal', params: ['open']});
  }

  onDismiss() {
    this._rd = new ResponseDomain(this.responseDomain);
    this.missingRd = null;
    return false; // funker  dette da?
  }

  onSave() {
    // this.modalActions.emit({action: 'modal', params: ['close']});
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
    this.dialogOpenAction.emit({action: 'modal', params: ['close']});
  }



  private getGroupEntities(representation: Category): Category[] {
    if (representation.categoryType === 'MIXED') {
      return representation.children;
    } else {
      return [representation];
    }
  }



}
