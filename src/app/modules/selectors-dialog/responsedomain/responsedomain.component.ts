import { hasChanges } from 'src/app/lib';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
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

  // tslint:disable-next-line:variable-name
  // tslint:disable-next-line:variable-name
  private _modalRef: M.Modal;

  private readonly getRevAsync = (id: string) =>
    this.service.getByKindRevision(ElementKind.CATEGORY, id);


  private readonly updateRevAsync = (responseDomain: ResponseDomain) =>
    this.service.update<ResponseDomain>(responseDomain).toPromise();


  private readonly updateMixedAsync = async (responseDomain: ResponseDomain) => {
    // console.log('updateMixedAsync');
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

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.responseDomain)) {
      this.localResponseDomain = new ResponseDomain(JSON.parse(JSON.stringify(changes.responseDomain.currentValue)));
    }
  }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId),
        {
          inDuration: 750, outDuration: 750, startingTop: '50%', endingTop: '10%', preventScrolling: true, opacity: 0.3
        });
    }
    return this._modalRef;
  }

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
      this.localResponseDomain = null;
    }
  }

  public onRevisionSelect(ref: ElementRevisionRef) {
    if (this.canEdit) {
      if (ref) {
        // this.localResponseDomain = ref.
        this.selectedEvent.emit(ref);
      }
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
      const i = this.responseDomain.managedRepresentation.children.findIndex(e => e.categoryType === 'MISSING_GROUP');
      this.responseDomain.managedRepresentation.children.splice(i, 1);
      this.responseDomain.name =
        this.responseDomain.managedRepresentation.label =
        'Mixed [' + this.responseDomain.managedRepresentation.children[0].label + ']';
      this.localResponseDomain = new ResponseDomain(JSON.parse(JSON.stringify(this.responseDomain)));
    }
  }

  public onMissingSelect(ref: IElement) {
    if (this.canEdit) {
      console.log('missing selected')
      this.localResponseDomain.addManagedRep(ref.element);
    }
  }

  public onOkMissing(event: Event) {
    event.stopPropagation();
    if (this.canEdit) {
      this.responseDomain = this.localResponseDomain;
      this.updateEvent.emit(this.responseDomain);
      this.modalRef.close();
    }
  }

  public onDismiss(_event?: Event) {
    this.RESPONSEDOMAIN.element = ''
    this.localResponseDomain = new ResponseDomain(JSON.parse(JSON.stringify(this.responseDomain)));
    // event.stopPropagation();
    this.modalRef.close();
  }

}
