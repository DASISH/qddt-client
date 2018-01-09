import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElementTypeDescription, SequenceService } from './sequence.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind, QddtElementType, QddtElementTypes } from '../shared/preview/preview.service';

@Component({
  selector: 'qddt-sequence-reuse',
  moduleId: module.id,
  templateUrl: './sequence.reuse.component.html',
  styles: [
    `.noItemFound {
        border: thick solid red;
    }`
  ],
  providers: [SequenceService],
})

export class SequenceReuseComponent implements OnInit {
  @Output() element: any = new EventEmitter<any>();
  showAddElement = false;
  showReplayElement = false;
  error: any;
  elementTypeDescription: any = ElementTypeDescription;
  modalActions = new EventEmitter<string|MaterializeAction>();

  elements: any[];
  private elementType: string;
  private selectedElement: any;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  private queryFields: QddtElementType[] = [
    QddtElementTypes[ElementKind.SEQUENCE_CONSTRUCT],
    QddtElementTypes[ElementKind.QUESTION_CONSTRUCT],
    QddtElementTypes[ElementKind.CONDITION_CONSTRUCT],
    QddtElementTypes[ElementKind.STATEMENT_CONSTRUCT]
  ];

  constructor(private service: SequenceService) {
    this.elementType = this.elementTypeDescription[0].name;
    this.elements = [];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getElements(this.elementType, name)
          .then((result: any) => {
            this.elements = result.content;
          }, (error: any) => {
            this.popupModal(error);
          });
      });
  }

  ngOnInit() {
    //
  }

  onSelectElementType(name: string) {
    this.elementType = name;
    this.selectedElement = null;
    this.elements = [];
  }

  onSelectElement(e: any) {
    this.selectedElement = e;
  }

  onSearchElements(key: string) {
    this.searchKeysSubect.next(key);
  }

  searchSequences(key: string) {
    this.service.getElements(this.elementType, key)
      .then((result: any) => {
        this.elements = result.content;
      }, (error: any) => {
        this.popupModal(error);
      });
  }

  onCreateStatement() {
    this.modalActions.emit({action: 'modal', params: ['open']});
    return false;
  }

  onCreateCondition() {
    this.modalActions.emit({action: 'modal', params: ['open']});
    return false;
  }

  onUse() {
    this.element.emit(this.selectedElement);
    this.showAddElement = false;
    this.selectedElement = null;
    return false;
  }

  onGetElement(element) {
    this.selectedElement = element;
  }

  private popupModal(error: any) {
    this.error = error;
  }

  private getElementType(kind: ElementKind): QddtElementType {
    const element: any = this.queryFields.find(e => e.id === kind);
    if (element === undefined)
      console.log('Couldn\'t find kind ' + ElementKind[kind] + ' ' + kind);
    return element;
  }

}
