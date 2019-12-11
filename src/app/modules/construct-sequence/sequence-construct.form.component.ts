import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ActionKind,
  ElementKind, ElementRevisionRef,
  LANGUAGE_MAP,
  SequenceConstruct, SequenceKind,
  TemplateService, toSelectItems
} from '../../lib';

@Component({
  selector: 'qddt-sequence-form',
  templateUrl: './sequence-construct.form.component.html',
})

export class SequenceFormComponent implements OnChanges {
  @Input() sequence: SequenceConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<SequenceConstruct>();

  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly SEQUENCE_MAP = toSelectItems(SequenceKind);
  public readonly formId = Math.round( Math.random() * 10000);

  public showProgressBar = false;
  public currentSequenceKind: SequenceKind = SequenceKind.SECTION;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.SEQUENCE_CONSTRUCT);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sequence) {
      this.currentSequenceKind = SequenceKind[this.sequence.sequenceKind];
    }
  }

  public onSave() {
    this.service.update<SequenceConstruct>(this.sequence).subscribe(
      (result) => {
          this.sequence = result;
          this.modifiedEvent.emit(result); },
      (error) => { throw error; }
    );
  }

  public onSelectChange(event) {
    this.currentSequenceKind = event;
  }

  public onItemRemoved(ref: ElementRevisionRef) {
    console.log('onItemRemoved -> ' + ref || JSON);
    this.sequence.sequence =
      this.sequence.sequence.filter( f => !(f.elementId === ref.elementId && f.elementRevision === ref.elementRevision) );
  }

  public onItemAdded(ref: ElementRevisionRef) {
    console.log('onItemAdded -> ' + ref || JSON);
    this.sequence.sequence.push(ref);
  }

  public onItemModified(ref: ElementRevisionRef) {
    console.log('onItemModified -> ' + ref || JSON);
    const idx = this.sequence.sequence.findIndex(f => f.elementId === ref.elementId && f.elementRevision === ref.elementKind );
    this.sequence.sequence =
      this.sequence.sequence.concat(
        this.sequence.sequence.slice(0, idx - 1),
        ref,
        this.sequence.sequence.slice(idx + 1)
      );
  }


}

