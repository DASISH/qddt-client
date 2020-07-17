import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  DOMAIN_TYPE_DESCRIPTION, DomainKind,
  ElementEnumAware,
  ElementKind,
  getElementKind,
  IElement, IEntityAudit,
  PageSearch,
  TemplateService,
} from '../../../lib';

@Component({
  selector: 'qddt-element-select',
  template: `
  <div *ngIf="isResponseDomain" class="row" >
    <div class="col left" *ngFor="let domain of domainTypeDescription" >
    <label>
        <input name="DOMAIN-TYPE-GROUP" type="radio" (click)="onSelectDomainType(domain.id)" [checked]="domainType === domain.id"/>
        <span>{{ domain.label }}</span>
      </label>
    </div>
  </div>
  <qddt-auto-complete   [items]="itemList" [elementKind]="source?.elementKind" [autoCreate] = "autoCreate"
    [formName] ="'AC'" [initialValue]="searchValue" [xmlLang]="xmlLang"
    (selectEvent)="onSelectElement($event)"
    (enterEvent)="onSearchElements($event)">
  </qddt-auto-complete>
`,
})

@ElementEnumAware
export class ElementComponent implements OnChanges, AfterViewInit {
  @Input() source: IElement;
  @Input() xmlLang = 'none';
  @Input() autoCreate = false;
  @Output() elementSelectedEvent = new EventEmitter<IElement>();

  public itemList = null;
  public isResponseDomain = false;
  public searchValue = '';
  public domainType = DomainKind.SCALE;
  public domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id !== DomainKind.NONE && e.id !== DomainKind.MISSING);
  private readonly KEY = 'ResponseKind';

  private pageSearch = new PageSearch();

  constructor(private service: TemplateService) { }

  ngAfterViewInit(): void {
    if (this.isResponseDomain) {
      this.onSelectDomainType(this.domainType);
    }

  }

  async ngOnChanges(changes: SimpleChanges) {
    if ((changes.source) && (changes.source.currentValue)) {
      const cv = changes.source.currentValue as IElement;
      const kind = getElementKind(cv.elementKind);
      this.isResponseDomain = (kind === ElementKind.RESPONSEDOMAIN);
      this.pageSearch.kind = kind;
      if (this.isIEntityAudit(cv.element)) {
        // @ts-ignore
        this.searchValue = cv.element.hasOwnProperty('label') ? cv.element.label : cv.element.name;
      } else {
        this.searchValue = cv.element;
      }
      this.onSearchElements(this.searchValue);

    }
  }
  onSelectDomainType(id: DomainKind) {
    this.domainType = id;
    this.pageSearch.keys.set(this.KEY, DomainKind[id]);
  }

  public onSearchElements(key) {
    this.pageSearch.key = key;
    this.pageSearch.xmlLang = this.xmlLang;
    this.service.searchByKind(this.pageSearch).then((result) =>
      this.itemList = result.content.sort((a, b) =>
        a.name.localeCompare(b.name)));
  }

  public onSelectElement(item: IElement) {
    this.elementSelectedEvent.emit(item);
  }

  private isIEntityAudit(element): element is IEntityAudit {
    return (element) && (element as IEntityAudit).classKind !== undefined;
  }

}
