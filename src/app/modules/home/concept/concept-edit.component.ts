import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import {Concept, TemplateService} from '../../../lib';

declare var $: any;

@Component({
  selector: 'qddt-concept-edit',
  providers: [ {provide: 'elementKind', useValue: 'CONCEPT'}, ],
  template: `
<div *ngIf="concept && isVisible" class="row " id="{{formId}}"  >
  <form class="col s11 " (ngSubmit)="save()" #hf="ngForm">

    <div class="row input-field">
      <input id="name-{{formId}}" type="text" required  data-length ="250"  [(ngModel)]="concept.name" [ngModelOptions]="{standalone: true}">
      <label for="name-{{formId}}">Name</label>
    </div>

    <div class="row input-field">
      <textarea
        id="desc-{{formId}}" class="materialize-textarea" required  data-length ="10000" [(ngModel)]="concept.description" [ngModelOptions]="{standalone: true}">
      </textarea>
      <label for="desc-{{formId}}">Description</label>
    </div>

    <qddt-rational
      *ngIf="!readonly"
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
export class ConceptEditComponent implements OnChanges {
  @Input() concept: Concept;
  @Output() conceptChanged =  new EventEmitter<Concept>();
  @Input() readonly = false;
  @Input() isVisible = false;

  public readonly formId = Math.round( Math.random() * 10000);
  public showRevision = false;

  constructor(private service: TemplateService) { }

  ngOnChanges(changes: SimpleChanges): void {
    $('#' + this.formId + '-desc').trigger('autoresize');
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
