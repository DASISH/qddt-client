import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Concept, ConceptPojo, hasChanges, LANGUAGE_MAP, TemplateService } from '../../../lib';



@Component({
  selector: 'qddt-concept-edit',
  providers: [{ provide: 'elementKind', useValue: 'CONCEPT' },],
  template: `
<ng-container *ngIf="(concept && isVisible)">
  <form class="row" id="{{formId}}" (ngSubmit)="save()" #hf="ngForm">

    <qddt-input class="col s10"
          required
          name="name"
          placeholder="If not specified, same as Label, but must be unique within the Agency's concepts"
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
<!--
    <div class="col s12  chips input-field">
      <div class="chip" tabindex="0">yghgjklø<i class="material-icons close">close</i></div>
      <input class="input" id="d9647163-9533-1061-2202-3fcc28fe2c03">
    </div> -->

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
export class ConceptEditComponent implements OnChanges{
  @Input() concept: Concept;
  @Output() conceptChanged = new EventEmitter<Concept>();
  @Input() readonly = false;

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly LANGUAGES = LANGUAGE_MAP;
  public showRevision = false;
  public showNew = false;
  public isVisible = false;

  constructor(private service: TemplateService) {
    var elems = document.querySelectorAll('.chips');
     M.Chips.init(elems);
   }

  ngOnChanges(changes: SimpleChanges): void {
    if(hasChanges(changes.isVisible)){
      //  this.service
      //   .getByKindEntity<Concept>(ElementKind.CONCEPT, this.concept.id)
      //   .then( result => this.concept = result);

        console.debug("fetching latest");
    }
  }


  save() {
    console.debug(new ConceptPojo(this.concept));
    this.service.update<Concept>(this.concept)
      .subscribe((result) => {
        this.concept = result;
        this.conceptChanged.emit(result);
        this.isVisible = false;
      });
  }

}
