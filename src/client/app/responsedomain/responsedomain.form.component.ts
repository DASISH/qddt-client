import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { CategoryService, Category } from '../category/category.service';
import { DomainKind, DomainTypeDescription } from './responsedomain.constant';
import { DATE_FORMAT, ResponseDomain, ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind, QddtElement, QddtElements } from '../preview/preview.service';

declare let Materialize: any;

@Component({
  selector: 'qddt-responsedomain-form',
  moduleId: module.id,
  templateUrl: './responsedomain.form.component.html',
  styles: [
    `.noItemFound {
        border: thick solid red;
    }`
  ],
  providers: [CategoryService],
})


export class ResponsedomainFormComponent implements OnInit , AfterViewInit {
  @Input() responsedomain: ResponseDomain;
  @Input() domainType: DomainKind;
  @Input() readonly: boolean;
  @Input() labelColor: string;
  @Output() formChange: EventEmitter<any>;

  basedonActions = new EventEmitter<string|MaterializeAction>();
  previewResponseDomain: any;
  basedonObject: any;

  public domainTypeDef = DomainKind;
  public dateFormatOption = DATE_FORMAT;
  private today: number = Date.now();
  private categories: Category[];
  private showbuttons = false;
  private selectedCategoryIndex: number;
  private suggestions: Category[];
  private numberOfAnchors: number;
  private endMin: number;
  private startMax: number;
  private searchKeysSubect: Subject<string> = new Subject<string>();
  private readonly  CATEGORY_KIND: QddtElement= QddtElements[ElementKind.CATEGORY];

  constructor(private categoryService: CategoryService, private service: ResponseDomainService) {
    // console.debug('responsedomain.form.component constr');
    this.selectedCategoryIndex = 0;
    this.formChange = new EventEmitter<any>();
    this.numberOfAnchors = 0;

    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.categoryService.getByCategoryKind('CATEGORY', name).then((result: any) => {
          this.categories = result.content;
        });
      });
  }

  ngAfterViewInit() {
    // console.debug('responsedomain.form.component ngAfterViewChecked');
    Materialize.updateTextFields();
  }

  ngOnInit() {
    // console.debug('ngOnInit....debug');
    if (!this.readonly) {
      this.readonly = false;
    }
    if (!this.responsedomain) {
      return;
    }
    if (!this.responsedomain.managedRepresentation)
      this.responsedomain.managedRepresentation = new Category();
    this.responsedomain.managedRepresentation.categoryType =
      DomainTypeDescription.find(e => e.id === this.domainType).categoryType;
      this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;

    if (this.domainType === DomainKind.SCALE) {
      if (typeof this.responsedomain.displayLayout === 'string') {
        this.responsedomain.displayLayout = parseInt(this.responsedomain.displayLayout);
      }
      if (this.responsedomain.displayLayout !== 90) {
        this.responsedomain.displayLayout = 0;
      }
    }

    this.categoryService.getByCategoryKind('CATEGORY').then((result: any) => {
      this.categories = result.content;
    });
    this.previewResponseDomain = this.responsedomain;

    // haven't really looked into how to handle form groups or binds using ngModel
  }

  select(candidate: any) {
    // console.debug('onSelect...');
    candidate.code = this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].code;
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex] = candidate;
    this.buildPreviewResponseDomain();
  }

  onSave() {
    this.responsedomain.label = this.responsedomain.name;
    const managed = this.responsedomain.managedRepresentation;
    managed.name = this.responsedomain.label;
    const changeEvent = this.formChange;
    this.categoryService.save(managed)
      .subscribe((result: Category) => {
        this.responsedomain.managedRepresentation = result;
        changeEvent.emit(this.responsedomain);
    });
  }

  changeNumberOfCategories(num: number) {
    this.responsedomain.managedRepresentation.inputLimit.maximum  = num;
    this.changeNumberOfAnchors(num);
  }

  onSelectDateFormatChange(format: string) {
    this.responsedomain.managedRepresentation.format = format;
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

  searchCategories(name: string) {
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex]['isNew'] = true;
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].label = name;
    this.searchKeysSubect.next(name);
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

  onChangeDegreeSlope(degree: any) {
    if (typeof degree === 'string') {
      this.responsedomain.displayLayout = parseInt(degree);
    } else {
      this.responsedomain.displayLayout = degree;
    }
    this.buildPreviewResponseDomain();
  }

  onSelectAligment(value: any, idx: any) {
    console.log('onSelectAligment ' + value + ' ' + idx);
    this.responsedomain.managedRepresentation.children[idx].code.alignment = value;
    this.buildPreviewResponseDomain();
  }

  buildPreviewResponseDomain() {
    this.previewResponseDomain = {};
    this.previewResponseDomain['id'] = this.responsedomain.id;
    this.previewResponseDomain['description'] = this.responsedomain.description;
    this.previewResponseDomain['name'] = this.responsedomain.name;
    this.previewResponseDomain['label'] = this.responsedomain.label;
    this.previewResponseDomain['responseKind'] = this.responsedomain.responseKind;
    this.previewResponseDomain['managedRepresentation'] = this.responsedomain.managedRepresentation;
    this.previewResponseDomain['responseCardinality'] = this.responsedomain.responseCardinality;
    this.previewResponseDomain['displayLayout'] = this.responsedomain.displayLayout;
    console.log(this.responsedomain.managedRepresentation.inputLimit);
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

  onBasedonObjectDetail(ref: any) {
    if (!ref.rev)
        ref.rev = 0;
    this.service.getResponseDomainsRevision(ref.id, ref.rev)
      .then(
        (result: any) => {
          this.basedonObject = result.entity;
          this.basedonActions.emit({action: 'modal', params: ['open']});
        }
      );
  }

}
