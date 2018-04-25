import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { PublicationService } from './publication.service';
import { IEntityEditAudit } from '../shared/classes/interfaces';
import { ElementKind } from '../shared/classes/enums';
import { ElementRevisionRef } from '../shared/classes/classes';
import { getElementKind } from '../shared/classes/constants';
import { Publication, PUBLICATION_TYPES, PublicationStatus } from './publication.classes';

@Component({
  selector: 'qddt-publication-form',
  moduleId: module.id,
  styles: [
    '.collapsible-header {white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }'
  ],
  templateUrl: './publication.form.component.html',
})

export class PublicationFormComponent implements OnChanges {
  @Input() publication: Publication;
  @Output() modifiedEvent = new EventEmitter<IEntityEditAudit>();

  public formId = Math.round( Math.random() * 10000);
  public selectedOptionId: number;
  public selectOptions: any;

  constructor(private service: PublicationService) {
    this.service.PUBLICATION_STATUSES.then( (result) => this.selectOptions = result );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['publication'].currentValue && (this.publication.status)) {
      this.onSelectChange(this.publication.status.id);
    }
  }

  public onUpdatePublication() {
      this.service.update(this.publication).subscribe(
        (result) => { this.publication = result; this.modifiedEvent.emit(this.publication); },
        (error) => { throw error; });
  }

  public getLabelByElement(kind: ElementKind): String {
    kind = getElementKind(kind);
    return PUBLICATION_TYPES.find(e => e.id === kind).label;
  }


  public onElementDelete(index: number) {
    if (index < this.publication.publicationElements.length) {
      this.publication.publicationElements.splice(index, 1);
    }
  }

  public onElementAdd(pe: ElementRevisionRef) {
    this.publication.publicationElements.push(pe);
  }

  public onSelectChange(id?: number) {
    const statusList: PublicationStatus[] = [];
    this.selectOptions.forEach( s => {
      if (s.children) {
        s.children.forEach(s1 =>
          statusList.push(
            new PublicationStatus({id: s1.id, label: s1.label, published: s.published, description: s1.description }) ));
    } } );

    if (id) {
      this.publication.status = statusList.find(e => e.id === +id );
    } else {
      this.publication.status = statusList.find(e => e.published === 'NOT_PUBLISHED');
    }
    this.selectedOptionId = this.publication.status.id;
  }



}
