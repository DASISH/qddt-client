import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { IElement, IEntityAudit} from '../classes/interfaces';
import { QueryInfo } from '../classes/classes';
import { ElementKind } from '../classes/enums';
import { ElementEnumAware } from '../../preview/preview.service';
import { getElementKind, QDDT_QUERY_INFOES} from '../classes/constants';

@Component({
  selector: 'qddt-auto-complete',
  moduleId: module.id,
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})

@ElementEnumAware
export class QddtAutoCompleteComponent implements OnInit, OnChanges {
  @Input() items: IEntityAudit[];
  @Input() elementKind: ElementKind;
  @Input() initialValue = '';

  @Output() selectEvent = new EventEmitter<IElement>();
  @Output() focusEvent = new EventEmitter<string>();
  @Output() enterEvent = new EventEmitter<string>();

  public candidates: IEntityAudit[] = [];
  public showAutoComplete = false;
  public value = '';
  public selectedIndex = 0;
  public queryInfo: QueryInfo;

  private waitingForChange = true;
  private searchFromServer = true;

  ngOnInit() {
    this.value = this.initialValue;
  }

  ngOnChanges(change: SimpleChanges) {
    if (change['elementKind']) {
      this.queryInfo = QDDT_QUERY_INFOES[getElementKind(this.elementKind)];
    } else if ( (change['items'])) {
      if (this.waitingForChange) {
        this.waitingForChange = false;
        this.candidates = this.items;
      }
    }
  }

  enterText(event: any) {
    this.value = event.target.value;
    if (event.key === 'Enter') {
      this.showAutoComplete = false;
      const item = ((this.candidates) && this.candidates.length > 0 ) ? this.candidates[0] : event.target.value;
      this.value =  (item.id) ? item.name : this.value;
      this.selectEvent.emit({element: item , elementKind: this.elementKind });
    }
    this.waitingForChange = true;
    this.enterEvent.emit(this.value);
  }

  notFound(): boolean {
    return (  this.showAutoComplete && (this.value) &&  this.candidates.length === 0 );
  }

  onFocus() {
    this.showAutoComplete = true;
    this.focusEvent.emit('focus');
    this.filterItems(this.value);
  }

  select(candidate: IEntityAudit) {
    this.showAutoComplete = false;
    this.value = this.getFieldValue(candidate, this.queryInfo.fields);
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

}
