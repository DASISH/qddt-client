import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  ActionKind,
  ElementRevisionRef, EventAction,
  IEntityEditAudit,
  Publication, PUBLICATION_TYPES,
  PublicationService,
  PublicationStatus, SelectItem,
  TemplateService
} from '../../lib';


@Component({
  selector: 'qddt-publication-form',
  templateUrl: './publication.form.component.html',
})

export class PublicationFormComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() publication: Publication;
  @Output() modifiedEvent = new EventEmitter<IEntityEditAudit>();

  public readonly PUBLICATION = PUBLICATION_TYPES;

  public formId = Math.round(Math.random() * 10000);
  public readonly = false;
  public statusMap: SelectItem[];
  private statusList: PublicationStatus[];


  constructor(private service: PublicationService, private templateService: TemplateService) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.publication.isFirstChange()) {
      const pub = changes.publication.currentValue as Publication;
      if (pub.status) {
        this.templateService.canDoAction(ActionKind.Update, pub)
          .then(can => this.readonly = !can);
      }
    }
  }

  async ngOnInit() {
    const pstat = await this.service.getPublicationStatus();
    this.statusList = [];
    pstat.forEach(s => {
      if (s.children) {
        s.children.forEach(status => this.statusList.push( status));
      }
    });
    this.statusMap = pstat.map( value => new SelectItem(value));
  }

  public ngAfterViewInit(): void {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }

  public getDescription(id:number): string {
    if (this.statusList) {
      this.publication.status = (id) ?
        this.statusList.find(e => e.id === +id):
        this.statusList.find(e => e.published === 'NOT_PUBLISHED');
      return this.publication.status.description;
    }
    return '?';
  }

  public onUpdatePublication() {
    this.service.update(this.publication).subscribe(
      (result) => { this.publication = result; this.modifiedEvent.emit(this.publication); },
      (error) => { throw error; });
  }

  public onDoAction(response: EventAction) {
    const action = response.action as ActionKind;
    const ref = response.ref as ElementRevisionRef;
    switch (action) {
      case ActionKind.Read: break;
      case ActionKind.Create: this.onItemAdded(ref); break;
      case ActionKind.Update: this.onItemModified(ref); break;
      case ActionKind.Delete: this.onItemRemoved(ref); break;
      default: {
        console.error('wrong action recieved ' + ActionKind[action]);
      }
    }
  }

  public onItemRemoved(ref: ElementRevisionRef) {
    const idx = this.publication.publicationElements.findIndex( p => p.elementId === ref.elementId );
    if (idx >=0) {
      this.publication.publicationElements.splice(idx, 1);
    }
  }

  public onItemAdded(ref: ElementRevisionRef) {
    this.publication.publicationElements.push(ref);
    // console.log(ref || JSON);
    // this.modalRef.open();
    // this.publication.publicationElements.push(ref);
  }

  public onItemModified(ref: ElementRevisionRef) {
    const idx = this.publication.publicationElements.findIndex( p => p.elementId === ref.elementId );
    const seqNew: ElementRevisionRef[] = [].concat(
      this.publication.publicationElements.slice(0, idx),
      ref,
      this.publication.publicationElements.slice(idx + 1)
    );
    this.publication.publicationElements = seqNew;
  }

}
