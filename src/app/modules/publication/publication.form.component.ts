import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  ActionKind,
  ElementKind,
  ElementRevisionRef,
  IEntityEditAudit,
  getElementKind,
  Publication,
  PUBLICATION_TYPES,
  PublicationService, PublicationStatus, TemplateService, ISelectOption, SelectItem, getIcon
} from '../../lib';


@Component({
  selector: 'qddt-publication-form',
  templateUrl: './publication.form.component.html',
})

export class PublicationFormComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() publication: Publication;
  @Output() modifiedEvent = new EventEmitter<IEntityEditAudit>();

  public formId = Math.round(Math.random() * 10000);
  public readonly = true;
  public SELECT_OPTIONS: ISelectOption[];
  private statusList: PublicationStatus[];
  // tslint:disable-next-line:variable-name
  private _statusId: number;

  constructor(private service: PublicationService, private templateService: TemplateService) {
    this.readonly = !templateService.can(ActionKind.Create, ElementKind.PUBLICATION);
  }

  public get statusId() {
    return this._statusId;
  }
  public set statusId(value: number) {
    this._statusId = +value;
    if ((value) && (this.statusList)) {
      const item = this.statusList.find(e => e.id === this._statusId);
      this.publication.status = item;
    } else if (this.statusList) {
      this.publication.status = this.statusList.find(e => e.published === 'NOT_PUBLISHED');
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.publication.currentValue && (this.publication.status)) {
      console.log('ngOnChanges');
      this.statusId = this.publication.status.id;
    }
  }

  public ngAfterViewInit(): void {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }

  async ngOnInit() {
    console.log('ngOnInit');
    const publicationStatus = await this.service.getPublicationStatus();
    this.SELECT_OPTIONS = publicationStatus.map(item => new SelectItem(item));
    this.statusList = [];
    publicationStatus.forEach(s => {
      if (s.children) {
        s.children.forEach(s1 =>
          this.statusList.push(
            new PublicationStatus({ id: s1.id, label: s1.label, published: s.published, description: s1.description })));
      }
    });
  }

  public onShowDetail(index) {
    console.log('onShowDetail');
    const item = this.publication.publicationElements[index];
    if (!item.element) {
      this.templateService.getByKindRevision(ElementKind[item.elementKind], item.elementId, item.elementRevision)
        .then(rev => {
          item.element = rev.entity;
        });
    }
  }

  public onUpdatePublication() {
    this.service.update(this.publication).subscribe(
      (result) => { this.publication = result; this.modifiedEvent.emit(this.publication); },
      (error) => { throw error; });
  }


  public onElementDelete(index: number) {
    if (index < this.publication.publicationElements.length) {
      this.publication.publicationElements.splice(index, 1);
    }
  }

  public onElementAdd(pe: ElementRevisionRef) {
    this.publication.publicationElements.push(pe);
  }

  public getLabelByElement(kind: ElementKind): string {
    kind = getElementKind(kind);
    return PUBLICATION_TYPES.find(e => e.id === kind).label;
  }

  public getMatIcon(kind: ElementKind | string): string {
    return getIcon(kind);
  }
}
