import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Publication, PUBLICATION_STATUS, PUBLICATION_NOT_PUBLISHED, PUBLICATION_TYPES } from './publication.service';
import { ElementKind, QddtElementType } from '../../shared/preview/preview.service';
// let fileSaver = require('../../common/file-saver');

@Component({
  selector: 'qddt-publication-form',
  moduleId: module.id,
  templateUrl: './publication.form.component.html',
  providers: [],
})

export class PublicationFormComponent implements OnInit {
  @Input() publication: Publication;
  @Input() textColor:any;
  @Output() save: EventEmitter<Publication> = new EventEmitter<Publication>();
  // controlConstructsActions = new EventEmitter<string>();
  selectOptions: any[] = PUBLICATION_STATUS;
  selectedOptionValue: number;
  selectedPublicationStatusOption: any;
  predefinedStatus: any;


  ngOnInit() {
    this.predefinedStatus = [PUBLICATION_NOT_PUBLISHED].concat(this.selectOptions[0].children,
      this.selectOptions[1].children);
    this.selectedOptionValue = 0;
    this.selectedPublicationStatusOption = PUBLICATION_NOT_PUBLISHED.description;
    console.log(this.publication);
  }

  onSavePublication() {
    console.log(this.publication);
    this.save.emit(this.publication);
  }


  private deleteElement(index: number) {
    if (index < this.publication.publicationElements.length) {
      this.publication.publicationElements.splice(index, 1);
    }
  }

  private addElement(e: any) {
    console.info('addElement');
    this.publication.publicationElements.push(e);
  }

  private onSelectChange(value: number) {
    if(typeof value === 'string') {
      value = parseInt(value);
    }
    let status:any = this.predefinedStatus.find((e: any) => e.id === value);
    if(status !== undefined) {
      this.publication.status = status.label;
      this.selectedPublicationStatusOption = status.description;
    }
    console.log(this.publication);
  }

  private getElementbyLabel(label:string): QddtElementType {
    let element:QddtElementType = PUBLICATION_TYPES.find(e => e.label === label);
    if (element === undefined)
      console.log('Couldn\'t find kind label ' + label);
    return element;
  }



}
