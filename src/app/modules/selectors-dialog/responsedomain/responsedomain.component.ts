import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import {
  ActionKind,
  Category,
  ElementKind,
  ElementRevisionRef,
  Factory,
  IElement, IElementRef,
  ResponseDomain, TemplateService, UserService
} from '../../../lib';

@Component({
  selector: 'qddt-responsedomain-select',
  templateUrl: 'responsedomain.component.html',
  styles: [
    '.descLabel {left: 1rem;top: -1rem;position: relative;width: 95%;display: inline-block;font-style: italic;}',
    'div:hover > ul.dropleft { display:block; } ',
  ],
})


export class ResponsedomainComponent {
  @Input()
  set responseDomain(responseDomain) {
    // This will ensure that a new object is created...
    this._localresponseDomain = (responseDomain) ? new ResponseDomain(JSON.parse(JSON.stringify(responseDomain))) : null;
  }
  get responseDomain(): ResponseDomain { return this._localresponseDomain; }
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

  public showResponseDomain = false;

  // tslint:disable-next-line:variable-name
  private _localresponseDomain: ResponseDomain;
  // tslint:disable-next-line:variable-name
  private _modalRef: M.Modal;

  private readonly getRevAsync = (id: string) => {
    console.log('getRevAsync');
    return this.service.getByKindRevision(ElementKind.CATEGORY, id);
  }

  private readonly updateRevAsync = (responseDomain: ResponseDomain) =>
    this.service.update<ResponseDomain>(responseDomain).toPromise()

  private readonly updateMixedAsync = async (responseDomain: ResponseDomain) => {
    console.log('updateMixedAsync');
    if (responseDomain.isMixed) {
      let changed = false;
      const updatedpromises = responseDomain.managedRepresentation.children.map(async (child, _i) => {
        const rev = await this.getRevAsync(child.id);
        if (child.modified !== rev.entity.modified) {
          changed = true;
          const codes = [child.code].concat(child.children.map(cc => cc.code));
          child = rev.entity as Category;
          child.code = codes[0];
          child.children.forEach((ccc, j) => ccc.code = codes[j + 1]);
        }
        return child;
      });
      const updatedchildren = await Promise.all(updatedpromises);
      if (changed) {
        responseDomain.managedRepresentation.children = updatedchildren;
        return await this.updateRevAsync(responseDomain);
      }
    }
    return await Promise.resolve(responseDomain);
  }

  constructor(private service: TemplateService, private access: UserService, private router: Router) {
    this.canDelete = access.canDo(ActionKind.Delete, ElementKind.RESPONSEDOMAIN);
    this.canEdit = access.canDo(ActionKind.Update, ElementKind.RESPONSEDOMAIN);
  }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
    }
    return this._modalRef;
  }

  // public ngAfterViewInit(): void {
  //   M.updateTextFields();
  // }

  public trackByCategoryId(category: Category): string {
    return category.id;
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

  public async onItemGetLatest() {

    const RD = await this.updateMixedAsync(this.responseDomain);
    const result = await this.service.getLatestVersionByKindEntity(ElementKind.RESPONSEDOMAIN, this.responseDomain.id);

    if (RD.modified !== result.entity.modified) {
      this.responseDomain = Factory.createFromSeed(ElementKind.RESPONSEDOMAIN, result.entity) as ResponseDomain;
      this.selectedEvent.emit(
        {
          element: this.responseDomain,
          elementId: this.responseDomain.id,
          elementKind: ElementKind.RESPONSEDOMAIN,
          elementRevision: result.revisionNumber
        });
      M.toast({
        html: 'Updated Mixed responsedomain',
        displayLength: 2000
      });

    } else {
      M.toast({
        html: 'No updated managed representation available',
        displayLength: 2000
      });
    }
  }

  public onItemRemove() {
    if (this.canDelete) {
      this.removeEvent.emit({ elementId: this.responseDomain.id, elementKind: this.responseDomain.classKind });
      this.responseDomain = null;
    }
  }

  public onRevisionSelect(ref: ElementRevisionRef) {
    if (this.canEdit) {
      this.selectedEvent.emit(ref);
      this.modalRef.close();
    }
  }

  public onMissingEdit(event: Event) {
    event.stopPropagation();
    if (this.canEdit) {
      this.showResponseDomain = false;
      this.modalRef.open();
    }
  }

  public onMissingRemove() {
    if (this.canDelete && this.responseDomain.isMixed) {
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
    if (this.canEdit) {
      this._localresponseDomain.addManagedRep(ref.element);
    }
  }

  public onOkMissing(event: Event) {
    event.stopPropagation();
    if (this.canEdit) {
      this.updateEvent.emit(this.responseDomain);
      this.modalRef.close();
    }
  }

  public onDismiss(_event?: Event) {
    // event.stopPropagation();
    this.modalRef.close();
  }

}
