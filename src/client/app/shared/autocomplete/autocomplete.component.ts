import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'autocomplete',
  moduleId: module.id,
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})

export class AutocompleteComponent implements OnInit, OnChanges {
  @Input() items:  any[];
  @Input() searchField: any;
  @Input() placeholder: string;
  @Input() isMutipleFields: boolean;
  /**
   * set initial value
   */
  @Input() initialValue: string;
  /**
   * searchable results from server
   */
  @Input() searchFromServer: boolean;
  @Output() autocompleteSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() autocompleteFocusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();
  private candidates: any[];
  private selectedIndex: number;
  private showAutoComplete: boolean;
  private value: string;

  constructor() {
    this.selectedIndex = 0;
    this.showAutoComplete = false;
  }

  ngOnInit() {
    this.value = this.initialValue;
    if(this.isNull(this.searchFromServer)) {
      this.searchFromServer = false;
    }
    if(this.isNull(this.placeholder)) {
      this.placeholder = 'Search';
    }
    if(this.isNull(this.isMutipleFields)) {
      this.isMutipleFields = false;
    }
  }

  ngOnChanges() {
    this.candidates = this.items;
  }

  enterText(event: any) {
    this.value = event.target.value;
    if(this.searchFromServer) {
      this.enterEvent.emit(this.value);
    } else {
      this.filterItems(this.value);
    }
  }

  onFocus() {
    this.showAutoComplete = true;
    this.autocompleteFocusEvent.emit('focus');
    this.filterItems(this.value);
  }

  select(candidate: any) {
    this.showAutoComplete = false;
    this.value = candidate[this.searchField];
    this.autocompleteSelectEvent.emit(candidate);
  }

  getLabel(candiate: any) {
    if (this.isMutipleFields) {
      let results: any[] = this.searchField.map(element => {
        return this.getFieldValue(candiate, element);
      });
      return results.join(' | ');
    } else {
      return this.getFieldValue(candiate, this.searchField);
    }
  }

  onClearKeywords() {
    this.value = '';
    if(this.searchFromServer) {
      this.enterEvent.emit(this.value);
    } else {
      this.filterItems(this.value);
    }
  }

  private getFieldValue(object: any, path: any) {
    if (path instanceof Array) {
      let result: any = object;
      path.forEach((element: any) => {
        if (!this.isNull(result) && !this.isNull(result[element])) {
          result = result[element];
        } else {
          result = '';
        }
      });
      return result;
    } else {
      return object[path] || '';
    }
  }

  private isNull(object: any) {
    return object === null || object === undefined;
  }

  private filterItems(search: string) {
    let field = this.searchField;
    let isMutipleFields = this.isMutipleFields;
    let filterItem = this.filterItem;
    let isNull = this.isNull;
    this.candidates = this.items.filter(
      function (item) {
        if (isMutipleFields) {
          return field.findIndex((element: any) => {
            return filterItem(item, element, search, isNull);
          }) >= 0;
        } else {
          return filterItem(item, field, search, isNull);
        }
    });
  }

  private filterItem(item: any, path: any, search: string, isNull: any) {
    if(isNull(search) || search.length === 0) {
      return true;
    }
    let result: any;
    if (path instanceof Array) {
      result = item;
      path.forEach((element: any) => {
        if (!isNull(result) && !isNull(result[element])) {
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

}
