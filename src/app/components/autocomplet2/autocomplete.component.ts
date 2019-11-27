import {Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ElementEnumAware, ElementKind, Factory, getElementKind, getQueryInfo, IElement, IEntityAudit } from '../../lib';

@Component({
  selector: 'qddt-auto-complete2',
  template: `
    <div class="input-field">
      <i *ngIf="prefix" class="material-icons prefix">{{prefix}}</i>
      <input type="text" id="identifier" class="autocomplete">
      <label for="identifier">Autocomplete</label>
    </div>
  `,
})

@ElementEnumAware
export class QddtAutoCompleteComponent implements AfterViewInit {
  @Input() items: IEntityAudit[];
  @Input() elementKind: ElementKind;
  @Input() prefix: string;
  @Input() initialValue = '';
  @Input() autoCreate = true;

  @Output() selectEvent = new EventEmitter<IElement>();
  @Output() focusEvent = new EventEmitter<string>();
  @Output() enterEvent = new EventEmitter<string>();

  public value = '';
  public identifier = `AC-` + ident++;

  private searchKeysChange: Subject<string> = new Subject<string>();

  constructor() {
    this.searchKeysChange.pipe(
      debounceTime(300),
      distinctUntilChanged())
    .subscribe((name: string) => {
      // this.waitingForChange = true;
      this.enterEvent.emit(name);
    });
  }

  ngAfterViewInit(): void {
    const elem =  document.getElementById(this.identifier);
    const instance = M.Autocomplete.getInstance(elem);
  }
}

let ident = 0;
