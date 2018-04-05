import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SequenceConstruct, ControlConstructService } from '../controlconstruct.service';
import { ElementKind, QddtElement, QDDT_ELEMENTS } from '../../shared/elementinterfaces/elements';

@Component({
  selector: 'qddt-sequence-reuse',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.reuse.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class SequenceReuseComponent implements OnInit {
  @Input() sequence: SequenceConstruct;
  @Input() readonly = false;
  @Output() element: any = new EventEmitter<any>();

  public showButton = false;
  public createConstruct = false;

  private searchKeysSubject: Subject<string> = new Subject<string>();
  private selectedElement: any;
  private selectedRevision: number;
  private selectedType: ElementKind;
  private elements: any;
  private elementRevisions: any[];

  constructor(private service: ControlConstructService) {
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getElements(this.selectedType, name).then(
          (result) => { this.elements = result.content; },
          (error) => { throw error; });
      });
  }

  ngOnInit() {
    this.onSelectElementType(ElementKind.QUESTION_CONSTRUCT);
  }

  onSelectElementType(id: ElementKind) {
    this.selectedType = id;
    this.selectedElement = null;
    this.elements = [];
    // console.info(ElementKind[id] + ' ' + id + ' ' + this.getQddtElements(id).label);
  }

  onSelectElement(element: any) {
    this.selectedElement = element;
    this.service.getRevisions(element.id)
    .then(
      ( result) => this.elementRevisions = result.content,
      ( error ) => { throw error; });
  }

  onSelectElementRevisions(value: any ) {
    this.selectedElement = value;
  }

  onUseItem() { }

  onSearchElements(key: string) {
    this.searchKeysSubject.next(key);
  }

  searchSequences(key: string) {
    this.service.getElements(this.selectedType, key)
      .then((result ) => {
        this.elements = result.content;
      },
      (error ) => { throw error; });
  }

  private getQddtElements(id: ElementKind): QddtElement {
    return QDDT_ELEMENTS.find(e => e.id === id);
  }

}
