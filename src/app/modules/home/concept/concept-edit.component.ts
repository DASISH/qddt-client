import {Component, Input, EventEmitter, Output, AfterViewInit, AfterContentChecked} from '@angular/core';
import {Concept, TemplateService} from '../../../lib';



@Component({
  selector: 'qddt-concept-edit',
  providers: [ {provide: 'elementKind', useValue: 'CONCEPT'}, ],
  template: `
<div [hidden]="!(concept && isVisible)">
  <form id="{{formId}}" (ngSubmit)="save()" #hf="ngForm">
    <div class="row input-field">
      <input type="text" required  data-length ="250"  [(ngModel)]="concept.name" [ngModelOptions]="{standalone: true}">
      <label>Name</label>
    </div>

    <div class="row input-field">
      <textarea
        class="materialize-textarea" required  data-length ="10000" [(ngModel)]="concept.description" [ngModelOptions]="{standalone: true}">
      </textarea>
      <label>Description</label>
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
export class ConceptEditComponent implements AfterViewInit, AfterContentChecked {
  @Input() concept: Concept;
  @Output() conceptChanged =  new EventEmitter<Concept>();
  @Input() readonly = false;
  @Input() isVisible = false;

  public readonly formId = Math.round( Math.random() * 10000);
  public showRevision = false;

  constructor(private service: TemplateService) { }

  ngAfterContentChecked(): void {
    document.querySelectorAll('textarea').forEach(
      input => M.textareaAutoResize(input));
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
      input => M.CharacterCounter.init(input));
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
