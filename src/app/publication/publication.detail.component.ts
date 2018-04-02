import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PublicationService, Publication, PublicationStatus, PUBLICATION_TYPES } from './publication.service';
import { PropertyStoreService } from '../core/global/property.service';
import { QddtElement } from '../interfaces/elements';
const filesaver = require('file-saver');

@Component({
  selector: 'qddt-publication-detail',
  moduleId: module.id,
  templateUrl: './publication.detail.component.html',
})

export class PublicationDetailComponent implements OnInit {
  @Input() publication: Publication;
  @Input() publicationId: string;
  @Input() publications: Publication[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();

  public controlConstructsActions = new EventEmitter<string>();
  public selectOptions: PublicationStatus[];
  public selectedOptionValue: number;
  public selectedPublicationStatusOption: any;
  public showProgressBar = true;

  private revisionIsVisible: boolean;

  constructor(private service: PublicationService, private property: PropertyStoreService) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    this.selectedOptionValue = 0;
    if (this.publicationId) {
      this.showProgressBar = true;
      this.service.getPublication(this.publicationId).then(
        (result: any) => {
          this.publication = result;
          const status = this.service.getPublicationStatusAsList().find(ps => ps.label === this.publication.status);
          if (status) {
            this.selectedPublicationStatusOption = status.description;
            this.selectedOptionValue = status.id;
          }
          this.showProgressBar = false;
        });
    }
  }



  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onUpdatePublication() {
    this.service.update(this.publication).subscribe((result: any) => {
        const index = this.publications.findIndex((e: any) => e.id === result.id);
        if (index >= 0) {
          this.publications[index] = result;
        } else {
          this.publications.push(result);
        }
        this.hideDetail();
      });
  }

  getElementbyLabel(label: string): QddtElement {
    const element: QddtElement = PUBLICATION_TYPES.find(e => e.label === label);
    if (element === undefined) {
      console.log('Couldn\'t find kind label ' + label);
    }
    return element;
  }


  getPdf(element: Publication) {
    const fileName = element.name + '.pdf';
    this.service.getPdf(element.id).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }
}
