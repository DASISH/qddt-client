import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PublicationService } from './publication.service';
import { Subject } from 'rxjs/Subject';
import { ElementRevisionRef, ElementKind, QddtElement, QDDT_ELEMENTS } from '../shared/elementinterfaces/elements';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';

@Component({
  selector: 'qddt-publication-reuse',
  moduleId: module.id,
  templateUrl: './publication.reuse.component.html',
  styles: [
    `label, [type="radio"] + label { padding-left: 25px; }`,
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class PublicationReuseComponent implements OnInit {
  @Input() showbutton: boolean;
  @Output() publicationElement = new EventEmitter<ElementRevisionRef>();

  public showAddElement = false;
  public selectedElementKind: ElementKind;
  public selectedElement: IEntityAudit;
  public elements: any[];

  queryFields: QddtElement[] = [
    QDDT_ELEMENTS[ElementKind.TOPIC_GROUP],
    QDDT_ELEMENTS[ElementKind.CONCEPT],
    QDDT_ELEMENTS[ElementKind.QUESTION_ITEM],
    QDDT_ELEMENTS[ElementKind.QUESTION_CONSTRUCT],
    QDDT_ELEMENTS[ElementKind.SEQUENCE_CONSTRUCT]
  ];

  private searchKeysListener: Subject<string> = new Subject<string>();

  constructor(private service: PublicationService) {
    this.selectedElementKind = ElementKind.TOPIC_GROUP;
    this.elements = [];
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.searchElements(this.selectedElementKind, name)
          .then((result: any) => {
            this.elements = result.content;
          });
      });
  }

  ngOnInit() {
    //
  }

  onSelectElementKind(kind: ElementKind) {
    this.selectedElementKind = kind;
    this.selectedElement = null;
    this.elements = [];
  }

  onSelectElement(e: any) {
    // console.info('onSelectElement');
    this.selectedElement = e;
  }

  onSearchElements(key: string) {
    this.searchKeysListener.next(key);
  }

  onToggleAddElement() {
    this.showAddElement = !this.showAddElement;
    if (!this.showAddElement) {
      this.selectedElement = null;
    }
  }

  onPreviewSelected(element: ElementRevisionRef) {
    // console.info('onUse');
    this.publicationElement.emit(element);
    this.showAddElement = false;
    this.selectedElement = null;
    return false;
  }


  private getElementType(kind: ElementKind): QddtElement {
     const element: any = this.queryFields.find(e => e.id === kind);
     if (element === undefined) {
       throw new Error('Couldn\'t find kind ' + ElementKind[kind] + ' ' + kind);
     }
     return element;
  }

}
