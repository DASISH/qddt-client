import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService, Category, ResponseCardinality } from '../category/category.service';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { Observable }     from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';

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

export class ResponsedomainFormComponent implements OnInit {
  @Input() responsedomain: any;
  @Input() domainType: DomainType;
  @Input() readonly: boolean;
  @Output() formChange: EventEmitter<any>;

  basedonActions = new EventEmitter<string|MaterializeAction>();
  previewResponseDomain: any;
  basedonObject: any;

  public domainTypeDef = DomainType;
  private categories: any;
  // private codes: string[];
  private selectedCategoryIndex: number;
  private suggestions: Category[];
  private numberOfAnchors: number;

  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private categoryService: CategoryService, private service: ResponseDomainService) {
    // this.codes = [];
    this.selectedCategoryIndex = 0;
    this.formChange = new EventEmitter<any>();
    this.numberOfAnchors = 0;
    // this.usedBy = [];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.categoryService.getAllByLevel('ENTITY', name).subscribe((result: any) => {
          this.categories = result.content;
        });
      });
  }

  ngOnInit() {
    console.debug('ngOnInit....debug');
    if(this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
    if(this.responsedomain === null || this.responsedomain === undefined) {
      return;
    }
    if(this.responsedomain.responseCardinality === undefined) {
      console.debug('responseCardinality === undefined');
      this.responsedomain.responseCardinality =  new ResponseCardinality();
    }
    if (this.responsedomain.managedRepresentation === undefined) {
      console.debug('managedRepresentation === undefined');
      this.responsedomain.managedRepresentation = new Category();
    }
    if (this.responsedomain.managedRepresentation.inputLimit === undefined) {
      console.debug('managedRepresentation.inputLimit === undefined');
      this.responsedomain.managedRepresentation.inputLimit = new ResponseCardinality();
    }
    if (this.responsedomain.managedRepresentation.children === undefined) {
      console.debug('managedRepresentation.children === undefined');
      this.responsedomain.managedRepresentation.children = [];
    }
    this.responsedomain.managedRepresentation.categoryType =
      DomainTypeDescription.find(e=>e.id === this.domainType).categoryType;
      this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;

    if (this.domainType === DomainType.SCALE) {
      if(typeof this.responsedomain.displayLayout === 'string') {
        this.responsedomain.displayLayout = parseInt(this.responsedomain.displayLayout);
      }
      if (this.responsedomain.displayLayout !== 90) {
        this.responsedomain.displayLayout = 0;
      }
    }

    this.categoryService.getAllByLevel('ENTITY').subscribe((result: any) => {
      this.categories = result.content;
    });
    this.previewResponseDomain = this.responsedomain;
  }

  select(candidate: any) {
    console.info('onSelect...');
    candidate.code = this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].code;
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex] = candidate;
    this.buildPreviewResponseDomain();
  }

  onSave() {
    console.debug('onSave...');
    this.responsedomain.label = this.responsedomain.name;
    let category = this.responsedomain.managedRepresentation;
    let source = Observable.range(0, category.children.length)
      .concatMap((x: any) => {
        let c = category.children[x];
        if (c.isNew === true) {
          let newCategory = new Category();
          newCategory.label = c.label;
          newCategory.name = c.label;
          newCategory.description = '';
          return this.categoryService.save(newCategory);
        } else {
          return Observable.of(c);
        }
      });

    let index = 0;
    let changeEvent = this.formChange;
    let rd = this.responsedomain;
    let service = this.categoryService;

    source.subscribe(
      function (x: any) {
        if (index < category.children.length) {
          if(category.children[index].isNew === true) {
            x.code = category.children[index].code;
          }
          category.children[index] = x;
          index = index + 1;
        }
      },
      function (err: any) {
        console.log('Error: %s', err);
      },
      function () {
        if (category.id !== undefined && category.id !== '') {
          console.info('cateogy ok');
          changeEvent.emit(rd);
        } else {
          console.info('saving categories....');
          category.name = rd.name;
          category.description = '';
          category.label = category.name;
          service.save(category)
            .subscribe((result: any) => {
              for (let i = 0; i < category.children.length; i++) {
                result.children[i].code = category.children[i].code;
              }
              rd.managedRepresentation = result;
              changeEvent.emit(rd);
            });
        }
      });
    console.debug('save finished');
  }

  changeNumberOfCategories(num: number) {
    this.responsedomain.managedRepresentation.inputLimit.maximum  = num;
    this.changeNumberOfAnchors(num);
  }

  changeNumberOfAnchors(num: number) {
    let rep = this.responsedomain.managedRepresentation;
    if(rep.children.length === num) {
      return;
    }
    let count = rep.inputLimit.maximum - rep.inputLimit.minimum + 1;
    if (count < num) {
      this.numberOfAnchors = count;
    } else if (num < 0) {
      this.numberOfAnchors = 0;
    } else {
      this.numberOfAnchors = num;
    }

    if (this.domainType === DomainType.LIST) {
      rep.children = rep.children.slice(0, this.numberOfAnchors);
      for (let i = rep.children.length; i < this.numberOfAnchors; i++) {
        let c = new Category();
        c.code = { codeValue: String(i + 1) , alignment:''};
        rep.children.push(c);
      }
    } else if (this.domainType === DomainType.SCALE) {
      rep.children = rep.children.slice(0, this.numberOfAnchors);
      let len = rep.children.length;
      for (let i = 0; i < this.numberOfAnchors; i++) {
        if(i >= len) {
          let c = new Category();
          c.code = { codeValue: '', alignment:'text-left' };
          rep.children.push(c);
        } else {
          rep.children[i].code.codeValue = '';
        }
      }
    }
    this.buildPreviewResponseDomain();
  }

  searchCategories(name: string) {
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].isNew = true;
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].label = name;
    this.searchKeysSubect.next(name);
  }

  onClickClear(idx: number) {
    let rep = this.responsedomain.managedRepresentation;
    if (this.domainType === DomainType.LIST) {
      if ( idx < rep.children.length) {
        let c = new Category();
        c.code = rep.children[idx].code;
        rep.children[idx] = c;
        this.buildPreviewResponseDomain();
      }
    }
  }

  onClickUp(idx: number) {
    let rep = this.responsedomain.managedRepresentation;
    if (this.domainType === DomainType.LIST) {
      if ( idx < rep.children.length && idx > 0) {
        let prev = rep.children[idx - 1];
        let curr = rep.children[idx];
        let code = curr.code;
        curr.code = prev.code;
        rep.children[idx - 1] = curr;
        prev.code = code;
        rep.children[idx] = prev;
        this.buildPreviewResponseDomain();
      }
    }
  }

  onClickDown(idx: number) {
    let rep = this.responsedomain.managedRepresentation;
    if (this.domainType === DomainType.LIST) {
      if ( idx < (rep.children.length - 1) && idx >= 0) {
        let next = rep.children[idx + 1];
        let curr = rep.children[idx];
        let code = curr.code;
        curr.code = next.code;
        rep.children[idx + 1] = curr;
        next.code = code;
        rep.children[idx] = next;
        this.buildPreviewResponseDomain();
      }
    }
  }

  onChangeDegreeSlope(degree: any) {
    if(typeof degree === 'string') {
      this.responsedomain.displayLayout = parseInt(degree);
    } else {
      this.responsedomain.displayLayout = degree;
    }
    this.buildPreviewResponseDomain();
  }

  onSelectAligment(value: any, idx:any) {
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
  }


  onBasedonObjectDetail(ref:any) {
    if (this.isNull(ref.rev))
      ref.rev=0;
    this.service.getResponseDomainsRevision(ref.id,ref.rev)
      .subscribe(
        (result: any) => {
          this.basedonObject = result.entity;
          this.basedonActions.emit({action:'modal', params:['open']});
        },
        (err: any) => null
      );
  }

  private isNull(object: any) {
    return object === undefined || object === null;
  }

}
