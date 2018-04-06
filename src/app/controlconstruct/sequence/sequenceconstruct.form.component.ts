import { Component, Output, EventEmitter, Input, OnInit, AfterContentChecked } from '@angular/core';
import { ControlConstructService, SequenceConstruct } from '../controlconstruct.service';
import { ElementRevisionRef, IElementRef } from '../../shared/elementinterfaces/elements';
import { IEntityEditAudit } from '../../shared/elementinterfaces/entityaudit';

declare var Materialize: any;

@Component({
  selector: 'qddt-sequence-form',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.form.component.html',
  styles: [ ]
})

export class SequenceFormComponent implements OnInit, AfterContentChecked {
  @Input() sequence: SequenceConstruct;
  @Input() readonly: Boolean;
  @Output() savedAction = new EventEmitter<SequenceConstruct>();

  selectedElement: IEntityEditAudit;

  constructor(private service: ControlConstructService) { }

  ngOnInit() {
    if (!this.readonly) { this.readonly = false; }
  }

  ngAfterContentChecked() {
    Materialize.updateTextFields();
  }

  onSaveSequence() {
    this.service.updateSequence(this.sequence)
    .subscribe(
      result => {
        this.sequence = result;
        if (this.savedAction) { this.savedAction.emit(result); }},
      error => { throw error; }
    );
  }

  onRevisionSelected(ref: ElementRevisionRef) {
    this.sequence.sequence.push(ref);
  }

  onElementSelected(ref: IElementRef) {
    this.selectedElement = ref.element;
  }

  selectCanceled(value: Boolean) {
    this.selectedElement = null;
  }
}

