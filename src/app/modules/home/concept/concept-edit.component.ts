import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Concept, ConceptPojo, LANGUAGE_MAP, TemplateService } from '../../../lib';


@Component({
  selector: 'qddt-concept-edit',
  providers: [{ provide: 'elementKind', useValue: 'CONCEPT' },],
  template: `
<ng-container *ngIf="(concept && isVisible)">
  <form class="row" id="{{formId}}" (ngSubmit)="save()" #hf="ngForm">

    <qddt-input class="col s10"
          required
          name="name"
          placeholder="If not specified, same as Label, but must be unique within the Agencys Concepts"
          label="Name"
          [(ngModel)]="concept.name"
          data-length="100">
    </qddt-input>
    <qddt-select class="col s2"
          required
          name="xmlLang"
          label="Language"
          [(ngModel)]="concept.xmlLang"
          [lockups]="LANGUAGES" >
    </qddt-select>
    <qddt-input class="col s12" required name="label" label="Label" type="text" placeholder="This will be the visual representation of this Concept"
                [(ngModel)]="concept.label" data-length="250">
    </qddt-input>

    <qddt-textarea class="col s12" name="description"
        required
        placeholder="Describe each Concept with clear boundaries, if the Concept is complex, you can subdivide it further until satisfying boundaries are isArchived. "
        label="Description"
        [(ngModel)]="concept.description"
        data-length="20000">
    </qddt-textarea>

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
</ng-container>
`
})
export class ConceptEditComponent {
  @Input() concept: Concept;
  @Output() conceptChanged = new EventEmitter<Concept>();
  @Input() readonly = false;

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly LANGUAGES = LANGUAGE_MAP;
  public showRevision = false;
  public showNew = false;
  public isVisible = false;

  constructor(private service: TemplateService) { }


  save() {
    console.debug(new ConceptPojo(this.concept));
    this.service.update<Concept>(new ConceptPojo(this.concept)as Concept)
      .subscribe((result) => {
        this.concept = result;
        this.conceptChanged.emit(result);
        this.isVisible = false;
      });
  }

}
