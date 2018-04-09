import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { QddtElement } from '../elementinterfaces/elements';
import { IEntityAudit } from '../elementinterfaces/entityaudit';

@Component({
  selector: 'qddt-auto-complete',
  moduleId: module.id,
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})

export class AutocompleteComponent implements OnInit, OnChanges {
  @Input() items:  IEntityAudit[];
  @Input() elementtype: QddtElement;
  /**
   * set initial value
   */
  @Input() initialValue: string;

  @Output() selectEvent = new EventEmitter<IEntityAudit>();
  @Output() focusEvent = new EventEmitter<string>();
  @Output() enterEvent = new EventEmitter<string>();

  public candidates: any[];
  public showAutoComplete = false;
  public value: string;
  public selectedIndex = 0;

  private searchFromServer = true;

  ngOnInit() {
    this.value = this.initialValue;
    console.log('ngOnInit -> auto-complete');
  }

  ngOnChanges() {
    this.candidates = this.items;
    console.log('ngOnChanges -> auto-complete');
  }

  enterText(event: any) {
    this.value = event.target.value;
    this.enterEvent.emit(this.value);
  }

  onFocus() {
    this.showAutoComplete = true;
    this.focusEvent.emit('focus');
    this.filterItems(this.value);
  }

  select(candidate: IEntityAudit) {
    this.showAutoComplete = false;
    this.value = this.getFieldValue(candidate, this.elementtype.fields);
    this.selectEvent.emit(candidate);
  }

  getLabel(candiate: IEntityAudit) {
    if (this.elementtype.isMultipleFields()) {
      const results: any[] = this.elementtype.fields.map(element => {
        return this.getFieldValue(candiate, element).substring(0, 200).concat('...');
      });
      return results.join(' | ');
    } else {
      return this.getFieldValue(candiate, this.elementtype.fields).substring(0, 200).concat('...');
    }
  }

  onClearKeywords() {
    this.value = '';
    if (this.searchFromServer) {
      this.enterEvent.emit(this.value);
    } else {
      this.filterItems(this.value);
    }
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
    const field = this.elementtype.fields;
    const isMultipleFields = this.elementtype.isMultipleFields();
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

}
