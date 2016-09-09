import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'autocomplete',
  moduleId: module.id,
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  directives: []
})

export class AutocompleteComponent {
  @Input() items:  any[];
  @Input() searchField: any;
  /**
   * set initial value
   */
  @Input() initialValue: string;
  /**
   * searchable results from server
   */
  @Input() searchFromServer: boolean;
  @Output() autocompleteSelectEvent: EventEmitter<any> = new EventEmitter();
  @Output() autocompleteFocusEvent: EventEmitter<any> = new EventEmitter();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter();
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
    if(this.searchFromServer === null) {
      this.searchFromServer = false;
    }
  }

  ngOnChanges() {
    this.candidates = this.items;
  }

  enterText(event) {
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
    if (this.searchField instanceof Array) {
      let result: any = candiate;
      this.searchField.forEach(element => {
        if (result !== null && result[element] !== undefined) {
          result = result[element];
        } else {
          result = '';
        }
      });
      return result;
    } else {
      return candiate[this.searchField] || '';
    }
  }

  private filterItems(search: string) {
    let field = this.searchField;
    this.candidates = this.items.filter(
      function (item) {
        return search === undefined || search.length === 0
          || (typeof item[field] === 'string'
          && item[field].length > 0
          && item[field].toLowerCase().indexOf(search.toLowerCase()) >= 0);
    });
  }

}
