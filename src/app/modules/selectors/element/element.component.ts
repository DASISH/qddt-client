import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {
  DOMAIN_TYPE_DESCRIPTION, DomainKind,
  ElementEnumAware,
  ElementKind,
  getElementKind,
  IElement,
  IIdRef, PageSearch,
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
  <qddt-auto-complete [items]="itemList" class="black-text" [elementKind]="kind" [autoCreate] = "autoCreate"
    (selectEvent)="onSelectElement($event)"
    (enterEvent)="onSearchElements($event)">
  </qddt-auto-complete>
`,
})

@ElementEnumAware
export class ElementComponent implements OnChanges, AfterViewInit {
  @Input() source: ElementKind | IIdRef;
  @Input() autoCreate = false;
  @Output() elementSelectedEvent = new EventEmitter<IElement>();
  // @Output() dismissEvent = new EventEmitter<boolean>();

  public itemList = null;
  public isResponseDomain = false;
  public domainType = DomainKind.SCALE;
  public domainTypeDescription = DOMAIN_TYPE_DESCRIPTION.filter((e) => e.id > DomainKind.NONE && e.id < DomainKind.MISSING);
  public kind: ElementKind;
  private readonly KEY = 'ResponseKind';

  private item: IElement;
  private pageSearch: PageSearch;


  constructor(private service: TemplateService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.source && changes.source.currentValue) {
      if (this.isElementRef(changes.source.currentValue)) {
        this.item = changes.source.currentValue as IElement;
        this.kind = getElementKind(this.item.elementKind);
      } else {
        this.kind = getElementKind(changes.source.currentValue);
        this.item = null;
      }
      this.pageSearch = new PageSearch( { kind: this.kind } );
      this.isResponseDomain = (this.kind === ElementKind.RESPONSEDOMAIN);
    }
  }
  onSelectDomainType(id: DomainKind) {
    this.domainType = id;
    this.pageSearch.keys.set(this.KEY, DomainKind[id]);
  }

  public onSearchElements(key) {
    this.pageSearch.key = key;
    this.service.searchByKind(this.pageSearch)
    .then((result) => this.itemList = result.content);
  }

  public onSelectElement(item: IElement) {
    this.elementSelectedEvent.emit( item );
  }

  private isElementRef(kind: IElement | ElementKind): kind is IElement {
    return (kind as IElement).element !== undefined;
  }

  ngAfterViewInit(): void {
    this.isResponseDomain = (this.kind === ElementKind.RESPONSEDOMAIN);
    if (this.isResponseDomain) {
      this.onSelectDomainType(this.domainType);
    }
  }
}
