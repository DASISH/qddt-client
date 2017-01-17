import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElementTypeDescription, SequenceService } from './sequence.service';
import { Subject } from 'rxjs/Subject';

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

  private elementType: string;
  private elements: any[];
  private selectedElement: any;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private service: SequenceService) {
    this.elementType = this.elementTypeDescription[0].name;
    this.elements = [];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getElements(this.elementType, name)
          .subscribe((result: any) => {
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
