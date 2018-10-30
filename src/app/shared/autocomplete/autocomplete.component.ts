import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ElementEnumAware } from '../../preview/preview.service';
import { ElementKind, getQueryInfo, IElement, IEntityAudit, QueryInfo } from '../classes';
import { Factory } from '../classes/factory';

declare var $;
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

  @Output() selectEvent = new EventEmitter<IElement>();
  @Output() focusEvent = new EventEmitter<string>();
  @Output() enterEvent = new EventEmitter<string>();

  public candidates: IEntityAudit[] = [];
  public value = '';
  public selectedIndex = 0;
  public queryInfo: QueryInfo;
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
    // $('autocomplete-id').autocomplete({
    //   data: {
    //     "Apple": null,
    //     "Microsoft": null,
    //     "Google": 'https://placehold.it/250x250'
    //   },
    //   limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
    //   onAutocomplete: function(val) {
    //     console.log(val);
    //   },
    //   minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    // });
  }

  ngOnChanges(change: SimpleChanges) {
    if (change['elementKind'] && change['elementKind'].isFirstChange()) {
      this.queryInfo = getQueryInfo(this.elementKind);
    }

    if ( (change['items'] && this.waitingForChange)) {
      this.waitingForChange = false;
      this.candidates = this.items;
      this.found = ((this.candidates) && (this.candidates.length > 0));
    }

    if (change['initialValue'] && change['initialValue'].isFirstChange() && !this.selected ) {
      this.value = this.initialValue;
    }
  }

  enterText(event: any) {
    this.value = event.target.value;
    if (event.key === 'Enter') {
      this.showAutoComplete = false;
      const fieldName = this.queryInfo.fields[0];
      const item = (this.found) ? this.candidates[0] :
        (this.autoCreate) ? Factory.createFromSeed(this.elementKind, { [fieldName] : this.value }) : null;
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
      this.value = null;
    }
  }

  select(candidate: IEntityAudit) {
    this.showAutoComplete = false;
    this.selected = true;
    const fieldName = this.queryInfo.fields[0];
    this.value = candidate[fieldName];
    this.selectEvent.emit({element: candidate, elementKind: this.elementKind });
  }

  getLabel(candiate: IEntityAudit) {
    if (this.queryInfo.isMultipleFields()) {
      const results: any[] = this.queryInfo.fields.map(element => {
        return this.getFieldValue(candiate, element).substring(0, 200).concat('...');
      });
      return results.join(' | ');
    } else {
      return this.getFieldValue(candiate, this.queryInfo.fields).substring(0, 200).concat('...');
    }
  }

  onClearKeywords() {
    this.value = '';
    this.selected = false;
    this.filterItems('');
    this.waitingForChange = true;
    this.enterEvent.emit('*');
  }

  private getFieldValue(object: IEntityAudit, path: any) {
    if (path instanceof Array) {
      let result: any = object;
      path.forEach((element: any) => {
        if ((result) && (result[element])) {
          result = result[element];
        } else {
          result = '';
        }
      });
      return result;
    } else {
      return object[path] || '??';
    }
  }

  private filterItems(search: string) {
    if (!this.items || !this.queryInfo) { return; }
    const field = this.queryInfo.fields;
    const isMultipleFields = this.queryInfo.isMultipleFields();
    const filterItem = this.filterItem;
    this.candidates = this.items.filter(
      function (item) {
        if (isMultipleFields) {
          return field.findIndex((element: any) => {
            return filterItem(item, element, search);
          }) >= 0;
        } else {
          return filterItem(item, field, search);
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
