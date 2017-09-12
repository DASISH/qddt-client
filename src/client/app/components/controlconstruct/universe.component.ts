import { Component, EventEmitter, Output } from '@angular/core';

import { ControlConstructService, Universe } from './controlconstruct.service';

@Component({
  selector: 'qddt-universe-create',
  moduleId: module.id,
  template: `
  <div class="row card">
    <div class="col s10 black-text">
      <label>Description</label>
      <div [ngClass]="{ noItemFound: (isUniverseNew && universe.description.length > 0 && universe.length === 0) }">
		<autocomplete [items]="universes" class="black-text"
          [searchField]="'description'"
		      [searchFromServer]="true"
          [initialValue]="universe?.description"
          (autocompleteSelectEvent)="onSelectUniverse($event)"
		      (enterEvent)="onSearchUniverses($event)">
		</autocomplete>
	  </div>
    </div>
    <div class="col s2 right">
      <a class="waves-effect waves-light btn" (click)="onAddUniverse()">add</a>
    </div>
  </div>
  `,
  styles: [
    `.noItemFound {
        border: thick solid orange;
    }`
  ],
  providers: [ControlConstructService],
})

export class UniverseComponent {
  @Output() createUniverseEvent = new EventEmitter<any>();

  universe: any;
  universes: any[];
  isUniverseNew: boolean;

  constructor(private service: ControlConstructService) {
    this.universe = new Universe();
    this.universes = [];
    this.universe.description = '';
  }

  onAddUniverse() {
    this.createUniverseEvent.emit(this.universe);
    this.universe = new Universe();
  }

  onSearchUniverses(key: string) {
    this.universe.description = key;
    this.service.searchUniverses(key).subscribe((result: any) => {
        this.universes = result.content;
        this.isUniverseNew = this.universes.length === 0;
      },
      (error: any) => { console.log(error); });
  }

  onSelectUniverse(universe: any) {
    this.universe = universe;
  }

}
