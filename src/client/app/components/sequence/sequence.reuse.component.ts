import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElementTypeDescription, SequenceService } from './sequence.service';

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
  showAddElement: boolean = false;
  showReplayElement: boolean = false;
  error: any;
  elementTypeDescription: any = ElementTypeDescription;
  actions = new EventEmitter<any>();

  private searchKeys: string;
  private elementType: string;
  private elements: any[];
  private selectedElement: any;

  constructor(private service: SequenceService) {
    this.searchKeys = '';
    this.elementType = this.elementTypeDescription[0].name;
    this.elements = [];
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
    this.service.getElements(this.elementType, key)
      .subscribe((result: any) => {
        this.elements = result.content;
      }, (error: any) => {
        this.popupModal(error);
      });
  }

  searchSequences(key: string) {
    this.service.getElements(this.elementType, key)
      .subscribe((result: any) => {
        this.elements = result.content;
      }, (error: any) => {
        this.popupModal(error);
      });
  }

  onCreateStatement() {
    this.actions.emit('openModal');
    return false;
  }

  onCreateCondition() {
    this.actions.emit('openModal');
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
}
