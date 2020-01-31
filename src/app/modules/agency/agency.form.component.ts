import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Agency, ElementKind, TemplateService, ActionKind, LANGUAGE_MAP } from 'src/app/lib';


@Component({
  selector: 'qddt-agency-form',
  templateUrl: './agency.form.component.html'
})

export class AgencyFormComponent implements AfterViewInit {
  @Input() agency: Agency;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<Agency>();

  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly CATEGORY = ElementKind.CATEGORY;
  public readonly formId = Math.round(Math.random() * 10000);

  constructor(private agencyService: TemplateService) {
    this.readonly = !this.agencyService.can(ActionKind.Create, ElementKind.CATEGORY);
    if (!this.agency) {
      this.agency = new Agency();
    }
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  onSave() {
    this.agencyService.update<Agency>(this.agency).subscribe(
      (result) => {
        this.agency = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
