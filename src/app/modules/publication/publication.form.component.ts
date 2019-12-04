import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  ActionKind,
  ElementKind,
  ElementRevisionRef,
  IEntityEditAudit,
  getElementKind,
  Publication,
  PUBLICATION_TYPES,
  PublicationService, PublicationStatus, TemplateService
} from '../../lib';

@Component({
  selector: 'qddt-publication-form',
  styles: [  ],
  templateUrl: './publication.form.component.html',
})

export class PublicationFormComponent implements OnChanges, OnInit {
  @Input() publication: Publication;
  @Output() modifiedEvent = new EventEmitter<IEntityEditAudit>();

  public formId = Math.round( Math.random() * 10000);
  // public selectedOptionId: number;
  public selectOptions: any;

  public readonly = true;
  // tslint:disable-next-line:variable-name
  private _statusId = 0;
  private statusList: PublicationStatus[];

  constructor(private service: PublicationService, private templateService: TemplateService) {
    this.readonly = !templateService.can(ActionKind.Create, ElementKind.PUBLICATION);
  }

  get statusId() {
    return this._statusId;
  }
  set statusId(value: number) {
    this._statusId = +value;
    console.log('statusId set-> ' + this._statusId);
    if ((value) && (this.statusList)) {
      const item =  this.statusList.find(e => e.id === this._statusId );
      this.publication.status = item;
    } else {
      this.publication.status = this.statusList.find(e => e.published === 'NOT_PUBLISHED');
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.publication.currentValue && (this.publication.status)) {
      // this.onSelectChange(this.publication.status.id);
    }
  }
  async ngOnInit() {
    console.log('pre init');
    this.selectOptions = await this.service.getPublicationStatus();
    console.log('init selectOptions set');
    this.statusList = [];
    this.selectOptions.forEach( s => {
      if (s.children) {
        s.children.forEach(s1 =>
          this.statusList.push(
            new PublicationStatus({id: s1.id, label: s1.label, published: s.published, description: s1.description }) ));
      } } );
  }


  public onShowDetail(index) {
    console.log('onShowDetail');
    const item = this.publication.publicationElements[index];
    if (!item.element) {
    this.templateService.getByKindRevision(ElementKind[item.elementKind], item.elementId, item.elementRevision)
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

  public getLabelByElement(kind: ElementKind): string {
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

  // public onSelectChange(id?: number) {
  //   const statusList: PublicationStatus[] = [];
  //   this.selectOptions.forEach( s => {
  //     if (s.children) {
  //       s.children.forEach(s1 =>
  //         statusList.push(
  //           new PublicationStatus({id: s1.id, label: s1.label, published: s.published, description: s1.description }) ));
  //   } } );
  //
  //   if (id) {
  //     this.publication.status = statusList.find(e => e.id === +id );
  //   } else {
  //     this.publication.status = statusList.find(e => e.published === 'NOT_PUBLISHED');
  //   }
  //   this.selectedOptionId = this.publication.status.id;
  // }
}
