import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'qddt-search-add',
  moduleId: module.id,
  template: `
    <ul class="hoverable"
        (mouseenter)="showButton = !readonly"
        (mouseleave)="showButton = false">
      <li>
        <div class="row" style="min-height:3rem">
          <div class="col s11"><label class="teal-text">{{ labelName }}</label></div>
          <div class="col s1">
            <a [ngClass]="{hide: !showButton}"
               class="btn-flat btn-floating btn-small waves-effect waves-light teal"
               (click)="canCreate=!canCreate">
              <i class="material-icons" title="Add">add</i>
            </a>
          </div>
        </div>
      </li>
      <li class="collection-item" *ngIf="canCreate">
        <div class="row card">
          <div class="col s10 black-text">
            <label>Description</label>
            <div [ngClass]="{ noItemFound: (isNew && element.description.length > 0 && elements.length === 0) }">
              <autocomplete [items]="elements" class="black-text"
                            [searchField]="'description'"
                            [searchFromServer]="true"
                            [initialValue]="element?.description"
                            (autocompleteSelectEvent)="onSelect($event)"
                            (enterEvent)="doSearch($event)">
              </autocomplete>
            </div>
          </div>
          <div class="col s2 right">
            <a class="waves-effect waves-light btn" (click)="doAdd()">add</a>
          </div>
        </div>
        <!--<qddt-instruction-create (createInstructionEvent)="onAdd($event)">-->
        <!--</qddt-instruction-create>-->
      </li>
      <li class="collection-item" *ngFor="let element of elements; let idx=index">
        <div class="row" style="min-height:3rem"
             (mouseenter)="element.showbutton = !readonly"
             (mouseleave)="element.showbutton = false">
          <div class="col s11">{{ element?.description }}</div>
          <div class="col s1">
            <a [ngClass]="{hide: !showButton}"
               class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
               (click)="doDelete(idx)">
              <i class="material-icons" title="Remove">remove</i>
            </a>
          </div>
        </div>
      </li>
    </ul>
`,
  providers: []
})
export class InstructionComponent {
  @Output() createElementEvent = new EventEmitter<any>();
  @Output() selectedEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() searchEvent = new EventEmitter<any>();

  @Input() labelName: string;
  @Input() elements: any[];
  @Input() isNew: boolean;

  element: any;
  canCreate: boolean;
  showButton: boolean;

  constructor() {
    this.elements = [];
  }

  doAdd() {
    this.createElementEvent.emit(this.element);
    this.element = null;
  }

  doSearch(key: string) {
    this.searchEvent.emit(key);
  }

  doDelete(selected: any) {
    this.deleteEvent.emit(selected);
    this.element = null;
  }

  onSelect(selected: any) {
    this.element = selected;
  }
}
