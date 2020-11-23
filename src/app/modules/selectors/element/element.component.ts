import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  DOMAIN_TYPE_DESCRIPTION, DomainKind,
  ElementEnumAware,
  ElementKind,
  getElementKind,
  IElement, IEntityAudit,
  PageSearch,
  TemplateService,
  hasChanges,
  getQueryInfo,
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
  <qddt-auto-complete [items]="itemList" [elementKind]="source?.elementKind" [autoCreate]="autoCreate"
    [formName] ="formName" [initialValue]="searchValue" [xmlLang]="xmlLang"  [validate]="validate"
    (selectEvent)="onSelectElement($event)"
    (enterEvent)="onSearchElements($event)">
  </qddt-auto-complete>
`,
})

@ElementEnumAware
export class ElementComponent implements OnChanges {
  @Input() source: IElement;
  @Input() xmlLang = 'none';
  @Input() formName: string;
  @Input() autoCreate = false;
  @Input() validate = false;
  @Output() elementSelectedEvent = new EventEmitter<IElement>();

  public itemList = null;
  public isResponseDomain = false;
  public searchValue = '';
  public domainType = DomainKind.SCALE;
  public domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id !== DomainKind.NONE && e.id !== DomainKind.MISSING);
  private readonly KEY = 'ResponseKind';

  private pageSearch = new PageSearch();

  constructor(private service: TemplateService) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (hasChanges<IElement>(changes.source)) {

      if (hasChanges<IElement>(changes.source, (a1, a2) => a1.elementKind === a2.elementKind)) {
        const cv = changes.source.currentValue as IElement;
        const kind = getElementKind(cv.elementKind);
        this.pageSearch.kind = kind;
        this.isResponseDomain = (kind === ElementKind.RESPONSEDOMAIN);
        if (this.isResponseDomain) {
          this.onSelectDomainType(this.domainType);
        }
      }
      if (hasChanges<IElement>(changes.source, (a1, a2) => a1.element.modified === a2.element.modified)) {
        const cv = changes.source.currentValue as IElement;
        if (this.isIEntityAudit(cv.element)) {
          // @ts-ignore
          this.searchValue = cv.element.hasOwnProperty('label') ? cv.element.label : cv.element.name;
        } else {
          this.searchValue = cv.element;
        }
        this.onSearchElements(this.searchValue);
      }
    }
  }

  onSelectDomainType(id: DomainKind) {
    this.domainType = id;
    this.pageSearch.keys.set(this.KEY, DomainKind[id]);
    this.onSearchElements(this.searchValue);
    this.elementSelectedEvent.emit(null);
  }

  public onSearchElements(key) {
    const qi = getQueryInfo(this.pageSearch.kind);

    this.pageSearch.key = key;
    this.pageSearch.xmlLang = this.xmlLang;
    this.pageSearch.sort = [...qi.fields.filter((v, i) => i < 2).entries()].flatMap(value => value[1]).join(',');
    this.service.searchByKind(this.pageSearch).then((result) =>
      this.itemList = result.content.sort((a, b) =>
        a.name.localeCompare(b.name)));
  }

  public onSelectElement(item: IElement) {
    this.elementSelectedEvent.emit(item);
    if (this.source?.element) {
      this.source.element = null;
    }
  }

  private isIEntityAudit(entity): entity is IEntityAudit {
    return (entity) && (entity as IEntityAudit).classKind !== undefined;
  }

}
