import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PublicationService, Publication } from './publication.service';

@Component({
  selector: 'qddt-publication-detail',
  moduleId: module.id,
  templateUrl: './publication.detail.component.html',
  providers: [PublicationService],
})

export class PublicationDetailComponent {
  @Input() publication: Publication;
  @Input() publications: Publication[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  controlConstructsActions = new EventEmitter<string>();
  private revisionIsVisible: boolean;

  constructor(private service: PublicationService) {
    this.revisionIsVisible = false;
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
}
