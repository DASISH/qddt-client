import { Component, Input, AfterViewInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  ElementKind,
  ElementRevisionRef,
  IElement,
  IRevisionRef,
  TemplateService, CONSTRUCT_MAP, ActionKind, MessageService, Parameter, InstrumentElement
} from '../../lib';


@Component({
  selector: 'qddt-instrument-sequence',
  templateUrl: './instrument-sequence.component.html'
})

export class InstrumentSequenceComponent implements AfterViewInit {
  @Input() sequence: InstrumentElement[];
  @Input() readonly = false;
  @Input() level = 0;
  @Input() inParameters: Map<string, Parameter>;
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


  ngAfterViewInit(): void { }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
    }
    return this._modalRef;
  }


  public onRevisionSelect(ref: ElementRevisionRef) {
    const insSeq = new InstrumentElement(ref);
    ref.element.sequence.forEach((seq: ElementRevisionRef) => {
      const newSeq = new InstrumentElement(seq);
      insSeq.sequence.push(newSeq);
    });
    console.log(insSeq || JSON);
    this.sequence.push(insSeq);
  }


  public onDismiss() {
    this.modalRef.close();
  }

  public onSelectOption(value) {
    this.SOURCE = { element: '', elementKind: value };
    console.log(this.SOURCE);
  }

  public doAdd() {
    this.modalRef.open();
  }

}
