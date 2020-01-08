import { Component, Input, AfterViewInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  HEADER_DETAILS,
  ElementKind,
  ElementRevisionRef,
  IElement,
  IRevisionRef,
  getElementKind, InstrumentSequence, getIcon, TemplateService, CONSTRUCT_MAP, ActionKind, MessageService
} from '../../lib';


@Component({
  selector: 'qddt-instrument-sequence',
  templateUrl: './instrument-sequence.component.html'
})

export class InstrumentSequenceComponent implements OnChanges {
  @Input() sequence: InstrumentSequence[];
  @Input() readonly = false;
  @Input() level = 0;
  @Output() actionEvent = new EventEmitter<{ action: ActionKind, ref: ElementRevisionRef }>();

  public readonly modalId = Math.round(Math.random() * 10000);
  public readonly selectOptions = CONSTRUCT_MAP;
  public readonly SEQUENCE = ElementKind.SEQUENCE_CONSTRUCT;
  public selectId = 0;
  public SOURCE: IElement | IRevisionRef | null;
  // tslint:disable-next-line:variable-name
  private _modalRef: M.Modal;


  private action = ActionKind.Create;

  constructor(private service: TemplateService, public message: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.sequence || JSON);
  }


  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
    }
    return this._modalRef;
  }


  public onRevisionSelect(ref: ElementRevisionRef) {
    const insSeq = new InstrumentSequence();
    insSeq.elementRef = ref;
    ref.element.sequence.forEach((seq: ElementRevisionRef) => {
      const newSeq = new InstrumentSequence();
      newSeq.elementRef = seq;
      insSeq.sequence.push(newSeq);
    });
    console.log(insSeq || JSON);
    this.sequence.push(insSeq);
  }


  public onDismiss() {
    console.log('dissmiss');
  }

  public onSelectOption(value) {
    this.SOURCE = { element: '', elementKind: value };
    console.log(this.SOURCE);
  }


}
