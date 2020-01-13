import {Component, Input, EventEmitter, Output, AfterContentInit} from '@angular/core';
import {
  ElementKind,
  ElementRevisionRef,
  IElement,
  IRevisionRef,
  getElementKind, InstrumentSequence, getIcon, TemplateService, CONSTRUCT_MAP, ActionKind, MessageService
} from '../../lib';
import {Router} from '@angular/router';



@Component({
  selector: 'qddt-instrument-sequence-tree',
  styles: [
    'ul.collapsible { padding: 1px; border: 0; margin-top:0; margin-bottom: 0; }',
    'ul.collapsible  ul.collapsible {  margin-left: 1rem; }',
    '.collapsible-header {padding: 0.75rem; }',
    '.collapsible-header:hover > ul.dropleft { display:block; }',
  ],
  templateUrl: './instrument-sequence-tree.component.html'
})

export class InstrumentSequenceTreeComponent implements AfterContentInit {
  @Input() subSequence: InstrumentSequence[];
  @Input() readonly = false;
  @Input() level = 0;
  @Output() actionEvent = new EventEmitter<{ action: ActionKind, ref: InstrumentSequence }>();

  public readonly modalId = Math.round(Math.random() * 10000);
  public readonly selectOptions = CONSTRUCT_MAP;
  public readonly SEQUENCE = ElementKind.SEQUENCE_CONSTRUCT;
  public selectId = 0;
  public SOURCE: IElement | IRevisionRef | null;
  // tslint:disable-next-line:variable-name
  private _showButton = false;
  private action = ActionKind.Create;

  constructor(private service: TemplateService, public message: MessageService, private router: Router) {

  }

  ngAfterContentInit(): void {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));
  }

  get showButton(): boolean {
    return this._showButton;
  }
  set showButton(value: boolean) {
    // if (value) {
    //   this._ShowRef = true;
    // }
    this._showButton = value;
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
    this.subSequence.push(insSeq);
  }


  public onDismiss() {
    console.log('dissmiss');
  }

  public onOpenBody(item: InstrumentSequence) {

    if (!item.elementRef.element && !this.isSequence(item.elementRef.elementKind)) {
      this.service.getByKindRevision(
        getElementKind(item.elementRef.elementKind),
        item.elementRef.elementId,
        item.elementRef.elementRevision)
        .then((result) => {
          item.elementRef.element = result.entity;
          item.elementRef.version = result.entity.version;
        });
    }
  }

  public isSequence(kind: ElementKind | string): boolean {
    return getElementKind(kind) === this.SEQUENCE;
  }

  public onItemEdit(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    console.log(cqi || JSON);
    this.service.searchByUuid(cqi.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }


  public onSelectOption(value) {
    this.SOURCE = { element: '', elementKind: value };
    console.log(this.SOURCE);
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

}
