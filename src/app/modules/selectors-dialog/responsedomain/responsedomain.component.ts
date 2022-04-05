import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionKind,
  Category,
  ElementKind,
  ElementRevisionRef,
  ElementRevisionRefImpl,
  hasChanges,
  IElement, IElementRef,
  IRevisionRef,
  ResponseDomain, TemplateService, UserService
} from 'src/app/lib';

@Component({
  selector: 'qddt-responsedomain-select',
  templateUrl: 'responsedomain.component.html',
  styles: [
    '.descLabel {position: relative;left: 0.75rem;font-style: italic;}',
    'div:hover > ul.dropleft { opacity :1; } ',
    'td { min-width: 200px; max-width: 300px}'
  ],
})
export class ResponsedomainComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;
  @Input() readonly = false;
  @Input() xmlLang = 'none';
  @Output() removeEvent = new EventEmitter<IElementRef>();
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() updateEvent = new EventEmitter<ResponseDomain>();

  public readonly MISSING_GROUP = { element: '', elementKind: ElementKind.MISSING_GROUP };
  public readonly RESPONSEDOMAIN = { element: '', elementKind: ElementKind.RESPONSEDOMAIN };
  public readonly canDelete: boolean;
  public readonly canEdit: boolean;
  public readonly modalId = Math.round(Math.random() * 10000);

  public localResponseDomain: ResponseDomain;
  public showResponseDomain = false;
  public SOURCE: IRevisionRef;
  public readonly trackByCategoryId = (category: Category): string => category.id;

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  private _modalRef: M.Modal;

  private readonly getResponseAsync = (id: string) =>
    this.service.getByKindRevision(ElementKind.RESPONSEDOMAIN, id);

  private readonly getMissingAsync = (id: string) =>
    this.service.getByKindEntity<Category>(ElementKind.CATEGORY, id);

  private readonly updateResponseAsync = (responseDomain: ResponseDomain) =>
    this.service.update<ResponseDomain>(responseDomain).toPromise();

  public get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId),
        {
          inDuration: 750, outDuration: 1000, startingTop: '50%', endingTop: '10%', preventScrolling: true, opacity: 0.3
        });
    }
    return this._modalRef;
  }

  constructor(private service: TemplateService, access: UserService, private router: Router) {
    this.canDelete = access.canDo(ActionKind.Delete, ElementKind.RESPONSEDOMAIN);
    this.canEdit = access.canDo(ActionKind.Update, ElementKind.RESPONSEDOMAIN);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.responseDomain)) {
      console.debug('localResponseDomain')
      this.localResponseDomain = new ResponseDomain(JSON.parse(JSON.stringify(changes.responseDomain.currentValue)));
    }
  }

  public async onItemGetLatest() {
    this.SOURCE = new ElementRevisionRefImpl({
      element: this.responseDomain,
      uri: { id: this.responseDomain.id, rev: null },
      elementKind: ElementKind.RESPONSEDOMAIN,
    });

  }


  public onItemRemove(event) {
    if (this.canDelete && (event)) {
      this.removeEvent.emit({ elementId: this.responseDomain.id, elementKind: this.responseDomain.classKind });
      this.responseDomain = null;
      this.localResponseDomain = null;
    }
  }

  public onItemEdit(event: Event, rd: ResponseDomain) {
    event.stopPropagation();
    if (rd) {
      this.service.searchByUuid(rd.id).then(
        (result) => { this.router.navigate([result.url]); },
        (error) => { throw error; });
    } else {
      this.showResponseDomain = true;
      this.modalRef.open();
    }
  }
  public onRevisionSelect(ref: ElementRevisionRef) {
    if (this.canEdit && (ref)) {
      this.selectedEvent.emit(ref);
    }
    this.modalRef.close();
  }

  public onDismiss(_event?: Event) {
    this.RESPONSEDOMAIN.element = ''
    this.localResponseDomain = new ResponseDomain(JSON.parse(JSON.stringify(this.responseDomain)));
    this.modalRef.close();
  }


  // public onMissingEdit(event: Event) {
  //   event.stopPropagation();
  //   if (this.canEdit) {
  //     this.showResponseDomain = false;
  //     this.modalRef.open();
  //   }
  // }

  // public onMissingRemove() {
  //   if (this.canDelete && this.localResponseDomain.isMixed) {
  //     const i = this.localResponseDomain.managedRepresentation.children.findIndex(e => e.categoryKind === 'MISSING_GROUP');
  //     this.localResponseDomain.managedRepresentation.children.splice(i, 1);
  //     this.localResponseDomain.name =
  //       this.localResponseDomain.managedRepresentation.label =
  //       `Mixed [${this.localResponseDomain.managedRepresentation.children[0].label}]`;
  //     console.debug('debug')
  //     this.responseDomain = new ResponseDomain(JSON.parse(JSON.stringify(this.localResponseDomain)));
  //     this.updateEvent.emit(this.responseDomain);
  //   }
  // }

  // public async onMissingSelect(ref: IElement) {
  //   if (this.canEdit) {
  //     let missing = await this.getMissingAsync(ref.element.id)
  //     this.localResponseDomain.addManagedRep(missing);
  //   }
  // }

  // public onOkMissing(event: Event) {
  //   event.stopPropagation();
  //   if (this.canEdit) {
  //     this.responseDomain = this.localResponseDomain;
  //     this.updateEvent.emit(this.responseDomain);
  //     this.modalRef.close();
  //   }
  // }


}
