import { Component } from '@angular/core';
import {Publication, PublicationService} from './publication.service';
import {IEntityEditAudit} from '../shared/elementinterfaces/entityaudit';
import {Action, IDetailAction} from '../shared/elementinterfaces/detailaction';


@Component({
  selector: 'qddt-publication-detail',
  moduleId: module.id,
  templateUrl: './publication.detail.component.html',
})

export class PublicationDetailComponent {

  public item: IEntityEditAudit;

  constructor(private service: PublicationService) {
  }

  onItemSelect(event: IEntityEditAudit) {
    this.item = event;
  }

  onClose(action: IDetailAction) {
    if (action.action === Action.Delete) {
    }
    console.log(action);
  }


  onPublicationSaved(item: Publication) {
    this.service.update(item).subscribe((result) => {
      // const index = this.publications.findIndex((e: any) => e.id === result.id);
      // if (index >= 0) {
      //   this.publications[index] = result;
      // } else {
      //   this.publications.push(result);
      // }
      // this.hideDetail();
    });
  }
}

