import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PublicationService, Publication, PUBLICATION_STATUS, PUBLICATION_NOT_PUBLISHED , PUBLICATION_TYPES } from './publication.service';
import { QddtElement } from '../preview/preview.service';
const filesaver = require('file-saver');

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

  public controlConstructsActions = new EventEmitter<string>();
  public selectOptions: any[] = PUBLICATION_STATUS;
  public selectedOptionValue: number;
  public selectedPublicationStatusOption: any;
  public showProgressBar = true;

  private revisionIsVisible: boolean;
  private predefinedStatus: any[];

  constructor(private service: PublicationService) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    this.predefinedStatus = [PUBLICATION_NOT_PUBLISHED].concat(this.selectOptions[0].children,
      this.selectOptions[1].children);
    this.selectedOptionValue = 0;
    this.selectedPublicationStatusOption = PUBLICATION_NOT_PUBLISHED.description;
    if (this.publicationId !== null && this.publicationId !== undefined) {
      this.service.getPublication(this.publicationId)
        .then((result: any) => {
          this.showProgressBar = true;
          this.publication = result;
          const status = this.predefinedStatus.find(e => e.label === this.publication.status);
          if (status !== undefined) {
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
