import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
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
  <qddt-auto-complete [items]="itemList" [elementKind]="source?.elementKind" [autoCreate] = "autoCreate"
    [formName] ="'AC'" [initialValue]="searchValue"
    (selectEvent)="onSelectElement($event)"
    (enterEvent)="onSearchElements($event)">
  </qddt-auto-complete>
`,
})

@ElementEnumAware
export class ElementComponent implements OnChanges, AfterViewInit {
  @Input() source: IElement;
  @Input() autoCreate = false;
  @Output() elementSelectedEvent = new EventEmitter<IElement>();

  public itemList = null;
  public isResponseDomain = false;
  public searchValue = '';
  public domainType = DomainKind.SCALE;
  public domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);
  private readonly KEY = 'ResponseKind';

  private pageSearch: PageSearch;

  constructor(private service: TemplateService) { }

  ngAfterViewInit(): void {
    if (this.isResponseDomain) {
      this.onSelectDomainType(this.domainType);
    }
  }

  async  ngOnChanges(changes: SimpleChanges) {
    if ((changes.source) && (changes.source.currentValue)) {
      const element = changes.source.currentValue as IElement;
      if (this.isIEntityAudit(element.element)) {
        // @ts-ignore
        this.searchValue = element.element.hasOwnProperty('label') ? element.element.label : element.element.name;
      } else {
        this.searchValue = element.element;
      }
      const  kind = getElementKind(element.elementKind);
      this.pageSearch = new PageSearch( { kind} );
      this.isResponseDomain = (kind === ElementKind.RESPONSEDOMAIN);
    }
  }
  onSelectDomainType(id: DomainKind) {
    this.domainType = id;
    this.pageSearch.keys.set(this.KEY, DomainKind[id]);
  }

  public onSearchElements(key) {
    this.pageSearch.key = key;
    this.service.searchByKind(this.pageSearch).then((result) => this.itemList = result.content);
  }

  public onSelectElement(item: IElement) {
    this.elementSelectedEvent.emit( item );
  }

  private isIEntityAudit(element): element is IEntityAudit {
    return (element as IEntityAudit).id !== undefined;
  }

}
