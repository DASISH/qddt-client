import { Component, Input, Output, EventEmitter, OnInit, AfterContentChecked } from '@angular/core';
import { Publication, PUBLICATION_TYPES, PublicationService, PublicationStatus } from './publication.service';
import { ElementRevisionRef, QddtElement, ElementKind } from '../shared/elementinterfaces/elements';

declare var Materialize: any;

@Component({
  selector: 'qddt-publication-form',
  moduleId: module.id,
  styles: [
    '.collapsible-header {white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }'
  ],
  templateUrl: './publication.form.component.html',
})

export class PublicationFormComponent implements OnInit , AfterContentChecked {
  @Input() publication: Publication;
  @Input() textColor ='grey-text text-darken-1';
  @Output() saveEvent = new EventEmitter<Publication>();

  selectedOptionValue: number;
  selectedPublicationStatusOption: any;
  selectOptions: PublicationStatus[];

  constructor(private service: PublicationService) {
    this.selectOptions = service.PUBLICATION_STATUSES;
    this.selectedOptionValue = 15;
    this.selectedPublicationStatusOption =  this.service.getStatusById(this.selectedOptionValue).description;
  }

  public ngOnInit() {
    if (this.publication) {
      const status = this.service.getPublicationStatusAsList().find( s => s.label === this.publication.status);
      this.onSelectChange(status.id);
    }
  }

  public ngAfterContentChecked() {
    Materialize.updateTextFields();
  }

  public onSavePublication() {
    if (this.publication.id) {
      this.service.create(this.publication).subscribe(
        (result) => { this.publication = result;
          this.saveEvent.emit(this.publication); },
        (error) => { throw error; });
    } else {
      this.service.update(this.publication).subscribe(
        (result) => { this.publication = result;
              this.saveEvent.emit(this.publication); },
        (error) => { throw error; });

    }
  }


  public getLabelByElement(kind: ElementKind): String {
    let element: QddtElement;
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

  public onSelectChange(id: any) {
    const status = this.service.getStatusById(+id);
    if (status) {
      this.publication.status = status.label;
      this.selectedPublicationStatusOption = status.description;
      this.selectedOptionValue = status.id;
    }
  }



}
