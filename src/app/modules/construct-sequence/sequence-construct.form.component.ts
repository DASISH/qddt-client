import { Observable } from 'rxjs';
import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ActionKind,
  SEQUENCE_TYPES,
  ElementKind, ElementRevisionRef,
  LANGUAGE_MAP,
  SequenceConstruct, SequenceKind,
  TemplateService, toSelectItems, Parameter, hasChanges, IElementRef
} from '../../lib';

@Component({
  selector: 'qddt-sequence-form',
  templateUrl: './sequence-construct.form.component.html',
})

export class SequenceFormComponent implements OnChanges {
  @Input() sequence: SequenceConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<SequenceConstruct>();


  public currentSequenceKind: SequenceKind = SequenceKind.SECTION;

  public readonly LANGUAGE_LOOKUP = LANGUAGE_MAP;
  public readonly SEQUENCE_LOOKUP = toSelectItems(SequenceKind);
  public readonly CONSTRUCT = SEQUENCE_TYPES;
  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly formId = Math.round(Math.random() * 10000);

  public inParameters = new Map<string, Parameter>();

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.SEQUENCE_CONSTRUCT);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.sequence)) {
      this.sequence = new SequenceConstruct(changes.sequence.currentValue);
      this.currentSequenceKind = SequenceKind[this.sequence.sequenceKind];
    }
  }

  public onSave() {
    this.service.update<SequenceConstruct>(this.sequence).subscribe(
      (result) => {
        this.sequence = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; }
    );
  }

  public onSelectChange(event) {
    this.currentSequenceKind = event;
  }

  public onDoAction(response) {
    const action = response.action as ActionKind;
    const ref = response.ref as ElementRevisionRef;
    switch (action) {
      case ActionKind.Read: this.onSetParameters(ref); break;
      case ActionKind.Create: this.onItemAdded(ref); break;
      case ActionKind.Delete: this.onItemRemoved(ref); break;
      case ActionKind.Update: this.onItemModified(ref); break;
      default: {
        console.error('wrong action recieved ' + ActionKind[action]);
      }
    }
  }

  private onSetParameters(ref: ElementRevisionRef) {
    this.inParameters = new Map(this.sequence.parameters.map((p) => [p.id, p] as [string, Parameter]));

  }

  public onItemRemoved(ref: ElementRevisionRef) {
    this.sequence.sequence =
      this.sequence.sequence.filter(f => !(f.elementId === ref.elementId && f.elementRevision === ref.elementRevision));
  }

  public onItemAdded(ref: ElementRevisionRef) {
    this.sequence.sequence.push(ref);
  }

  public onItemModified(ref: ElementRevisionRef) {
    const idx = this.sequence.sequence.findIndex(f => f.elementId === ref.elementId);
    const seqNew: ElementRevisionRef[] = [].concat(
      this.sequence.sequence.slice(0, idx),
      ref,
      this.sequence.sequence.slice(idx + 1)
    );
    this.sequence.sequence = seqNew;
  }

  public onRemoveUniverse(item: IElementRef) {
    this.sequence.universe = this.sequence.universe.filter(u => u.id !== item.elementId);
  }

  public isSequence(element?: any | SequenceConstruct): element is SequenceConstruct {
    return (element) && (element as SequenceConstruct).sequence !== undefined;
  }
}

