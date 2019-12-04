import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Concept, TemplateService, enumLANGUAGES } from '../../../lib';
import { LanguageKind } from 'src/app/lib/enums/language-kind';

@Component({
  selector: 'qddt-concept-edit',
  providers: [{ provide: 'elementKind', useValue: 'CONCEPT' }, ],
  template: `
<div *ngIf="(concept && isVisible)">
  <form class="row" id="{{formId}}" (ngSubmit)="save()" #hf="ngForm">
    <div class="col s12">
      <div class="row">
        <qddt-input class="col s10"
          required
          name="name"
          placeholder="add concept name"
          label="Name"
          [(ngModel)]="concept.name"
          data-length="100">
        </qddt-input>
        <qddt-select class="col s2"
          required
          name="xmlLang"
          label="xmlLang"
          [(ngModel)]="concept.xmlLang"
          [enum]="LANGUAGES" >
        </qddt-select>
      </div>
    </div>
    <div class="col s12">
      <qddt-textarea name="description"
        required
        placeholder="add description"
        label="Description"
        [(ngModel)]="concept.description"
        data-length="10000">
      </qddt-textarea>
    </div>

    <qddt-rational *ngIf="!readonly && isVisible"
      class="col s12"
      [formName]="'RationalComp'"
      [element]="concept"
      [config]="{hidden: [2,3]}">
    </qddt-rational>

    <qddt-element-footer  class="col s12" [element]="concept"></qddt-element-footer>

    <div class="col s12 right-align" *ngIf="!readonly">
      <button type="submit" class="btn btn-default" [disabled]="!hf.form.valid" >Submit</button>
    </div>
  </form>
</div>
`
})
export class ConceptEditComponent {
  @Input() concept: Concept;
  @Output() conceptChanged = new EventEmitter<Concept>();
  @Input() readonly = false;

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly LANGUAGES = LanguageKind;
  public showRevision = false;
  public isVisible = false;

  constructor(private service: TemplateService) { }


  save() {
    this.service.update<Concept>(this.concept)
      .subscribe((result) => {
        this.concept = result;
        this.conceptChanged.emit(result);
        this.isVisible = false;
      });
  }

}
