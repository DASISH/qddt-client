import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService, Category, ResponseCardinality } from '../category/category.service';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { Observable }     from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
  responsedomainActions = new EventEmitter<string>();
  basedonActions = new EventEmitter<string>();
  previewResponseDomain: any;
  basedonObject: any;

  public domainTypeDef = DomainType;
  private categories: any;
  private codes: string[];
  private selectedCategoryIndex: number;
  private suggestions: Category[];
  private numberOfAnchors: number;
  private usedBy: any[];
  private selectedId: string;
  private selectedType: string;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private categoryService: CategoryService, private service: ResponseDomainService) {
    this.codes = [];
    this.selectedCategoryIndex = 0;
    this.formChange = new EventEmitter<any>();
    this.numberOfAnchors = 0;
    this.usedBy = [];
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
    if(this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
    if(this.responsedomain.responseCardinality === undefined) {
      this.responsedomain.responseCardinality = { 'minimum': 1, 'maximum': 1 };
    }
    if (this.responsedomain.managedRepresentation === undefined) {
      this.responsedomain.managedRepresentation = new Category();
    }
    if (this.responsedomain.managedRepresentation.inputLimit === undefined) {
      this.responsedomain.managedRepresentation.inputLimit = new ResponseCardinality();
      this.responsedomain.managedRepresentation.inputLimit = { 'minimum': 1, 'maximum': 1 };
    }
    if (this.responsedomain.managedRepresentation.children === undefined) {
      this.responsedomain.managedRepresentation.children = [];
    }
    if (this.domainType === DomainType.SCALE) {
      this.responsedomain.managedRepresentation.categoryType = 'SCALE';
      this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;
    } else if (this.domainType === DomainType.NUMERIC) {
      this.responsedomain.managedRepresentation.categoryType = 'NUMERIC';
    } else if (this.domainType === DomainType.TEXT) {
      this.responsedomain.managedRepresentation.categoryType = 'TEXT';
    } else {
      this.responsedomain.managedRepresentation.categoryType = 'LIST';
      this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;
    }
    if (this.domainType === DomainType.SCALE) {
      if(typeof this.responsedomain.displayLayout === 'string') {
        this.responsedomain.displayLayout = parseInt(this.responsedomain.displayLayout);
      }
      if (this.responsedomain.displayLayout !== 90) {
        this.responsedomain.displayLayout = 0;
      }
    }
    if (this.domainType === DomainType.SCALE || this.domainType === DomainType.LIST) {
      let categoryType = DomainTypeDescription.find((e: any)=>e.id === this.domainType).categoryType;
      this.categoryService.getAllTemplatesByCategoryKind(categoryType)
        .subscribe((result: any) => this.suggestions = result.content);
    } else {
      let categoryType = DomainTypeDescription.find((e: any)=>e.id === this.domainType).categoryType;
      this.categoryService.getByCategoryKind(categoryType, '')
        .subscribe((result: any) => this.suggestions = result.content);
    }
    this.categoryService.getAllByLevel('ENTITY').subscribe((result: any) => {
      this.categories = result.content;
    });
    this.buildUsedBy();
    this.previewResponseDomain = this.responsedomain;
  }

  onClickStudy(id: string) {
    this.selectedId = id;
    this.selectedType = 'study';
    this.responsedomainActions.emit('openModal');
  }

  onClickTopic(id: string) {
    this.selectedId = id;
    this.selectedType = 'topic';
    this.responsedomainActions.emit('openModal');
  }

  onClickQuestion(id: string) {
    this.selectedId = id;
    this.selectedType = 'question';
    this.responsedomainActions.emit('openModal');
  }

  onClickResponsedomain(id: string) {
    this.selectedId = id;
    this.selectedType = 'responsedomain';
    this.responsedomainActions.emit('openModal');
  }

  select(candidate: any) {
    candidate.code = this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex].code;
    this.responsedomain.managedRepresentation.children[this.selectedCategoryIndex] = candidate;
    this.buildPreviewResponseDomain();
  }

  save() {
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
          changeEvent.emit(rd);
        } else {
          category.name = 'category scheme for ' + rd.name;
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
        c.code = { codeValue: String(i + 1) };
        rep.children.push(c);
      }
    } else if (this.domainType === DomainType.SCALE) {
      rep.children = rep.children.slice(0, this.numberOfAnchors);
      let len = rep.children.length;
      for (let i = 0; i < this.numberOfAnchors; i++) {
        if(i >= len) {
          let c = new Category();
          c.code = { codeValue: '' };
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

  buildPreviewResponseDomain() {
    this.previewResponseDomain = {};
    this.previewResponseDomain['id'] = this.responsedomain['id'];
    this.previewResponseDomain['description'] = this.responsedomain['description'];
    this.previewResponseDomain['name'] = this.responsedomain['name'];
    this.previewResponseDomain['label'] = this.responsedomain['label'];
    this.previewResponseDomain['responseKind'] = this.responsedomain['responseKind'];
    this.previewResponseDomain['managedRepresentation'] = this.responsedomain.managedRepresentation;
    this.previewResponseDomain['responseCardinality'] = this.responsedomain.responseCardinality;
    this.previewResponseDomain['displayLayout'] = this.responsedomain.displayLayout;
  }

  onBasedonObjectDetail(id: string) {
    this.service.getResponseDomain(id)
      .subscribe(
      (result: any) => {
        this.basedonObject = result;
        this.basedonActions.emit('openModal');
      },
      (err: any) => null
      );
  }

  private buildUsedBy() {
    let usedBy = [];
    if(this.responsedomain.questionRefs && this.responsedomain.questionRefs.length > 0) {
      this.responsedomain.questionRefs.forEach((qRef: any) => {
        if(qRef.conceptRefs.length > 0) {
          qRef.conceptRefs.forEach((ref: any) => {
            let index = usedBy.findIndex((e:any) => e.topic.id === ref.topicRef.id && e.study.id === ref.topicRef.studyRef.id);
            if(index >= 0) {
              let i = usedBy[index].questions.findIndex((e:any) => e.id === qRef.id);
              if(i < 0) {
                usedBy[index].questions.push({id: qRef.id, name: qRef.name});
              }
            } else {
              let item = {
                topic: {id: ref.topicRef.id, name: ref.topicRef.name},
                study: {id: ref.topicRef.studyRef.id, name: ref.topicRef.studyRef.name},
                questions: [{id: qRef.id, name: qRef.name}]};
              usedBy.push(item);
            }
          });
        } else {
          let item = {
            topic: {id: '', name: ''},
            study: {id: '', name: ''},
            questions: [{id: qRef.id, name: qRef.name}]};
          usedBy.push(item);
        }
      });
      usedBy.forEach((item: any) => {
        if (item.questions.length <= 0) {
          this.usedBy.push({topic: item.topic, study: item.study});
        } else {
          this.usedBy.push({topic: item.topic, study: item.study,
            question: {id: item.questions[0].id, name: item.questions[0].name}});
          for(let i = 1; i < item.questions.length; i++) {
            this.usedBy.push({question: {id: item.questions[i].id, name: item.questions[i].name}});
          }
        }
      });
    }
  }
}
