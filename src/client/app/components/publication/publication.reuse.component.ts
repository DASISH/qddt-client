import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes, PublicationElement } from './publication.service';
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
  @Output() publicationElement: any = new EventEmitter<any>();
  showAddElement: boolean = false;
  showReplayElement: boolean = false;
  error: any;
  elementTypes: any[] = ElementTypes;
  actions = new EventEmitter<any>();
  queryFields: any[] = [
    {id: 1, isMutipleFields: true,
      placeholder: 'Search in module name or description',
      fields: ['name', 'description']},
    {id: 2, isMutipleFields: true,
      placeholder: 'Search in concept name',
      fields: ['name']},
    {id: 3, isMutipleFields: true,
      placeholder: 'Search in question name or question text',
      fields: ['name', ['question','question']]},
    {id: 4, isMutipleFields: false,
      placeholder: 'Search',
      fields: 'name'},
    {id: 5, isMutipleFields: false,
      placeholder: 'Search',
      fields: 'name'},
    {id: 6, isMutipleFields: false,
      placeholder: 'Search',
      fields: 'name'},
  ];

  elements: any[];
  private elementType: number;
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

  onUse(element: any) {
    this.publicationElement.emit(element);
    this.showAddElement = false;
    this.selectedElement = null;
    return false;
  }

  private popupModal(error: any) {
    this.error = error;
  }
}
