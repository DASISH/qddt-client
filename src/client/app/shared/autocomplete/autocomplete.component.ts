import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { QddtElementType } from '../preview/preview.service';

@Component({
  selector: 'autocomplete',
  moduleId: module.id,
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})

export class AutocompleteComponent implements OnInit, OnChanges {
  @Input() items:  any[];
  /**
   * These 3 or...
   */
  @Input() searchField: any[];
  @Input() placeholder: string;
  @Input() isMultipleFields: boolean;
  /**
   * This input variable
   */
  @Input() elementtype:QddtElementType;

  /**
   * set initial value
   */
  @Input() initialValue: string;
  /**
   * searchable results from server
   */
  @Input() searchFromServer: boolean = true;

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
    if (!this.isNull(this.elementtype)) {
      this.placeholder = this.elementtype.placeholder();
      this.isMultipleFields = this.elementtype.isMultipleFields();
      this.searchField = this.elementtype.fields;
    } else {
      if (this.isNull(this.placeholder)) {
        this.placeholder = 'Search';
      }
      if (this.isNull(this.isMultipleFields)) {
        this.isMultipleFields = false;
      }
    }
    console.log(this.elementtype);
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
    console.log('select  ' + candidate);
    this.showAutoComplete = false;
    this.value = this.getFieldValue(candidate, this.searchField);
    this.autocompleteSelectEvent.emit(candidate);
  }

  getLabel(candiate: any) {
    if (this.isMultipleFields) {
      let results: any[] = this.searchField.map(element => {
        return this.getFieldValue(candiate, element).substring(0,200).concat('...');
      });
      return results.join(' | ');
    } else {
      return this.getFieldValue(candiate, this.searchField).substring(0,200).concat('...');
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
    console.log('getFieldValue');
    console.log(object);
    console.log(path);
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
      return object[path] || '??';
    }
  }

  private isNull(object: any) {
    return object === null || object === undefined;
  }

  private filterItems(search: string) {
    let field = this.searchField;
    let isMultipleFields = this.isMultipleFields;
    let filterItem = this.filterItem;
    let isNull = this.isNull;
    this.candidates = this.items.filter(
      function (item) {
        if (isMultipleFields) {
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
