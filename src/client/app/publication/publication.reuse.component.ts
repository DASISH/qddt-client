import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PublicationService } from './publication.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
// import { isUndefined } from 'util';
import { ElementKind, QddtElementType, QddtElementTypes } from '../shared/preview/preview.service';

@Component({
  selector: 'qddt-publication-reuse',
  moduleId: module.id,
  templateUrl: './publication.reuse.component.html',
  styles: [
    `label, [type="radio"] + label {
      padding-left: 25px;
    }`,
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  providers: [ PublicationService ],
})

export class PublicationReuseComponent implements OnInit {
  @Input() showbutton: boolean;
  @Output() publicationElement: any = new EventEmitter<any>();
  showAddElement = false;
  showReplayElement = false;
  error: any;

  modalActions = new EventEmitter<string|MaterializeAction>();
  queryFields: QddtElementType[] = [
    QddtElementTypes[ElementKind.TOPIC_GROUP],
    QddtElementTypes[ElementKind.CONCEPT],
    QddtElementTypes[ElementKind.QUESTIONITEM],
    QddtElementTypes[ElementKind.QUESTION_CONSTRUCT],
    QddtElementTypes[ElementKind.SEQUENCE_CONSTRUCT]
  ];

  elements: any[];
  private selectedElementKind: ElementKind;
  private selectedElement: any;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private service: PublicationService) {
    this.selectedElementKind = ElementKind.TOPIC_GROUP;
    this.elements = [];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.searchElements(this.selectedElementKind, name)
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

  onSelectElementKind(kind: ElementKind) {
    this.selectedElementKind = kind;
    this.selectedElement = null;
    this.elements = [];
  }

  onSelectElement(e: any) {
    console.info('onSelectElement');
    this.selectedElement = e;
  }

  onSearchElements(key: string) {
    this.searchKeysSubect.next(key);
  }

  onToggleAddElement() {
    this.showAddElement = !this.showAddElement;
    if (!this.showAddElement) {
      this.selectedElement = null;
    }
  }

  onUse(element: any) {
    console.info('onUse');
    this.publicationElement.emit(element);
    this.showAddElement = false;
    this.selectedElement = null;
    return false;
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