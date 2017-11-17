import { Component, Input, Output, EventEmitter, OnInit, AfterContentChecked } from '@angular/core';
import { Publication, PUBLICATION_STATUS, PUBLICATION_NOT_PUBLISHED, PUBLICATION_TYPES } from './publication.service';
import { ElementKind, QddtElementType } from '../../shared/preview/preview.service';

declare var Materialize:any;

@Component({
  selector: 'qddt-publication-form',
  moduleId: module.id,
  templateUrl: './publication.form.component.html',
  providers: [],
})

export class PublicationFormComponent implements OnInit ,AfterContentChecked {
  @Input() publication: Publication;
  @Input() textColor:any;
  @Output() save: EventEmitter<Publication> = new EventEmitter<Publication>();

  selectOptions: any[] = PUBLICATION_STATUS;
  selectedOptionValue: number;
  selectedPublicationStatusOption: any;
  predefinedStatus: any;
  private revisionIsVisible: boolean;


  ngOnInit() {
    this.predefinedStatus = [PUBLICATION_NOT_PUBLISHED].concat(this.selectOptions[0].children,this.selectOptions[1].children);
    this.selectedOptionValue = 0;
    this.selectedPublicationStatusOption = PUBLICATION_NOT_PUBLISHED.description;
  }

  ngAfterContentChecked() {
    Materialize.updateTextFields();
    this.selectedOptionValue = this.getPublicationStatusId(this.publication.status);
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
    if(typeof value === 'string') {
      value = parseInt(value);
    }
    let status:any = this.predefinedStatus.find((e: any) => e.id === value);
    if(status !== undefined) {
      this.publication.status = status.label;
      this.selectedPublicationStatusOption = status.description;
      this.selectedOptionValue = status.id;
    } else {
      console.log('status ' + status);
    }
  }

  private getElementbyLabel(label:string): QddtElementType {
    let element:QddtElementType = PUBLICATION_TYPES.find(e => e.label === label);
    if (element === undefined)
      console.log('Couldn\'t find kind label ' + label);
    return element;
  }

private getPublicationStatusId(label:string):number {
    let id:number =  this.predefinedStatus.find((e: any) => e.label === label).id;
  if (id === undefined)
    console.log('Couldn\'t find kind id ' + label );
    return id;
}

}
