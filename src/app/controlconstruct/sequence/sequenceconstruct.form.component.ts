import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SequenceConstruct } from '../controlconstruct.classes';
import { QDDT_QUERY_INFOES } from '../../shared/classes/constants';
import { ElementKind } from '../../shared/classes/enums';
import { IEntityEditAudit } from '../../shared/classes/interfaces';
import { ElementRevisionRef, Page } from '../../shared/classes/classes';
import { TemplateService } from '../../template/template.service';

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

  public readonly QUESTION = ElementKind.QUESTION_CONSTRUCT;
  public selectedElement: IEntityEditAudit;
  public questionConstrucs: IEntityEditAudit[];

  constructor(private service: TemplateService) { }

  ngOnChanges(changes: SimpleChanges): void {
    Materialize.updateTextFields();
  }


  onSaveSequence() {
    this.service.update(this.sequence)
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
        this.questionConstrucs = result.content.map( e => e.entity);
      },
      ( error ) => { throw error; } );
  }
  public onSearchElements(search: string) {
    this.service.searchByKind(ElementKind.QUESTION_CONSTRUCT, search, new Page( { size: 15 } ) ).then(
      (result) => { this.questionConstrucs = result.content; },
      (error) => { throw error; } );
  }

  public onSelectCanceled(value: Boolean) {
    this.selectedElement = null;
  }

  public onRevisionSelected(ref: ElementRevisionRef) {
    this.sequence.sequence.push(ref);
  }


}

