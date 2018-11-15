import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionKind, ElementKind, Universe } from '../../classes';
import { TemplateService } from '../../components/template';


@Component({
  selector: 'qddt-universe-form',
  templateUrl: './universe.form.component.html'
})

export class UniverseFormComponent implements OnInit {

  @Input() universe: Universe;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;

  public isTemplate: boolean;

  private selectedUniverseIndex: number;

  constructor(private universeService: TemplateService) {
    this.selectedUniverseIndex = 0;
  }

  ngOnInit() {
    if (!this.universe) {
      this.universe = new Universe();
    }
    this.readonly = !this.universeService.can(ActionKind.Create, ElementKind.UNIVERSE);
  }


  onSave() {
    this.universeService.update(this.universe).subscribe(
      (result) => {
        this.universe = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
