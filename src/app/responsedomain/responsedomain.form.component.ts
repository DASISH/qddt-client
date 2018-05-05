import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { TemplateService } from '../template/template.service';
import { DomainKind, ResponseDomain, DATE_FORMAT } from './responsedomain.classes';
import { Category } from '../category/category.classes';
import { Page } from '../shared/classes/classes';
import { ActionKind, ElementKind} from '../shared/classes/enums';
import { IElement, IPageSearch} from '../shared/classes/interfaces';
import { QddtPropertyStoreService } from '../core/global/property.service';

declare let Materialize: any;

@Component({
  selector: 'qddt-responsedomain-form',
  moduleId: module.id,
  templateUrl: './responsedomain.form.component.html',
})


export class ResponseFormComponent implements OnInit , OnChanges,  OnDestroy {
  @Input() responsedomain: ResponseDomain;
  @Input() readonly: boolean;
  @Output() modifiedEvent = new EventEmitter<ResponseDomain>();

  public previewResponseDomain: any;

  public readonly CATEGORY = ElementKind.CATEGORY;
  public domainTypeDef = DomainKind;
  public dateFormatOption = DATE_FORMAT;
  public numberOfAnchors: number;
  public selectedCategoryIndex: number;
  public domainType: DomainKind;
  public categories: Category[];

  private pageSearch: IPageSearch;
  private ok = true;

  constructor(private service: TemplateService, private properties: QddtPropertyStoreService) {

    this.selectedCategoryIndex = 0;
    this.numberOfAnchors = 0;
    this.pageSearch = { kind: this.CATEGORY, key: '*', page: new Page(), sort: 'name,asc' };
    const page = this.getPageSearch();
    this.domainType = (page) ? DomainKind[page.keys.get('ResponseKind')] : DomainKind.SCALE;
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.RESPONSEDOMAIN);

  }

  ngOnInit() {

    if (!this.readonly) { this.readonly = false; }

    if (!this.responsedomain) { return; }

    this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;

    if (this.domainType === DomainKind.SCALE) {
      if (this.responsedomain.displayLayout !== '90') {
        this.responsedomain.displayLayout = '0';
      }
    }

    this.previewResponseDomain = this.responsedomain;

    // haven't really looked into how to handle form groups or binds using ngModel
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.responsedomain) {
      const page = this.getPageSearch();
      this.domainType = (page) ? DomainKind[page.keys.get('ResponseKind')] : DomainKind.SCALE;
      this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;
      this.buildPreviewResponseDomain();
    }
  }

  ngOnDestroy(): void {
    this.ok = false;
  }


  onSelectCategory(item: IElement) {
    // console.debug('onSelect...');
    item.element.code = this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].code;
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex] = item.element;
    this.buildPreviewResponseDomain();
  }

  onSearchCategories(name: string) {
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex]['isNew'] = true;
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].label = name;
    this.pageSearch.key = name;
    this.service.searchByKind<Category>(this.pageSearch).then(
      (result) => this.categories = result.content
    );
  }

  onSave() {
    this.responsedomain.label = this.responsedomain.name;
    const managed = this.responsedomain.managedRepresentation;
    managed.name = this.responsedomain.label;
    this.service.update(managed)
      .takeWhile(() => this.ok )
      .subscribe((result: Category) => {
        this.responsedomain.managedRepresentation = result;
        this.service.update(this.responsedomain).subscribe(
          (rdResult) => {
            this.responsedomain = rdResult;
            this.modifiedEvent.emit(rdResult);
          }
        );
    });
  }

  changeNumberOfCategories(num: number) {
    this.responsedomain.managedRepresentation.inputLimit.maximum  = num;
    this.changeNumberOfAnchors(num);
  }

  onSelectDateFormatChange(format: string) {
    this.responsedomain.managedRepresentation.format = format;
    this.buildPreviewResponseDomain();
  }

  changeNumberOfAnchors(num: number) {
    const rep = this.responsedomain.managedRepresentation;
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

    if (this.domainType === DomainKind.LIST) {
      rep.children = rep.children.slice(0, this.numberOfAnchors);
      for (let i = rep.children.length; i < this.numberOfAnchors; i++) {
        const c = new Category();
        c.code = { codeValue: String(i + 1) , alignment: ''};
        rep.children.push(c);
      }
    } else if (this.domainType === DomainKind.SCALE) {
      rep.children = rep.children.slice(0, this.numberOfAnchors);
      const len = rep.children.length;
      for (let i = 0; i < this.numberOfAnchors; i++) {
        if (i >= len) {
          const c = new Category();
          c.code = { codeValue: '', alignment: 'text-left' };
          rep.children.push(c);
        } else {
          rep.children[i].code.codeValue = '';
        }
      }
    }
    this.buildPreviewResponseDomain();
  }


  onClickClear(idx: number) {
    const rep = this.responsedomain.managedRepresentation;
    if (this.domainType === DomainKind.LIST) {
      if ( idx < rep.children.length) {
        const c = new Category();
        c.code = rep.children[idx].code;
        rep.children[idx] = c;
        this.buildPreviewResponseDomain();
      }
    }
  }

  onClickUp(idx: number) {
    const rep = this.responsedomain.managedRepresentation;
    if (this.domainType === DomainKind.LIST) {
      if ( idx < rep.children.length && idx > 0) {
        const prev = rep.children[idx - 1];
        const curr = rep.children[idx];
        const code = curr.code;
        curr.code = prev.code;
        rep.children[idx - 1] = curr;
        prev.code = code;
        rep.children[idx] = prev;
        this.buildPreviewResponseDomain();
      }
    }
  }

  onClickDown(idx: number) {
    const rep = this.responsedomain.managedRepresentation;
    if (this.domainType === DomainKind.LIST) {
      if ( idx < (rep.children.length - 1) && idx >= 0) {
        const next = rep.children[idx + 1];
        const curr = rep.children[idx];
        const code = curr.code;
        curr.code = next.code;
        rep.children[idx + 1] = curr;
        next.code = code;
        rep.children[idx] = next;
        this.buildPreviewResponseDomain();
      }
    }
  }

  onChangeDegreeSlope(degree: string) {
    this.responsedomain.displayLayout = degree;
    this.buildPreviewResponseDomain();
  }

  onSelectAligment(value: any, idx: any) {
    console.log('onSelectAligment ' + value + ' ' + idx);
    this.responsedomain.managedRepresentation.children[idx].code.alignment = value;
    this.buildPreviewResponseDomain();
  }

  buildPreviewResponseDomain() {
    this.previewResponseDomain = new ResponseDomain(this.responsedomain);
  }

  power10(format: number): number {
    return 1 / Math.pow(10, format);
  }

  subtract(value1, value2): number {
    return parseInt(value1) - parseInt(value2);
  }

  addition(value1, value2): number {
    return parseInt(value1) + parseInt(value2);
  }

  private getPageSearch(): IPageSearch {
    return this.properties.get('responsedomains');
  }

}
