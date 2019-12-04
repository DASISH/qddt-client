import { LanguageKind } from '../../lib/enums/language-kind';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges, AfterViewInit
} from '@angular/core';
import {
  ActionKind,
  Category, DATE_FORMAT,
  DomainKind,
  ElementKind,
  IElement,
  IPageSearch,
  Page,
  PropertyStoreService,
  ResponseDomain, TemplateService, enumLANGUAGES
} from '../../lib';

@Component({
  selector: 'qddt-responsedomain-form',
  styleUrls: ['./responsedomain.form.component.css'],
  templateUrl: './responsedomain.form.component.html',
})


export class ResponseFormComponent implements OnInit , OnChanges,  OnDestroy, AfterViewInit {
  @Input() responseDomain: ResponseDomain;
  @Input() readonly: boolean;
  @Output() modifiedEvent = new EventEmitter<ResponseDomain>();

  public previewResponseDomain: any;

  public readonly CATEGORY = ElementKind.CATEGORY;
  public domainTypeDef = DomainKind;
  public dateFormatOption = DATE_FORMAT;
  public numberOfAnchors: number;
  public selectedCategoryIndex: number;
  public domainType: DomainKind;
  // public categories: Category[];
  public readonly formId = Math.round( Math.random() * 10000);
  public readonly LANGUAGES = LanguageKind;

  private pageSearch: IPageSearch;
  private ok = true;

  constructor(private service: TemplateService, private properties: PropertyStoreService) {

    this.selectedCategoryIndex = 0;
    this.numberOfAnchors = 0;
    this.pageSearch = { kind: this.CATEGORY, key: '', page: new Page(), sort: 'name,asc' };
    const page = this.getPageSearch();
    this.domainType = (page) ? DomainKind[page.keys.get('ResponseKind')] : DomainKind.SCALE;
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.RESPONSEDOMAIN);

  }

  ngAfterViewInit(): void {
    M.updateTextFields();
    document.querySelectorAll('SELECT').forEach( comp => {
      M.FormSelect.init(comp);
      console.log( comp.nodeName);
    });
  }

  ngOnInit() {
    if (!this.readonly) { this.readonly = false; }
    if (!this.responseDomain) { return; }

    this.numberOfAnchors = this.responseDomain.managedRepresentation.children.length;

    if (this.domainType === DomainKind.SCALE && this.responseDomain.displayLayout !== '90') {
      this.responseDomain.displayLayout = '0';
    }
    this.buildPreviewResponseDomain();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.responseDomain) {
      const page = this.getPageSearch();
      this.domainType = (page) ? DomainKind[page.keys.get('ResponseKind')] : DomainKind.SCALE;
      this.numberOfAnchors = this.responseDomain.managedRepresentation.children.length;
      this.buildPreviewResponseDomain();
    }
  }

  ngOnDestroy(): void {
    this.ok = false;
  }

  public getSource(category: Category): IElement {
    return {element: category, elementKind: ElementKind.CATEGORY};
  }

  public onSelectCategory(item: IElement, idx) {
    const code = this.responseDomain.managedRepresentation.children[idx].code;
    item.element.code = code;
    if (item.element.id === undefined) {
      this.onCreateCategory(item.element, idx);
    } else {
      this.anchorChanged(item.element, idx);
    }
  }
  anchorChanged(event, idx) {
    this.responseDomain.managedRepresentation.children[idx] = event;
    this.buildPreviewResponseDomain();
  }

  onCreateCategory(event, idx) {
    this.service.update(event).subscribe(
      (result) => { this.anchorChanged(result, idx);
      }
    );
  }

  onSave() {
    this.service.update<ResponseDomain>(this.responseDomain).subscribe(
      (rdResult) => {
        this.responseDomain = rdResult;
        this.modifiedEvent.emit(rdResult);
      }
    );
  }

  changeNumberOfCategories(num: number) {
    this.responseDomain.managedRepresentation.inputLimit.maximum  = num;
    this.changeNumberOfAnchors(num);
  }

  onSelectDateFormatChange(format: string) {
    this.responseDomain.managedRepresentation.format = format;
    this.buildPreviewResponseDomain();
  }

  changeNumberOfAnchors(num: number) {
    const rep = this.responseDomain.managedRepresentation;
    if (rep.children.length === num) {
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

    rep.children = rep.children.slice(0, this.numberOfAnchors);

    if (this.domainType === DomainKind.LIST) {
      for (let i = rep.children.length; i < this.numberOfAnchors; i++) {
        rep.children.push(new Category({ code:  { codeValue: String(i + 1) , alignment: '' }}));
      }
    } else if (this.domainType === DomainKind.SCALE) {
      const len = rep.children.length;
      for (let i = len; i < this.numberOfAnchors; i++) {
          rep.children.push(new Category({code : { codeValue: '', alignment: 'text-left' }}));
      }
    }
    this.buildPreviewResponseDomain();
  }


  onChangeDegreeSlope(degree: string) {
    this.responseDomain.displayLayout = degree;
    this.buildPreviewResponseDomain();
  }

  onSelectAlignment(value: any, idx: any) {
    this.responseDomain.managedRepresentation.children[idx].code.alignment = value;
    this.buildPreviewResponseDomain();
  }

  buildPreviewResponseDomain() {
    this.previewResponseDomain = new ResponseDomain(this.responseDomain);
  }

  power10(format: number): number {
    return 1 / Math.pow(10, format);
  }

  subtract(value1, value2): number {
    // tslint:disable-next-line:radix
    return parseInt(value1) - parseInt(value2);
  }

  addition(value1, value2): number {
    // tslint:disable-next-line:radix
    return parseInt(value1) + parseInt(value2);
  }

  private getPageSearch(): IPageSearch {
    return this.properties.get('responsedomains');
  }

  onDragstart(event, sourceId) {
    event.dataTransfer.effectAllowed = 'move'; // only dropEffect='copy' will be dropable
    event.dataTransfer.setData('text/plain', sourceId); // required otherwise doesn't work
    event.stopPropagation();
  }

  onDragover(event) {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();

    console.log(event);

    const bounding = event.target.getBoundingClientRect();
    const offset = bounding.y + (bounding.height / 2 );
    if ( event.clientY - offset > 0 ) {
      event.target.style['border-bottom'] = 'solid 3px blue';
      event.target.style['border-top'] = '';
    } else {
      event.target.style['border-top'] = 'solid 3px blue';
      event.target.style['border-bottom'] = '';
    }
    return true;
  }

  onDragleave(event) {
    event.target.style['border-bottom'] = '';
    event.target.style['border-top'] = '';
  }

  onDrop(event, index) {
    event.stopPropagation();
    event.target.style['border-bottom'] = '';
    event.target.style['border-top'] = '';
    const sourceIndex = event.dataTransfer.getData('text');
    event.dataTransfer.clearData();
    console.log(event.currentTarget);
    console.log(event.target);

    const rep = this.responseDomain.managedRepresentation;
    if (this.domainType === DomainKind.LIST) {
        this.arraymove(rep.children, sourceIndex, index);
        this.buildPreviewResponseDomain();
    }
    // this.conceptMoved.emit( { target: this.parentId , index: index, source: sourceId } as IMoveTo);
  }

  private arraymove(arr: Category[], fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}
