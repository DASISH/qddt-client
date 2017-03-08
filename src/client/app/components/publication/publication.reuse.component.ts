import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes } from './publication.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'qddt-publication-reuse',
  moduleId: module.id,
  templateUrl: './publication.reuse.component.html',
  styles: [
    `label, [type="radio"] + label {
      padding-left: 25px;
    }
    .left {
      padding-right: 20px;
    }`
  ],
  providers: [ PublicationService ],
})

export class PublicationReuseComponent implements OnInit {
  @Output() element: any = new EventEmitter<any>();
  showAddElement: boolean = false;
  showReplayElement: boolean = false;
  error: any;
  elementTypes: any[] = ElementTypes;
  actions = new EventEmitter<any>();

  private elementType: number;
  private elements: any[];
  private selectedElement: any;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private service: PublicationService) {
    this.elementType = 3;
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

  onSelectElementType(id: number) {
    this.elementType = id;
    this.selectedElement = null;
    this.elements = [];
  }

  onSelectElement(e: any) {
    this.selectedElement = e;
  }

  onSearchElements(key: string) {
    this.searchKeysSubect.next(key);
  }

  onToggleAddElement() {
    this.showAddElement = !this.showAddElement;
    if(!this.showAddElement) {
      this.selectedElement = null;
    }
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
