import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ElementEnumAware, ElementKind, Factory, getElementKind, getQueryInfo, IElement, IEntityAudit, QueryInfo} from '../../lib';

@Component({
  selector: 'qddt-auto-complete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})

@ElementEnumAware
export class QddtAutoCompleteComponent implements OnChanges, OnDestroy {
  @Input() items: IEntityAudit[];
  @Input() elementKind: ElementKind;
  @Input() formName: string;
  @Input() initialValue = '';
  @Input() autoCreate = true;
  @Input() xmlLang = 'none';

  @Output() selectEvent = new EventEmitter<IElement>();
  @Output() focusEvent = new EventEmitter<string>();
  @Output() enterEvent = new EventEmitter<string>();

  public candidates: IEntityAudit[] = [];
  public value = '';
  public selectedIndex = 0;
  public showAutoComplete = false;
  public readonly formId = Math.round( Math.random() * 10000);

  private waitingForChange = false;
  private found = true;
  private selected = false;

  private searchKeysChange: Subject<string> = new Subject<string>();

  constructor() {
    this.searchKeysChange.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe((name: string) => {
        this.waitingForChange = true;
        this.enterEvent.emit(name);
      });
  }

  get queryInfo(): QueryInfo {
    // console.log(this.elementKind || this.items[0] || JSON );
    return this.elementKind ? getQueryInfo(this.elementKind) : null;
  }


  ngOnChanges(change: SimpleChanges) {

    if ( (change.items && this.waitingForChange)) {
      this.waitingForChange = false;
      this.candidates = this.items;
      if (this.items && this.items.length > 0) {
        this.elementKind =  getElementKind(this.items[0].classKind);
      }
      this.found = ((this.candidates) && (this.candidates.length > 0));
    }

    if (change.initialValue && change.initialValue.isFirstChange() && !this.selected ) {
      this.value = this.initialValue;
    }
  }

  enterText(event: any) {
    this.value = event.target.value;
    if (event.key === 'Enter') {
      this.showAutoComplete = false;
      const fieldName = this.queryInfo.fields[0];
      const item = (this.found) ? this.candidates[0] :
        (this.autoCreate) ? Factory.createFromSeed(this.elementKind, { [fieldName] : this.value.trim(), xmlLang: this.xmlLang }) : null;
      if (item) {
        this.value = item[fieldName];
        this.selected = true;
        this.selectEvent.emit({element: item , elementKind: this.elementKind });
      }
    } else {
      this.searchKeysChange.next(this.value);
    }
  }

  notFound(): boolean {
    return ( !this.found );
  }

  invalid(): boolean {
    return ( !this.found && !this.autoCreate );
  }

  onFocus() {
    this.showAutoComplete = true;
    this.focusEvent.emit('focus');
    this.filterItems(this.value);
  }

  onBlur() {
    this.showAutoComplete = false;
    if (!this.selected) {
      this.value = this.initialValue || null;
    }
  }

  select(entity: IEntityAudit) {
    this.showAutoComplete = false;
    this.selected = true;
    const fieldName = this.queryInfo.fields[0];
    this.value = entity[fieldName];
    this.selectEvent.emit({element: entity, elementKind: this.elementKind });
  }

  getLabel(entity: IEntityAudit) {
      return this.getFieldValue(entity, this.queryInfo.fields);
  }

  onClearKeywords() {
    this.value = '';
    this.selected = false;
    this.filterItems('');
    this.waitingForChange = true;
    this.enterEvent.emit('');
  }

  private getFieldValue(entity: IEntityAudit, path: any) {
    if (path instanceof Array) {
      return path.map((element: any) => (entity[element]) ?  entity[element] : '' ).join(' | ');
    } else {
      return entity[path] || '??';
    }
  }

  private filterItems(search: string) {
    if (!this.items || !this.queryInfo) { return; }
    const field = this.queryInfo.fields;
    const isMultipleFields = this.queryInfo.isMultipleFields();
    // const filterItem = this.filterItem;
    this.candidates = this.items.filter(
      item => {
        if (isMultipleFields) {
          return field.findIndex((element: any) => {
            return this.filterItem(item, element, search);
          }) >= 0;
        } else {
          return this.filterItem(item, field, search);
        }
    });
  }

  private filterItem(item: any, path: any, search: string) {
    if (!(search) || search.length === 0) {
      return true;
    }
    let result: any;
    if (path instanceof Array) {
      result = item;
      path.forEach((element: any) => {
        if ((result) && (result[element])) {
          result = result[element];
        } else {
          result = '';
        }
      });
    } else {
      result = item[path] || '';
    }
    return result.toLowerCase().indexOf(search.toLowerCase()) >= 0;
  }

  ngOnDestroy(): void {
    this.searchKeysChange.unsubscribe();
  }

}
