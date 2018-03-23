import { Component, Input, Output, EventEmitter, OnInit, AfterContentChecked } from '@angular/core';
import { Publication, PUBLICATION_TYPES, PublicationService, PublicationStatus } from './publication.service';
import {ElementKind, QddtElement} from '../preview/preview.service';

declare var Materialize: any;

@Component({
  selector: 'qddt-publication-form',
  moduleId: module.id,
  templateUrl: './publication.form.component.html',
})

export class PublicationFormComponent implements OnInit , AfterContentChecked {
  @Input() publication: Publication;
  @Input() textColor: any;
  @Output() save: EventEmitter<Publication> = new EventEmitter<Publication>();

  selectedOptionValue: number;
  selectedPublicationStatusOption: any;
  selectOptions: PublicationStatus[];

  constructor(private service: PublicationService) {
    this.selectOptions = service.PUBLICATION_STATUSES;
  }

  ngOnInit() {
    this.selectedOptionValue = 0;
    this.selectedPublicationStatusOption =  this.service.getStatusByName('NOTPUBLISHED').description;
  }

  ngAfterContentChecked() {
    Materialize.updateTextFields();
  }

  onSavePublication() {
    this.save.emit(this.publication);
  }


  private deleteElement(index: number) {
    if (index < this.publication.publicationElements.length) {
      this.publication.publicationElements.splice(index, 1);
    }
  }

  private addElement(e: any) {
    this.publication.publicationElements.push(e);
  }

  private onSelectChange(value: any) {
    if (typeof value === 'string') {
      value = parseInt(value);
    }

    const status: any = this.service.getStatusById(value);
    if (status) {
      this.publication.status = status.label;
      this.selectedPublicationStatusOption = status.description;
      this.selectedOptionValue = status.id;
    } else {
      console.log('status ' + status);
    }
  }

  private getElementbyLabel(label: string): QddtElement {
    const element: QddtElement = PUBLICATION_TYPES.find(e => e.label === label);
    if (!element) {
      console.log('Couldn\'t find kind label ' + label);
    }
    return element;
  }

  private getLabelByElement(kind: ElementKind): String {
    let element: QddtElement;
    if (typeof kind === 'string') {
      element =  PUBLICATION_TYPES.find(e => ElementKind[e.id] === kind);
    }  else {
      element = PUBLICATION_TYPES.find(e => e.id === kind);
    }
    return element.label;
  }


}
