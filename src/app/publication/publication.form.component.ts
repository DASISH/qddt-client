import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Publication, PUBLICATION_TYPES, PublicationService, PublicationStatus } from './publication.service';
import {IEntityEditAudit} from '../shared/classes/interfaces';
import {ElementKind} from '../shared/classes/enums';
import {ElementRevisionRef, QueryInfo} from '../shared/classes/classes';

declare var Materialize: any;

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
  public selectedPublicationStatusOption: string;
  public selectedOptionValue: number;
  public selectOptions: any;

  constructor(private service: PublicationService) {
    this.service.PUBLICATION_STATUSES.then( (result) => {
      this.selectOptions = result;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['publication'].currentValue) {
      console.log('new value');
    }
    try { Materialize.updateTextFields(); } catch (Exception) { }
  }

  public onUpdatePublication() {
/*     if (this.publication.id) {
      this.service.create(this.publication).subscribe(
        (result) => { this.publication = result; this.modifiedEvent.emit(this.publication); },
        (error) => { throw error; });
    } else { */
      this.service.update(this.publication).subscribe(
        (result) => { this.publication = result; this.modifiedEvent.emit(this.publication); },
        (error) => { throw error; });

    /* } */
  }

  public getLabelByElement(kind: ElementKind): String {
    let element: QueryInfo;
    if (typeof kind === 'string') {
      element =  PUBLICATION_TYPES.find(e => ElementKind[e.id] === kind);
    }  else {
      element = PUBLICATION_TYPES.find(e => e.id === kind);
    }
    return element.label;
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

    console.log(id);
    if (id) {
      this.selectedOptionValue = +id;
      this.publication.status = statusList.find(e => e.id === +id );
      this.selectedPublicationStatusOption = this.publication.status.description;
    } else if (this.publication.status) {
      this.selectedOptionValue = this.publication.status.id;
      this.selectedPublicationStatusOption = this.publication.status.description;
    } else {
      this.publication.status = statusList.find(e => e.published === 'NOT_PUBLISHED');
      this.selectedOptionValue = this.publication.status.id;
      this.selectedPublicationStatusOption = this.publication.status.description;
    }
  }



}
