import { Component } from '@angular/core';
import { IEntityEditAudit } from '../shared/elementinterfaces/entityaudit';
import { Action, IDetailAction } from '../shared/elementinterfaces/detailaction';


@Component({
  selector: 'qddt-publication-detail',
  moduleId: module.id,
  templateUrl: './publication.detail.component.html',
})

export class PublicationDetailComponent {

  constructor() {
  }

  onItemSelect(event: IEntityEditAudit) {
    console.log('item selected ' + event );
//    this.item = event;
  }

  onClose(action: IDetailAction) {
    if (action.action === Action.Delete) {
    }
    console.log(action);
  }


  onPublicationSaved(item: IEntityEditAudit) {
    console.log('onPublicationSaved ' + item);
  }
}

