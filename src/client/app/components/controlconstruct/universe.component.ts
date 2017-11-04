import { Component, EventEmitter, Output } from '@angular/core';

import { ControlConstructService, Universe } from './controlconstruct.service';
import { ElementKind, QddtElementTypes } from '../../shared/preview/preview.service';

@Component({
  selector: 'qddt-universe-create',
  moduleId: module.id,
  template: `
<div class="row card">
  <div class="col s10 black-text">
    <label>Description</label>
    <div [ngClass]="{ noItemFound: (isUniverseNew && universe.description.length > 0 && universe.length === 0) }">
    <autocomplete
      [items]="universes" class="black-text"
      [elementtype]="UNIVERSE"
      [initialValue]="universe?.description"
      (autocompleteSelectEvent)="onSelectUniverse($event)"
      (enterEvent)="onSearchUniverses($event)">
    </autocomplete>
  </div>
  </div>
  <div class="col s2 right">
    <a class="waves-effect waves-light btn" (click)="onAddUniverse($event)">add</a>
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
  private readonly UNIVERSE = QddtElementTypes[ElementKind.UNIVERSE];

  constructor(private service: ControlConstructService) {
    this.universe = new Universe();
    this.universe.description = '';
    this.universes = [];
  }

  onAddUniverse() {
    this.createUniverseEvent.emit(this.universe);
    console.log('UniverseComponent onAddUniverse' + this.universe.name);
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
    console.log('UniverseComponent onSelectUniverse' + this.universe.name);
  }

}
