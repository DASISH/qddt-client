import { Component, Output, EventEmitter, Input, OnInit, AfterContentChecked, OnChanges, SimpleChanges } from '@angular/core';
import { ControlConstructService, SequenceConstruct } from '../controlconstruct.service';
import { ElementRevisionRef, IElementRef, ElementKind, QDDT_ELEMENTS } from '../../shared/elementinterfaces/elements';
import { IEntityEditAudit } from '../../shared/elementinterfaces/entityaudit';
import { TemplateService } from '../../template/template.service';
import { Page } from '../../shared/table/table.page';

declare var Materialize: any;

@Component({
  selector: 'qddt-sequence-form',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.form.component.html',
  styles: [ ]
})

export class SequenceFormComponent implements OnChanges {
  @Input() sequence: SequenceConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<SequenceConstruct>();

  public readonly QUESTION = QDDT_ELEMENTS[ElementKind.QUESTION_CONSTRUCT];
  public selectedElement: IEntityEditAudit;
  public questionConstrucs: IEntityEditAudit[];

  constructor(private service: ControlConstructService) { }

  ngOnChanges(changes: SimpleChanges): void {
    Materialize.updateTextFields();
  }


  onSaveSequence() {
    this.service.updateSequence(this.sequence)
    .subscribe(
      (result) => {
        this.sequence = result;
        if (this.modifiedEvent) { this.modifiedEvent.emit(result); }},
      (error) => { throw error; }
    );
  }

  public onSelectElement(ref ) {
    const kind =  this.service.getElementKind(ref.classKind);
    this.service.getRevisionsByKind(kind, ref.id).then(
      (result) => {
        this.questionConstrucs = result.content;
      },
      ( error ) => {} );
  }
  public onSearchElements(search: string) {
    this.service.searchByKind(ElementKind.QUESTION_CONSTRUCT, search, new Page( { size: 15 } ) ).then(
      (result) => { this.questionConstrucs = result; },
      (error) => { throw error; } );
  }

  public onSelectCanceled(value: Boolean) {
    this.selectedElement = null;
  }

  public onRevisionSelected(ref: ElementRevisionRef) {
    this.sequence.sequence.push(ref);
  }


}

