import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ActionKind, ElementKind, LANGUAGE_MAP, TemplateService, Universe} from '../../lib';


@Component({
  selector: 'qddt-universe-form',
  templateUrl: './universe.form.component.html'
})

export class UniverseFormComponent implements AfterViewInit {
  @Input() universe: Universe;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<Universe>();

  public readonly formId = Math.round( Math.random() * 10000);
  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly LANGUAGES = LANGUAGE_MAP;


  constructor(private universeService: TemplateService) {
    if (!this.universe) {
      this.universe = new Universe();
    }
    this.readonly = !this.universeService.can(ActionKind.Create, ElementKind.UNIVERSE);
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  onSave() {
    this.universeService.update<Universe>(this.universe).subscribe(
      (result) => {
        this.universe = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
