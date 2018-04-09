import { Component, OnInit, AfterContentChecked, EventEmitter } from '@angular/core';
import { QuestionService, QuestionItem } from './question.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PropertyStoreService } from '../core/global/property.service';
import { Column } from '../shared/table/table.column';
import { ElementKind } from '../shared/elementinterfaces/elements';
import { Page } from '../shared/table/table.page';

@Component({
  selector: 'qddt-questionitem',
  moduleId: module.id,
  templateUrl: './question.component.html',
  styles: [':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'],
})

export class QuestionComponent implements AfterContentChecked, OnInit {

  public responseDomainAction = new EventEmitter<MaterializeAction>();
  public questionitems:  QuestionItem[];

  public showbuttoN = false;
  public showQuestionItemForm = false;
  public showProgressBar = false;
  public isDetail = false;
  public showResponsedomainReuse = false;

  public readonly QUESTION_ITEM = ElementKind.QUESTION_ITEM;
  private page = new Page();
  private questionItem: QuestionItem;
  private selectedQuestionItem: QuestionItem;

  private searchKeysListener: Subject<string> = new Subject<string>();
  private searchKeys: string;
  private secondCS: any;
  private mainresponseDomainRevision: number;



  constructor(private questionService: QuestionService, private property: PropertyStoreService, private route: ActivatedRoute) {
    this.searchKeys = '';
    this.secondCS = null;
    this.mainresponseDomainRevision = 0;
    this.searchKeysListener
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        console.log('QuestionComponent ' + name);
        this.showProgressBar = true;
        this.questionService.searchQuestionItems(name, this.page).then(
          (result) => {
            this.page = result.page;
            this.questionitems = result.content;
            this.showProgressBar = false; },
          (reason) => {
            this.showProgressBar = false;
            throw reason; }
        );
      });
  }

  ngOnInit() {
  //    this.route.paramMap
  //      .switchMap((params: ParamMap) =>
  //        params.has('id') ? this.questionItem = this.questionService.getquestion(params.get('id')) : null);

    const config = this.property.get('questions');
    if (!config) {
      this.property.set('questions', {'current': 'list', 'key': ''});
    }
    if (config && config['current'] === 'detail' ) {
      this.page = config.page;
      this.questionitems = config.collection;
      this.selectedQuestionItem = config.item;
      this.isDetail = true;
    } else {
      this.searchKeys = (config.key) ? config.key : '';
      this.searchKeysListener.next(this.searchKeys);
    }
  }

  ngAfterContentChecked() {
    const config = this.property.get('questions');
    if (config.current === 'detail' ) {
      if (config && config['current'] === 'detail' ) {
        this.page = config.page;
        this.questionitems = config.collection;
        this.selectedQuestionItem = config.item;
        this.searchKeys = config.key;
        this.isDetail = true;
      } else {
        this.isDetail = false;
        if (config.key === null || config.key === undefined) {
          this.property.set('questions', {'current': 'list', 'key': ''});
          this.searchKeys = '';
          this.searchKeysListener.next('');
        }
      }
    // Materialize.updateTextFields();
    console.log('ngAfterContentChecked');
    }
  }


  onToggleQuestionItemForm() {
    this.showQuestionItemForm = !this.showQuestionItemForm;
    if (this.showQuestionItemForm) {
      this.questionItem = new QuestionItem();
      this.questionItem.responseDomain = null;
    }
  }

  onDetail(questionItem: any) {
    this.selectedQuestionItem = questionItem;
//    this.isDetail = true;
    this.property.set('questions',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': this.selectedQuestionItem,
        'collection': this.questionitems});
  }

  onSearchTable(name: string) {
    console.log('onSearchTable ' + name);
    this.searchKeys = name;
    this.searchKeysListener.next(name);
  }



  onPage(page: Page) {
    this.showProgressBar = true;
    this.questionService.searchQuestionItems(this.searchKeys, page)
      .then(
      (result: any) => {
        this.page = result.page;
        this.questionitems = result.content;
        this.showProgressBar = false;
      });
  }

  onCreateQuestionItem() {
    this.showProgressBar = true;
    this.showQuestionItemForm = false;
    if ((this.questionItem.responseDomain) && (!this.questionItem.responseDomain.id)) {
      this.questionService.createCategory(this.questionItem.responseDomain.managedRepresentation)
        .subscribe(result => {
          this.questionItem.responseDomain.managedRepresentation = result;
          this.questionService.createResponseDomain(this.questionItem.responseDomain)
            .subscribe(result2 => {
              this.questionItem.responseDomain = result2;
              this.questionItem.responseDomainRevision = 0;
              this.questionService.updateQuestionItem(this.questionItem)
                .subscribe((result3: any) => {
                  this.questionItem = null;
                  this.questionitems = [result3].concat(this.questionitems);
                  this.showProgressBar = false;
                  // this.editQuestionItem.emit(this.questionItem);
                });
            });
        });
    } else {
      this.questionService.updateQuestionItem(this.questionItem)
        .subscribe((result: any) => {
          this.questionitems = [result].concat(this.questionitems);
          this.showProgressBar = false;
        });
    }
    this.isDetail = false;
  }

  onResponseDomainSelected(item: any) {
    this.questionItem.responseDomain = item.responseDomain;
    this.questionItem.responseDomainRevision = item.responseDomainRevision || 0;
  }

  onResponsedomainRemove(item: any) {
    this.questionItem.responseDomainRevision = 0;
    this.questionItem.responseDomain = null;
  }

  onDismiss() {
    this.responseDomainAction.emit({action: 'modal', params: ['close']});
  }

  openResponseDomainModal() {
    this.showResponsedomainReuse = true;
    this.responseDomainAction.emit({action: 'modal', params: ['open']});
  }

  hideDetail() {
    this.isDetail = false;
    this.property.set('questions', {'current': 'list', 'key': this.searchKeys});
  }

}
