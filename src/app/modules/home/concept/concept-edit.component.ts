import {Component, Input, EventEmitter, Output,  OnChanges, SimpleChanges} from '@angular/core';
import {Concept, TemplateService} from '../../../lib';



@Component({
  selector: 'qddt-concept-edit',
  providers: [ {provide: 'elementKind', useValue: 'CONCEPT'}, ],
  template: `
<div *ngIf="concept && isVisible">
  <form id="{{formId}}" (ngSubmit)="save()" #hf="ngForm">
    <div class="row input-field">
      <input id="NAME-{{formId}}" name="name" type="text" required  data-length ="250"  [(ngModel)]="concept.name">
      <label class="active" for="NAME-{{formId}}">Name</label>
    </div>

    <div class="row input-field">
      <textarea id="DESC-{{formId}}" name="description"
        class="materialize-textarea" required  data-length ="10000" [(ngModel)]="concept.description">
      </textarea>
      <label class="active" for="DESC-{{formId}}">Description</label>
    </div>

    <qddt-rational
      *ngIf="!readonly && isVisible"
      [formName]="'RationalComp'"
      [element]="concept"
      [config]="{hidden: [2,3]}">
    </qddt-rational>

    <qddt-element-footer [element]="concept"></qddt-element-footer>

    <div class="row right-align" *ngIf="!readonly">
      <button type="submit" class="btn btn-default" [disabled]="!hf.form.valid" >Submit</button>
    </div>
  </form>
</div>
`
})
export class ConceptEditComponent implements  OnChanges {
  @Input() concept: Concept;
  @Output() conceptChanged =  new EventEmitter<Concept>();
  @Input() readonly = false;
  @Input() isVisible = false;

  public readonly formId = Math.round( Math.random() * 10000);
  public showRevision = false;

  constructor(private service: TemplateService) { }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && changes.isVisible.currentValue && !changes.isVisible.previousValue) {
      M.updateTextFields();
    }
  }

  save() {
    this.service.update<Concept>(this.concept)
      .subscribe((result) => {
        this.concept = result;
        this.conceptChanged.emit(result);
        this.isVisible = false;
      });
  }

}
