import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ActionKind,
  Category,
  ElementKind,
  ElementRevisionRef,
  IElement, IElementRef,
  ResponseDomain, TemplateService, UserService
} from '../../../lib';

@Component({
  selector: 'qddt-responsedomain-select',
  templateUrl: 'responsedomain.component.html',
  styles: [
    'div:hover > ul.dropleft { display:block; } ',
  ],
})

// 'ul.dropleft { position: absolute; display: none; margin-top: 5px; margin-bottom: 0px; z-index: 1;}',
//   'ul.dropleft li { display:inline-flex; }',

export class ResponsedomainComponent {
  @Input()
  set responseDomain(responseDomain) {
    // This will ensure that a new object is created...
    this._localresponseDomain = (responseDomain) ? new ResponseDomain(JSON.parse(JSON.stringify(responseDomain))) : null;
  }
  get responseDomain(): ResponseDomain { return this._localresponseDomain; }
  @Input() readonly = false;
  @Output() removeEvent = new EventEmitter<IElementRef>();
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();
  @Output() updateEvent = new EventEmitter<ResponseDomain>();

  public readonly MISSING_GROUP = { element: '', elementKind: ElementKind.MISSING_GROUP };
  public readonly RESPONSEDOMAIN = { element: '', elementKind: ElementKind.RESPONSEDOMAIN };
  public readonly canDelete: boolean;
  public readonly canEdit: boolean;
  public readonly modalId = Math.round(Math.random() * 10000);

  public showResponseDomain = true;

  // tslint:disable-next-line:variable-name
  private _localresponseDomain: ResponseDomain;
  // tslint:disable-next-line:variable-name
  private _modalRef: M.Modal;

  constructor(private service: TemplateService, private access: UserService) {
    this.canDelete = access.canDo(ActionKind.Delete, ElementKind.RESPONSEDOMAIN);
    this.canEdit = access.canDo(ActionKind.Update, ElementKind.RESPONSEDOMAIN);
  }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
    }
    return this._modalRef;
  }

  trackByCategoryId(category: Category): string {
    return category.id;
  }

  public onItemEdit(event: Event) {
    event.stopPropagation();
    this.showResponseDomain = true;
    this.modalRef.open();
  }

  public async onItemGetLatest() {
    if (this.responseDomain.isMixed) {
      let changed = false;
      const mr = this.responseDomain.managedRepresentation;
      console.log(mr.children || JSON);
      mr.children.forEach(async (child, i) => {
        const rev = await this.service.getByKindRevision(ElementKind.CATEGORY, child.id);
        if (JSON.stringify(child.version) !== JSON.stringify(rev.entity.version)) {
          changed = true;
          const codes = [child.code].concat(child.children.map(cc => cc.code));
          child = rev.entity as Category;
          child.code = codes[0];
          child.children.forEach((ccc, j) => ccc.code = codes[j + 1]);
          this.responseDomain.managedRepresentation.children[i] = child;
        }
      });
      if (changed) {
        await this.service.update(this.responseDomain).toPromise();
      }

      this.service.getByKindRevision(ElementKind.RESPONSEDOMAIN, this.responseDomain.id).then(
        (result) => {
          this.responseDomain = result.entity as ResponseDomain;
          this.selectedEvent.emit(
            {
              element: this.responseDomain,
              elementId: this.responseDomain.id,
              elementKind: ElementKind.RESPONSEDOMAIN,
              elementRevision: result.revisionNumber
            });
        });
    }
  }

  public onItemRemove() {
    this.removeEvent.emit({ elementId: this.responseDomain.id, elementKind: this.responseDomain.classKind });
    this.responseDomain = null;
  }

  public onRevisionSelect(ref: ElementRevisionRef) {
    this.selectedEvent.emit(ref);
    this.modalRef.close();
  }

  public onMissingEdit(event: Event) {
    event.stopPropagation();
    this.showResponseDomain = false;
    this.modalRef.open();
  }

  public onMissingRemove() {
    if (this.responseDomain.isMixed) {
      // const rd =  new ResponseDomain(JSON.parse(JSON.stringify(this.responseDomain)));
      const i = this.responseDomain.managedRepresentation.children.findIndex(e => e.categoryType === 'MISSING_GROUP');
      this.responseDomain.managedRepresentation.children.splice(i, 1);
      this.responseDomain.name =
        this.responseDomain.managedRepresentation.label =
        'Mixed [' + this.responseDomain.managedRepresentation.children[0].label + ']';
      // this.responseDomain = rd;
    }
  }

  public onMissingSelect(ref: IElement) {
    this._localresponseDomain.addManagedRep(ref.element);
  }

  public onOkMissing(event: Event) {
    event.stopPropagation();
    this.updateEvent.emit(this.responseDomain);
    this.modalRef.close();
  }

  public onDismiss(event: Event) {
    // event.stopPropagation();
    this.modalRef.close();
  }


}
