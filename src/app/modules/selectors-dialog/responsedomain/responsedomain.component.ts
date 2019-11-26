import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  ActionKind, Category,
  DOMAIN_TYPE_DESCRIPTION, DomainKind,
  ElementKind,
  ElementRevisionRef,
  IElement, IIdRef,
  IRevisionRef,
  Page, ResponseDomain, TemplateService, UserService
} from '../../../lib';

@Component({
  selector: 'qddt-responsedomain-select',
  templateUrl: 'responsedomain.component.html',
  styles: [
    '.row:hover > ul.dropleft { display:block; } ',
    'ul.dropleft { position: absolute; display: none; margin-top: 5px; margin-bottom: 0px; z-index: 1;}',
    'ul.dropleft li { display:inline-flex; }',
  ],
})

export class ResponsedomainComponent implements OnChanges, AfterViewInit {
  @Input()
  set responseDomain(responseDomain) {
    this._localresponseDomain = (responseDomain) ? new ResponseDomain(JSON.parse(JSON.stringify(responseDomain))) : null;
  }
  get responseDomain(): ResponseDomain { return this._localresponseDomain; }
  @Input() readonly = false;
  @Output() removeEvent = new EventEmitter<IIdRef>();
  @Output() selectedEvent = new EventEmitter<ElementRevisionRef>();

  public readonly MISSING_GROUP = ElementKind.MISSING_GROUP;
  public readonly RESPONSEDOMAIN = ElementKind.RESPONSEDOMAIN;
  public readonly domainTypeDescription: any[];
  public readonly canDelete: boolean;
  public readonly canEdit: boolean;
  public readonly modalId = Math.round( Math.random() * 10000);

  public showProgressBar = false;
  public selectedDomainId = 1;

  private _localresponseDomain: ResponseDomain;

  constructor(private service: TemplateService, private access: UserService) {
    this.domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);
    this.canDelete = access.canDo(ActionKind.Delete, this.RESPONSEDOMAIN);
    this.canEdit = access.canDo(ActionKind.Update, this.RESPONSEDOMAIN);
  }

  public ngAfterViewInit(): void {
    // document.querySelectorAll('select')
    // .forEach( select => M.FormSelect.init(select));
  }

  public ngOnChanges() {
    if (this.responseDomain) {
      this.onSelectDomainKind(DomainKind[this.responseDomain.responseKind]);
    }
  }

  public onSelectDomainKind(value: number) {
    this.selectedDomainId = (value) && (value < DomainKind.MIXED) ? value : DomainKind.SCALE;
  }

  public onItemEdit() {

  }

  public onItemGetLatest() {
    this.service.getByKindRevision(this.RESPONSEDOMAIN, this.responseDomain.id).then(
      (result) => {
        this.responseDomain = result.entity as ResponseDomain;
        this.selectedEvent.emit(
          {
            element: this.responseDomain,
            elementId: this.responseDomain.id,
            elementKind: this.RESPONSEDOMAIN,
            elementRevision: result.revisionNumber
          });
      });
  }

  public onItemRemove() {
    this.removeEvent.emit({ elementId: this.responseDomain.id, elementKind: this.responseDomain.classKind });
    this.responseDomain = null;
  }

  public onMissingAdd() {

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
    this.responseDomain.addManagedRep(ref.element);
  }

  public onOkMissing() {

  }

  public onDismiss() {

  }

  public onRevisionSelect() {
    
  }

  public openResponseDomain() {
    this.showMissing = !(this.showResponseDomain = true);
    this.onResponseDomainSearch({ element: '*', elementKind: this.RESPONSEDOMAIN });
  }

  public openMissing() {
    this.showResponseDomain = !(this.showMissing = true);
    this.onMissingSearch({ element: '*', elementKind: this.MISSING_GROUP });
  }

  public closeMissing() {
    this.selectedEvent.emit(new ElementRevisionRef({ element: this.responseDomain, elementRevision: 0 }));
    this.showMissing = false;
  }
}
