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
  @Input() searchField: string;
  @Input() initialValue: string;
  @Output() autocompleteSelectEvent: EventEmitter<any> = new EventEmitter();
  @Output() autocompleteFocusEvent: EventEmitter<any> = new EventEmitter();
  private candidates: any[];
  private selectedIndex: number;
  private showAutoComplete: boolean;
  private value: string;

  constructor() {
    this.selectedIndex = 0;
    this.showAutoComplete = false;
  }

  ngOnInit() {
    this.candidates = this.items;
    this.value = this.initialValue;
  }

  enterText(event) {
    this.value = event.target.value;
    this.filterItems(this.value);
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

  private filterItems(search: string) {
    let field = this.searchField;
    this.candidates = this.items.filter(
      function (item) {
        return search === undefined || search.length === 0
          || (item[field] !== undefined && item[field].toLowerCase().indexOf(search.toLowerCase()) >= 0);
    });
  }
}
