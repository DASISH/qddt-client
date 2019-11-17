import { Component, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { Concept, TemplateService } from '../../../lib';



@Component({
  selector: 'qddt-concept-edit',
  providers: [{ provide: 'elementKind', useValue: 'CONCEPT' },],
  template: `
<div *ngIf="(concept && isVisible)">
  <form class="row" id="{{formId}}" (ngSubmit)="save()" #hf="ngForm">
    <div class="col s12 input-field">
      <input name="name" type="text" required  data-length ="250"  [(ngModel)]="concept.name">
      <label class="active">Name</label>
    </div>

    <div class="col s12 input-field">
      <textarea  name="description"
        class="materialize-textarea" required  data-length ="10000" [(ngModel)]="concept.description">
      </textarea>
      <label class="active">Description</label>
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
export class ConceptEditComponent implements AfterViewInit {
  @Input() concept: Concept;
  @Output() conceptChanged = new EventEmitter<Concept>();
  @Input() readonly = false;
  @Input() isVisible = false;

  public readonly formId = Math.round(Math.random() * 10000);
  public showRevision = false;

  constructor(private service: TemplateService) { }
  //
  //
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.isVisible && changes.isVisible.currentValue && !changes.isVisible.previousValue) {
  //   }
  // }

  save() {
    this.service.update<Concept>(this.concept)
      .subscribe((result) => {
        this.concept = result;
        this.conceptChanged.emit(result);
        this.isVisible = false;
      });
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

}
