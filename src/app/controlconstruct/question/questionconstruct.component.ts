import { Component, EventEmitter, OnInit, AfterContentChecked } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';

import { ControlConstructService, QuestionConstruct, Instruction, Universe } from '../controlconstruct.service';
import { PropertyStoreService } from '../../core/global/property.service';
import { Column } from '../../shared/table/table.column';

@Component({
  selector: 'qddt-controle-construct',
  moduleId: module.id,
  templateUrl: './questionconstruct.component.html',
  styles: [],
})

export class QuestionConstructComponent implements OnInit, AfterContentChecked {
  public questionitemActions = new EventEmitter<string|MaterializeAction>();
  public controlConstructs: QuestionConstruct[];
  public controlConstruct: QuestionConstruct;
  public selectedQuestionItem: any;
  public selectedControlConstruct: QuestionConstruct;
  public questionItems: any[];
  public isDetail = false;
  public showControlConstructForm = false;
  public showProgressBar = false;
  public showInstructionForm = false;
  public showUniverse = false;
  public editQuestoinItem = false;
  public isInstructionAfter = false;

  private searchKeys: string;
  private page = {};
  private files: FileList;
  private searchKeysSubect: Subject<string> = new Subject<string>();
  private readonly columns = [
    new Column({ name: 'name', label: 'Construct Name', sortable: true }),
    new Column({ name: ['questionItem', 'name'], label: 'Question Name', sortable: true }),
    new Column({ name: ['questionItem', 'question'], label: 'Question Text', sortable: true }),
    new Column({ name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' })
 ];

  constructor(private service: ControlConstructService, private userService: PropertyStoreService) {
    console.log('constructor ');
    this.searchKeys = '';
    this.questionItems = [];
    this.controlConstructs = [];

    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.showProgressBar = true;
        const args = name.split(' ');
        console.log('searchKeysSubect ' + args.length);
        this.service.searchControlConstructs(args[0], args[1] ? args[1] : '*', '0', this.getSort()).then(
          (result) => {
            this.page = result.page;
            this.controlConstructs = result.content;
            this.showProgressBar = false; },
          (error) => { throw error; }
        );
      });
  }

  ngOnInit() {
    const config = this.userService.get('constructs');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.controlConstructs = config.collection;
      this.selectedControlConstruct = config.item;
      this.isDetail = true;
    } else {
      console.log('ngOnInit');
      this.searchControlConstructs('*');
    }
  }

  ngAfterContentChecked() {
    const config = this.userService.get('constructs');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.controlConstructs = config.collection;
      this.selectedControlConstruct = config.item;
      this.isDetail = true;
    } else {
      this.isDetail = false;
    }
  }

  onToggleControlConstructForm() {
    this.showControlConstructForm = !this.showControlConstructForm;
    if (this.showControlConstructForm) {
      this.controlConstruct = new QuestionConstruct();
      this.controlConstruct.preInstructions = [];
      this.controlConstruct.postInstructions = [];
      this.controlConstruct.universe = [];
      this.controlConstruct.questionItemRevision = 0;
      this.controlConstruct.questionItem = null;
      this.files = null;
    }
  }

  onToggleInstructionForm() {
    this.showInstructionForm = !this.showInstructionForm;
    if (this.showInstructionForm) {
      this.isInstructionAfter = false;
    }
  }

  onAddInstruction(instruction: Instruction) {
    if (this.isInstructionAfter) {
      this.controlConstruct.postInstructions.push(instruction);
    } else {
      this.controlConstruct.preInstructions.push(instruction);
    }
    this.showInstructionForm = false;
  }

  onAddUniverse(universe: Universe) {
    console.log(universe);
    this.controlConstruct.universe.push(universe);
  }

  onDeleteUniverse(id: number) {
    this.controlConstruct.universe.splice(id, 1);
  }

  onDeletePreInstruction(id: number) {
    this.controlConstruct.preInstructions.splice(id, 1);
  }

  onDeletePostInstruction(id: number) {
    this.controlConstruct.postInstructions.splice(id, 1);
  }

  onDetail(controlConstruct: any) {
    this.selectedControlConstruct = controlConstruct;
    this.isDetail = true;
    this.userService.set('constructs',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': this.selectedControlConstruct,
        'collection': this.controlConstructs});
  }

  hideDetail() {
    this.isDetail = false;
    this.userService.set('constructs', {'current': 'list', 'key': this.searchKeys});
  }

  onPage(page: string) {
    this.showProgressBar = true;
    const args = this.searchKeys.split(', ');
    console.log('onPage' + args);
    this.service.searchControlConstructs(args[0], args[1] ? args[1] : '*', page, this.getSort()).then(
      (result: any) => {
        this.page = result.page;
        this.controlConstructs = result.content;
        this.showProgressBar = false;
      },
      (error: any) => {
        this.showProgressBar = false;
        throw error;
      });
  }

  onCreateControlConstruct() {
    this.showControlConstructForm = false;
    this.service.createQuestion(this.controlConstruct)
      .subscribe((result) => {
        if (this.files !== null) {
          this.service.uploadFile(result.id, this.files)
            .subscribe((file: any) => {
              result.otherMaterials.push(file);
              this.controlConstructs = [result].concat(this.controlConstructs);
            });
        } else {
          this.controlConstructs = [result].concat(this.controlConstructs);
        }
      });
    this.isDetail = false;
  }

  searchControlConstructs(key: string) {
    console.log('searchControlConstructs' + key);
    this.searchKeys = key;
    this.searchKeysSubect.next(key);
  }

  searchQuestionItems(key: string) {
    this.service.searchQuestionItemsByNameAndQuestion(key).then((result: any) => {
      this.questionItems = result.content;
    });
  }

  onRemoveQuestoinItem() {
    this.controlConstruct.questionItem = null;
    this.editQuestoinItem = false;
  }

  onUploadFile(filename: any) {
    this.files = filename.target.files;
  }

  onClickQuestionItem() {
    this.questionitemActions.emit({action: 'modal', params: ['open']});
  }


  private getSort() {
    const i = this.columns.findIndex((e: any) => e.sortable && e.direction !== undefined && e.direction !== '');
    let sort = '';
    if (i >= 0) {
      if (typeof this.columns[i].name === 'string') {
        sort = this.columns[i].name + ',' + this.columns[i].direction;
      } else {
        sort = this.columns[i].name.join('.') + ',' + this.columns[i].direction;
      }
    }
    return sort;
  }
}
