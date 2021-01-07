import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  ElementEnumAware, ElementKind,
  Factory, getElementKind, getQueryInfo,
  IElement, IEntityAudit, QueryInfo, hasChanges, ILabel
} from '../../lib';
import { DialogComponent } from '../dialog/dialog.component';

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
  @Input() validate = false;
  @Input() xmlLang = 'none';

  @Output() selectEvent = new EventEmitter<IElement>();
  @Output() focusEvent = new EventEmitter<string>();
  @Output() enterEvent = new EventEmitter<string>();

  public candidates: IEntityAudit[] = [];
  public value = '';
  public selectedIndex = 0;
  public showAutoComplete = false;
  public readonly formId = Math.round(Math.random() * 10000);

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

  public ngOnDestroy(): void {
    this.searchKeysChange.unsubscribe();
  }


  public ngOnChanges(changes: SimpleChanges) {

    if ((changes.items && this.waitingForChange)) {
      this.waitingForChange = false;
      this.candidates = this.items.sort((a, b) => this.elementCompare(a, b));
      if (this.candidates && this.candidates.length > 0) {
        this.elementKind = getElementKind(this.candidates[0].classKind);
      }
      this.found = this.findCandidate(this.value) !== undefined || (this.candidates.length > 0) || (this.value.length === 0);
    }
    if (changes.initialValue && changes.initialValue.isFirstChange() && !this.selected) {
      console.debug('initialValue');
      this.value = this.initialValue;
    }
    if (hasChanges(changes.elementKind) && !changes.elementKind.isFirstChange()) {
      console.debug('onClearKeywords');
      this.onClearKeywords();
    }
  }

  public get queryInfo(): QueryInfo {
    return (this.elementKind) ? getQueryInfo(this.elementKind) : null;
  }


  public enterText(event: any, ref: DialogComponent) {
    this.value = event.target.value;
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.showAutoComplete = false;
      const item = this.findCandidate(this.value);
      if (item) {
        const fieldName = this.queryInfo.fields[0];
        this.value = item[fieldName];
        this.selected = true;
        this.found = true;
        this.selectEvent.emit({ element: item, elementKind: this.elementKind });
      } else if (this.autoCreate) {
        this.found = false;
        ref.open(event, null);
      }
    } else if (event.key === 'Escape') {
      this.showAutoComplete = false;
      if (!this.selected) {
        this.value = this.initialValue || null;
        this.selected = true;
        this.found = true;
      }

    } else {
      this.searchKeysChange.next(this.value);
    }
  }

  public onNewItem(event) {
    if (event.result) {
      const fieldName = this.queryInfo.fields[0];
      const item = Factory.createFromSeed(this.elementKind, { [fieldName]: this.value.trim(), xmlLang: this.xmlLang })
      this.value = item[fieldName];
      this.selected = true;
      this.selectEvent.emit({ element: item, elementKind: this.elementKind });
    } else {
      this.selected = false;
    }
  }

  public notFound(): boolean {
    return (!this.found && this.value.length > 0);
  }

  public invalid(): boolean {
    return (!this.found && !this.autoCreate);
  }

  public onFocus() {
    this.showAutoComplete = true;
    this.focusEvent.emit('focus');
    this.filterItems(this.value);
  }

  public onBlur() {
    this.showAutoComplete = false;
    // this.found = this.findCandidate(this.value) !== undefined;
  }

  public onClearKeywords() {
    this.value = this.initialValue;
    this.selected = false;
    this.found = true;
    this.filterItems('');
    this.waitingForChange = true;
    this.enterEvent.emit('');
  }

  public getLabel(entity: IEntityAudit) {
    return this.getFieldValue(entity, this.queryInfo.fields) || '';
  }


  public onSelectCandidate(entity: IEntityAudit) {
    this.showAutoComplete = false;
    this.selected = true;
    const fieldName = this.queryInfo.fields[0];
    this.value = entity[fieldName];
    this.selectEvent.emit({ element: entity, elementKind: this.elementKind });
  }

  private isLabel(entity: IEntityAudit): entity is ILabel {
    return (entity as ILabel).label !== undefined && (entity as ILabel).label !== null;
  }

  private elementCompare(entity1: IEntityAudit, entity2: IEntityAudit): number {

    if (this.isLabel(entity1) && this.isLabel(entity2)) {
      const i = entity1.label.localeCompare(entity2.label);
      if (i !== 0) return i;
    }
    return entity1.name.localeCompare(entity2.name)
  }

  private findCandidate(value: string): IEntityAudit {
    if (!this.candidates) return undefined;
    const fieldName = this.queryInfo.fields[0];

    let item = this.candidates.find(p => p[fieldName] === value) ||
      this.candidates.find(p => (p[fieldName] as string).toUpperCase() === value.toUpperCase());

    if (!item && fieldName !== 'name') {
      item = this.candidates.find(p => p.name === value) ||
        this.candidates.find(p => (p.name.toUpperCase() === value.toUpperCase()));
    }
    return item;
  }


  private getFieldValue(entity: IEntityAudit, path: any) {
    if (path instanceof Array) {
      return path.map((element: any) => (entity[element]) ? entity[element] : '').join(' | ');
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
      }).sort((a, b) => this.elementCompare(a, b));
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
