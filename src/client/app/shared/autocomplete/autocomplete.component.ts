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
  @Input() elementtype:QddtElementType;
  /**
   * set initial value
   */
  @Input() initialValue: string;

  @Output() autocompleteSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() autocompleteFocusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();

  private candidates: any[];
  private selectedIndex: number =0;
  private showAutoComplete: boolean = false;
  private searchFromServer: boolean = true;
  private value: string;

  ngOnInit() {
    this.value = this.initialValue;
  }

  ngOnChanges() {
    this.candidates = this.items;
  }

  enterText(event: any) {
    this.value = event.target.value;
    // if(this.searchFromServer) {
      this.enterEvent.emit(this.value);
    // } else {
    //   this.filterItems(this.value);
    // }
  }

  onFocus() {
    this.showAutoComplete = true;
    this.autocompleteFocusEvent.emit('focus');
    this.filterItems(this.value);
  }

  select(candidate: any) {
    this.showAutoComplete = false;
    this.value = this.getFieldValue(candidate, this.elementtype.fields);
    this.autocompleteSelectEvent.emit(candidate);
  }

  getLabel(candiate: any) {
    if (this.elementtype.isMultipleFields()) {
      let results: any[] = this.elementtype.fields.map(element => {
        return this.getFieldValue(candiate, element).substring(0,200).concat('...');
      });
      return results.join(' | ');
    } else {
      return this.getFieldValue(candiate, this.elementtype.fields).substring(0,200).concat('...');
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
    let field = this.elementtype.fields;
    let isMultipleFields = this.elementtype.isMultipleFields();
    let filterItem = this.filterItem;
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
    if(!(search) || search.length === 0) {
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

}
