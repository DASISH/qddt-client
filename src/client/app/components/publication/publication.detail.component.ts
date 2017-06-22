import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PublicationService, ElementTypes, Publication, PublicationStatus, PUBLICATIONNOTPUBLISHED } from './publication.service';
// import * as fileSaver from 'file-saver';
let fileSaver = require('../../common/file-saver');

@Component({
  selector: 'qddt-publication-detail',
  moduleId: module.id,
  templateUrl: './publication.detail.component.html',
  providers: [PublicationService],
})

export class PublicationDetailComponent implements OnInit {
  @Input() publication: Publication;
  @Input() publicationId: string;
  @Input() publications: Publication[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  controlConstructsActions = new EventEmitter<string>();
  selectOptions: any[] = PublicationStatus;
  selectedOptionValue: number;
  selectedPublicationStatusOption: any;
  private revisionIsVisible: boolean;
  private predefinedStatus: any[];

  constructor(private service: PublicationService) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    this.predefinedStatus = [PUBLICATIONNOTPUBLISHED].concat(this.selectOptions[0].children,
      this.selectOptions[1].children);
    this.selectedOptionValue = 0;
    this.selectedPublicationStatusOption = PUBLICATIONNOTPUBLISHED.description;
    if(this.publicationId !== null && this.publicationId !== undefined) {
      this.service.getPublication(this.publicationId)
        .subscribe((result: any) => {
          this.publication = result;
          this.publication['workinprogress'] = this.publication['changeKind'] === 'IN_DEVELOPMENT';
          let status = this.predefinedStatus.find(e => e.label === this.publication.status);
          if(status !== undefined) {
            this.selectedPublicationStatusOption = status.description;
            this.selectedOptionValue = status.id;
          }
        }, (error: any) => console.log(error));
    }
  }

  onSelectChange(value: number) {
    if(typeof value === 'string') {
      value = parseInt(value);
    }
    let status:any = this.predefinedStatus.find((e: any) => e.id === value);
    if(status !== undefined) {
      this.publication.status = status.label;
      this.selectedPublicationStatusOption = status.description;
    }
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onUpdatePublication() {
    this.service.update(this.publication).subscribe((result: any) => {
        let index = this.publications.findIndex((e:any) => e.id === result.id);
        if(index >= 0) {
          this.publications[index] = result;
        }
        this.hideDetail();
      }, (error: any) => {
        console.log(error);
      });
  }

  getElementType(e: any) {
    let type: any = ElementTypes.find(el => el.type === e.elementKind);
    if(type !== undefined) {
      return type.id;
    }
    return null;
  }

  onDeleteElement(index: number) {
    if(index < this.publication.publicationElements.length) {
      this.publication.publicationElements.splice(index, 1);
    }
  }

  addElement(e: any) {
    this.publication.publicationElements.push(e);
  }

  getPdf(element: Publication) {
    let fileName = element.name + '.pdf';
    this.service.getPdf(element.id).subscribe(
      (data: any) => {
        fileSaver(data, fileName);
      },
      error => console.log(error));
  }

}
