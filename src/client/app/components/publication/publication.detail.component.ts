import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PublicationService, DEMO, ElementTypes, Publication, PublicationStatus, PUBLICATIONNOTPUBLISHED } from './publication.service';

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
  actions = new EventEmitter<string>();
  selectOptions: any[] = PublicationStatus;
  selectedOptionValue: number;
  selectedPublicationStatusOption: any;
  private selectedElementDetail: any;
  private selectedElementType: number;
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
          //TODO this.publication = result;
          this.publication = DEMO;
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

  onElementDetail(e: any) {
    this.selectedElementDetail = e.element;
    let type = ElementTypes.find(el => el.type === e.elementKind);
    if(type !== undefined) {
      this.selectedElementType = type.id;
      this.actions.emit('openModal');
    }
  }

  onDeleteElement(index: number) {
    if(index < this.publication.publicationElements.length) {
      this.publication.publicationElements.splice(index, 1);
    }
  }

  addElement(e: any) {
    this.publication.publicationElements.push(e);
  }

}