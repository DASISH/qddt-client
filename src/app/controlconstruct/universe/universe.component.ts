import { Component, EventEmitter, Output } from '@angular/core';

import { ControlConstructService, Universe } from '../controlconstruct.service';
import { QDDT_ELEMENTS, ElementKind } from '../../shared/elementinterfaces/elements';
import { TemplateService } from '../../template/template.service';
import { Page } from '../../shared/table/table.page';

@Component({
  selector: 'qddt-universe-create',
  moduleId: module.id,
  templateUrl: 'universe.component.html',
})

export class UniverseComponent {
  @Output() createUniverseEvent = new EventEmitter<any>();

  public readonly UNIVERSE = QDDT_ELEMENTS[ElementKind.UNIVERSE];
  public universe: any;
  public universes: any[];
  public isNew: boolean;

  constructor(private service: TemplateService) {
    this.universe = new Universe();
    this.universe.description = '';
    this.universes = [];
  }

  onAddUniverse() {
    this.createUniverseEvent.emit(this.universe);
  }

  onSearchUniverses(key: string) {
    this.universe.description = key;
    this.service.searchByKind(ElementKind.UNIVERSE, key, new Page()).then(
      (result: any) => {
        this.universes = result.content;
        this.isNew = this.universes.length === 0;
      });
  }

  onSelectUniverse(universe: any) {
    this.universe = universe;
  }

}
