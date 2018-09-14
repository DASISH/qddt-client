import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { Concept } from '../home.classes';

declare var $: any;

@Component({
  selector: 'qddt-concept-edit',
  moduleId: module.id,
  providers: [],
  template: `
<div *ngIf="concept && isVisible" class="row " id="{{formId}}"  >
  <form (ngSubmit)="save()" #hf="ngForm">

    <div class="row input-field">
      <input name="{{formId}}-name" type="text" [(ngModel)]="concept.name" required>
      <label for="{{formId}}-name">Name</label>
    </div>

    <div class="row input-field">
      <textarea id="{{formId}}-desc" name="{{formId}}-description" class="materialize-textarea"
        [(ngModel)]="concept.description" required >
      </textarea>
      <label for="{{formId}}-desc">Description</label>
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
  @Input() readonly = false;
  @Input() isVisible = false;
  @Output() conceptSavedEvent =  new EventEmitter<any>();

  public readonly formId = Math.round( Math.random() * 10000);

  constructor(private service: HomeService) { }

  ngOnChanges(changes: SimpleChanges): void {
    $('#' + this.formId + '-desc').trigger('autoresize');
  }

  save() {
    this.service.update(this.concept)
      .subscribe((result: any) => {
        this.concept = result;
        this.conceptSavedEvent.emit(result);
        this.isVisible = false;
      });
  }
}
