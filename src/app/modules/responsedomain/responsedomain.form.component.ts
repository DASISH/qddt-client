
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EventEmitter, Component, OnInit, OnChanges, AfterViewInit, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionKind,
  Category, DisplayLayoutKind,
  DomainKind,
  ElementKind,
  IElement,
  IPageSearch, LANGUAGE_MAP,
  PropertyStoreService,
  ResponseDomain, TemplateService, toSelectItems, DATE_FORMAT_MAP, delay, hasChanges, IRevisionRef, ElementRevisionRefImpl, ElementRevisionRef, IEntityEditAudit, UserService
} from '../../lib';

@Component({
  selector: 'qddt-responsedomain-form',
  styleUrls: ['./responsedomain.form.component.css'],
  templateUrl: './responsedomain.form.component.html',
})


export class ResponseFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() responseDomain: ResponseDomain;
  @Input() readonly: boolean;
  @Output() modifiedEvent = new EventEmitter<ResponseDomain>();

  public previewResponseDomain: ResponseDomain;
  public numberOfAnchors: number;
  public domainTypeDef = DomainKind;
  public domainType: DomainKind;
  public referenced: ElementRevisionRefImpl<IEntityEditAudit>;
  public canDelete: boolean;
  public canEdit: boolean;

  public readonly CATEGORY = ElementKind.CATEGORY;
  public readonly DATE_FORMATS = DATE_FORMAT_MAP;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly formId = Math.round(Math.random() * 10000);
  public readonly modalId = Math.round(Math.random() * 10000);
  public readonly DISPLAYLAYOUTS = toSelectItems(DisplayLayoutKind);

  public readonly trackByIndex = (index: number, entity) => entity.id || index;

  public readonly trackByFunc = (idx: any, category: { id: any; }) => category?.id || idx;

  public readonly power10 = (format: number): number => 1 / Math.pow(10, format);

  public readonly subtract = (value1, value2): number => parseInt(value1) - parseInt(value2);

  public readonly addition = (value1, value2): number => parseInt(value1) + parseInt(value2);

  public readonly buildPreviewResponseDomain = () => delay(20).then(() => {
    this.responseDomain.managedRepresentation.inputLimit = this.responseDomain.responseCardinality
    this.previewResponseDomain = new ResponseDomain(this.responseDomain);
  });

  public readonly setDescription = () => {
    const children = this.responseDomain.managedRepresentation.children
    this.responseDomain.name =
      this.responseDomain.managedRepresentation.name =
      `${children[0]?.name} + ${children[1]?.name}`;

    // this.responseDomain.description =
    //   this.responseDomain.managedRepresentation.label =
    //   `Mixed responsedomain (${children[0]?.label} + ${children[1]?.label})`;
  }


  private _modalRef: M.Modal;
  public get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId),
        {
          inDuration: 750, outDuration: 1000, startingTop: '50%', endingTop: '10%', preventScrolling: true, opacity: 0.3
        });
    }
    return this._modalRef;
  }

  constructor(private service: TemplateService, private router: Router, private properties: PropertyStoreService) {

    this.canDelete = !this.service.can(ActionKind.Delete, ElementKind.RESPONSEDOMAIN);
    this.canEdit = !this.service.can(ActionKind.Update, ElementKind.RESPONSEDOMAIN);
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.RESPONSEDOMAIN);

  }

  public ngAfterViewInit(): void {
    document.querySelectorAll('SELECT').forEach(comp => M.FormSelect.init(comp));
  }

  public ngOnInit() {
    if (!this.readonly) { this.readonly = false; }
    if (!this.responseDomain) { return; }

    this.domainType = DomainKind[this.responseDomain.responseKind];

    this.numberOfAnchors = 0;

    if (this.domainType === DomainKind.SCALE && this.responseDomain.displayLayout !== '90') {
      this.responseDomain.displayLayout = '0';
    }
    this.buildPreviewResponseDomain();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.responseDomain)) {
      this.responseDomain = new ResponseDomain(changes.responseDomain.currentValue)
      this.domainType = DomainKind[this.responseDomain.responseKind]
      this.numberOfAnchors = this.responseDomain.managedRepresentation.anchors.length

      delay(20).then(() => {
        M.updateTextFields()
        this.buildPreviewResponseDomain()
      })
    }
  }

  public onGotoEdit(event: Event, id: string) {
    event.stopPropagation();
    this.service.searchByUuid(id).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }

  public async onResponsedomainSelect() {
    this.referenced = new ElementRevisionRefImpl({
      uri: this.responseDomain?.basedOn,
      elementKind: ElementKind.RESPONSEDOMAIN
    });
  }

  public async onMissingSelect() {
    this.referenced = new ElementRevisionRefImpl({
      element: this.responseDomain?.missing,
      elementKind: ElementKind.MISSING_GROUP
    });
    console.debug(this.referenced)
  }

  public onMissingEdit(event: Event) {
    event.stopPropagation();
    if (this.canEdit) {
      // this.showResponseDomain = false;
      this.modalRef.open();
    }
  }

  public onMissingRemove() {
    if (this.canDelete && this.responseDomain.isMixed) {
      const i = this.responseDomain.managedRepresentation.children.findIndex(e => e.categoryKind === 'MISSING_GROUP');
      this.responseDomain.managedRepresentation.children.splice(i, 1);
      this.setDescription()
      console.debug('onMissingRemove')
      this.responseDomain = new ResponseDomain(JSON.parse(JSON.stringify(this.responseDomain)));
    }
  }

  // public async onMissingSelect(ref: IElement) {
  //   if (this.canEdit) {
  //     let missing = await this.getMissingAsync(ref.element.id)
  //     this.localResponseDomain.addManagedRep(missing);
  //   }
  // }

  public onItemRemove() {
    if (this.canDelete) {
      console.debug("onItemRemove")
      // this.removeEvent.emit({ elementId: this.responseDomain.id, elementKind: this.responseDomain.classKind });
      // this.responseDomain = null;
      // this.localResponseDomain = null;
    }
  }

  public onRevisionSelect(ref: ElementRevisionRef) {
    if (ref.elementKind == 'RESPONSEDOMAIN') {
      this.responseDomain.basedOn = ref.uri
      this.responseDomain.managedRepresentation.children[0] = ref.element.managedRepresentation
    } else {
      this.responseDomain.managedRepresentation.children[1] = ref.element
    }
    this.referenced = null
    this.setDescription()
    this.buildPreviewResponseDomain()
  }

  public getSource(category: Category): IElement {
    return { element: category, elementKind: ElementKind.CATEGORY };
  }

  public onSelectCategory(item: IElement, idx) {
    const code = this.responseDomain.managedRepresentation.anchors[idx].code;
    item.element.code = code;
    if (item.element.id === undefined) {
      this.onCreateCategory(item.element, idx);
    } else {
      this.onAnchorChanged(item.element, idx);
    }
  }

  public onCreateCategory(event, idx) {
    this.service.update<Category>(event).subscribe(
      (result) => {
        this.onAnchorChanged(result, idx);
      }
    );
  }

  public async onSave() {
    this.responseDomain.managedRepresentation.inputLimit = this.responseDomain.responseCardinality
    this.service.update<ResponseDomain>(this.responseDomain).subscribe(
      (rdResult) => {
        this.responseDomain = rdResult
        this.modifiedEvent.emit(rdResult)
      },
      (error) => {
        throw error
      })
  }

  public onAnchorChanged(event, idx) {
    this.responseDomain.managedRepresentation.anchors[idx] = event;
    this.buildPreviewResponseDomain();
  }

  public onChangeNumberOfCategories(num: number) {
    this.responseDomain.managedRepresentation.inputLimit.maximum = num;
    this.responseDomain.responseCardinality.maximum = num
    this.onChangeNumberOfAnchors(num);
  }

  public onSelectDateFormatChange(format: string) {
    this.responseDomain.managedRepresentation.format = format;
    this.buildPreviewResponseDomain();
  }

  public onChangeNumberOfAnchors(num: number) {
    const managed = this.responseDomain.managedRepresentation;
    if (managed.anchors.length === num) {
      return;
    }
    const count = managed.inputLimit.maximum - managed.inputLimit.minimum + 1;
    if (count < num) {
      this.numberOfAnchors = count;
    } else if (num < 0) {
      this.numberOfAnchors = 0;
    } else {
      this.numberOfAnchors = num;
    }

    let anchorsNew = managed.anchors.slice(0, this.numberOfAnchors);

    if (this.domainType === DomainKind.LIST) {
      for (let i = managed.anchors.length; i < this.numberOfAnchors; i++) {
        anchorsNew.push(new Category({ code: { value: String(i + 1) }, xmlLang: this.responseDomain.xmlLang }));
      }
    } else if (this.domainType === DomainKind.SCALE) {
      const len = managed.anchors.length;
      for (let i = len; i < this.numberOfAnchors; i++) {
        anchorsNew.push(new Category({ code: { value: '', }, xmlLang: this.responseDomain.xmlLang }));
      }
    }
    managed.anchors = anchorsNew
    managed.description = managed.anchors.map(c => c.label).join(' + ');
    this.buildPreviewResponseDomain();
  }


  public onChangeDegreeSlope(degree: string) {
    this.responseDomain.displayLayout = degree;
    this.buildPreviewResponseDomain();
  }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.buildPreviewResponseDomain();
    }
  }


}
