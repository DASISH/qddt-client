import { Component, EventEmitter, Output } from '@angular/core';
import {ElementKind, Page, Universe} from '../../../lib';
import { TemplateService } from '../../../components/template';

@Component({
  selector: 'qddt-universe-create',

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
