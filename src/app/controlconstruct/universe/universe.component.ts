import { Component, EventEmitter, Output } from '@angular/core';
import { TemplateService } from '../../template/template.service';
import { Page } from '../../shared/classes/classes';
import { QDDT_QUERY_INFOES } from '../../shared/classes/constants';
import { ElementKind } from '../../shared/classes/enums';
import { Universe } from '../controlconstruct.classes';

@Component({
  selector: 'qddt-universe-create',
  moduleId: module.id,
  templateUrl: 'universe.component.html',
})

export class UniverseComponent {
  @Output() createUniverseEvent = new EventEmitter<any>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public universe: any;
  public universeList: any[];
  public isNew: boolean;

  constructor(private service: TemplateService) {
    this.universe = new Universe();
    this.universe.description = '';
    this.universeList = [];
  }

  onAddUniverse() {
    this.createUniverseEvent.emit(this.universe);
  }

  onSearchUniverses(key: string) {
    this.universe.description = key;
    this.service.searchByKind( { kind: this.UNIVERSE, key: key, page: new Page() } ).then(
      (result: any) => {
        this.universeList = result.content;
        this.isNew = this.universeList.length === 0;
      });
  }

  onSelectUniverse(universe: any) {
    this.universe = universe;
  }

}
