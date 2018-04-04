import { Component, EventEmitter, Output } from '@angular/core';

import { ControlConstructService, Universe } from '../controlconstruct.service';
import { QDDT_ELEMENTS, ElementKind } from '../../shared/elementinterfaces/elements';

@Component({
  selector: 'qddt-universe-create',
  moduleId: module.id,
  templateUrl: 'universe.component.html',
  styles: [
    `.noItemFound { border: thick solid orange; }`
  ],
})

export class UniverseComponent {
  @Output() createUniverseEvent = new EventEmitter<any>();

  public readonly UNIVERSE = QDDT_ELEMENTS[ElementKind.UNIVERSE];

  public universe: any;
  public universes: any[];
  public isUniverseNew: boolean;

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
    this.service.searchUniverses(key).then((result: any) => {
        this.universes = result.content;
        this.isUniverseNew = this.universes.length === 0;
      });
  }

  onSelectUniverse(universe: any) {
    this.universe = universe;
    console.log('UniverseComponent onSelectUniverse' + this.universe.name);
  }

}
