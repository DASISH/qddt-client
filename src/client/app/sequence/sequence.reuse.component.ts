import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ControlConstructKind, ElementTypeDescription, Sequence, SequenceService } from './sequence.service';
import { Subject } from 'rxjs/Subject';
import { ElementKind, QddtElement } from '../preview/preview.service';

@Component({
  selector: 'qddt-sequence-reuse',
  moduleId: module.id,
  templateUrl: './sequence.reuse.component.html',
  styles: [
    '.noItemFound { border: thick solid red; }',
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class SequenceReuseComponent implements OnInit {
  @Input() sequence: Sequence;
  @Output() element: any = new EventEmitter<any>();

  private readonly elementTypes = ElementTypeDescription;

  private searchKeysSubect: Subject<string> = new Subject<string>();
  // private ccKindAsString: string;
  private selectedElement: any;
  private selectedType: ElementKind;
  private elements:any;


  constructor(private service: SequenceService) {
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getElements(this.eKind2ccKind(this.selectedType), name)
          .then((result: any) => {
            this.elements = result.content;
          }, (error: any) => {
            throw error;
          });
      });
  }

  ngOnInit() {
    this.onSelectElementType(ElementKind.QUESTION_CONSTRUCT);
  }

  onSelectElementType(id: ElementKind) {
    this.selectedType = id;
    this.selectedElement = null;
    this.elements = [];
    console.info(ElementKind[id] + ' ' + id + ' ' + this.getQddtElements(id).label);
  }

  onSelectElement(element: any) {
    this.selectedElement = element;
    console.info(element);
  }

  onSearchElements(key: string) {
    this.searchKeysSubect.next(key);
  }

  searchSequences(key: string) {
    this.service.getElements(this.eKind2ccKind(this.selectedType), key)
      .then((result: any) => {
        this.elements = result.content;
      }, (error: any) => {
       throw error;
      });
  }

  private getQddtElements(id: ElementKind): QddtElement {
    return this.elementTypes.find(e => e.id === id);
  }


  private  eKind2ccKind(id: ElementKind): ControlConstructKind {
    return ControlConstructKind[ElementKind[id]];
  }


}
