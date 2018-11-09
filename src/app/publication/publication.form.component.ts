import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PublicationService} from './publication.service';
import {Publication, PUBLICATION_TYPES, PublicationStatus} from './publication.classes';
import {TemplateService} from '../template/template.service';
import {ActionKind, ElementKind, ElementRevisionRef, getElementKind, IEntityEditAudit} from '../shared/classes';

@Component({
  selector: 'qddt-publication-form',
  styles: [  ],
  templateUrl: './publication.form.component.html',
})

export class PublicationFormComponent implements OnChanges {
  @Input() publication: Publication;
  @Output() modifiedEvent = new EventEmitter<IEntityEditAudit>();

  public formId = Math.round( Math.random() * 10000);
  public selectedOptionId: number;
  public selectOptions: any;

  public readonly = true;

  constructor(private service: PublicationService, private templateService: TemplateService) {
    this.service.publication_statuses$.then( (result) => this.selectOptions = result );
    this.readonly = !templateService.can(ActionKind.Create, ElementKind.PUBLICATION);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['publication'].currentValue && (this.publication.status)) {
      this.onSelectChange(this.publication.status.id);
    }
  }

  public onShowDetail(index) {
    console.log('onShowDetail');
    const item = this.publication.publicationElements[index];
    if (!item.element) {
    this.templateService.getRevisionByKind(ElementKind[item.elementKind], item.elementId, item.elementRevision)
      .then( rev => {
        item.element = rev.entity;
      });
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
