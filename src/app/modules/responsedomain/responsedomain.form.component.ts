
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EventEmitter, Component, OnInit, OnChanges, AfterViewInit, Input, Output, SimpleChanges } from '@angular/core';
import {
  ActionKind,
  Category, DisplayLayoutKind,
  DomainKind,
  ElementKind,
  IElement,
  IPageSearch, LANGUAGE_MAP,
  PropertyStoreService,
  ResponseDomain, TemplateService, toSelectItems, DATE_FORMAT_MAP, delay, hasChanges
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

  public readonly CATEGORY = ElementKind.CATEGORY;
  public domainTypeDef = DomainKind;
  public numberOfAnchors: number;
  public domainType: DomainKind;

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly DATE_FORMATS = DATE_FORMAT_MAP;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly DISPLAYLAYOUTS = toSelectItems(DisplayLayoutKind);

  public readonly trackByIndex = (index: number, entity) => entity.id || index;

  constructor(private service: TemplateService, private properties: PropertyStoreService) {

    this.numberOfAnchors = 0;
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
        console.debug(this.previewResponseDomain)
      })
    }
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
    let managed = this.previewResponseDomain.managedRepresentation
    managed.name = this.previewResponseDomain.name
    // this.responseDomain.managedRepresentation = await this.service.update<Category>(managed).toPromise()

    this.service.update<ResponseDomain>(new ResponseDomain(this.responseDomain)).subscribe(
      (rdResult) => {
        this.responseDomain = rdResult;
        this.modifiedEvent.emit(rdResult);
      }
    );
  }

  public onAnchorChanged(event, idx) {
    this.responseDomain.managedRepresentation.anchors[idx] = event;
    this.buildPreviewResponseDomain();
  }

  public onChangeNumberOfCategories(num: number) {
    this.responseDomain.managedRepresentation.inputLimit.maximum = num;
    this.onChangeNumberOfAnchors(num);
  }

  public onSelectDateFormatChange(format: string) {
    this.responseDomain.managedRepresentation.format = format;
    this.buildPreviewResponseDomain();
  }

  public onChangeNumberOfAnchors(num: number) {
    const rep = this.responseDomain.managedRepresentation;
    if (rep.anchors.length === num) {
      return;
    }
    const count = rep.inputLimit.maximum - rep.inputLimit.minimum + 1;
    if (count < num) {
      this.numberOfAnchors = count;
    } else if (num < 0) {
      this.numberOfAnchors = 0;
    } else {
      this.numberOfAnchors = num;
    }

    let anchorsNew = rep.anchors.slice(0, this.numberOfAnchors);

    if (this.domainType === DomainKind.LIST) {
      for (let i = rep.anchors.length; i < this.numberOfAnchors; i++) {
        anchorsNew.push(new Category({ code: { value: String(i + 1) }, xmlLang: this.responseDomain.xmlLang }));
      }
    } else if (this.domainType === DomainKind.SCALE) {
      const len = rep.anchors.length;
      for (let i = len; i < this.numberOfAnchors; i++) {
        anchorsNew.push(new Category({ code: { value: '', }, xmlLang: this.responseDomain.xmlLang }));
      }
    }
    rep.anchors = anchorsNew
    rep.description = rep.anchors.map(c => c.label).join(' + ');
    this.buildPreviewResponseDomain();
  }


  public onChangeDegreeSlope(degree: string) {
    this.responseDomain.displayLayout = degree;
    this.buildPreviewResponseDomain();
  }


  public buildPreviewResponseDomain() {
    this.previewResponseDomain = new ResponseDomain(this.responseDomain);
  }

  public power10(format: number): number {
    return 1 / Math.pow(10, format);
  }

  public subtract(value1, value2): number {
    // eslint-disable-next-line radix
    return parseInt(value1) - parseInt(value2);
  }

  public addition(value1, value2): number {
    // eslint-disable-next-line radix
    return parseInt(value1) + parseInt(value2);
  }

  public trackByFunc(idx: any, category: { id: any; }) {
    if (!category) return null;
    return category.id;
  }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.buildPreviewResponseDomain();
    }
  }

  private getPageSearch(): IPageSearch {
    return this.properties.get('responsedomains');
  }

}
