import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionKind, ElementKind, Universe, enumLANGUAGES } from '../../lib';
import { TemplateService } from '../../components/template';
import { LanguageKind } from 'src/app/lib/enums/language-kind';


@Component({
  selector: 'qddt-universe-form',
  templateUrl: './universe.form.component.html'
})

export class UniverseFormComponent implements OnInit {

  @Input() universe: Universe;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<Universe>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly formId = Math.round( Math.random() * 10000);
  public readonly LANGUAGES = LanguageKind;
  // public isTemplate: boolean;

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
    this.universeService.update<Universe>(this.universe).subscribe(
      (result) => {
        this.universe = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
