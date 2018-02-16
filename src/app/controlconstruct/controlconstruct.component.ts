import { Component, EventEmitter, OnInit, AfterContentChecked } from '@angular/core';

import { ControlConstructService, ControlConstruct, Instruction, Universe } from './controlconstruct.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { Column } from '../shared/table/table.service';
import { PropertyStoreService } from '../core/global/property.service';

@Component({
  selector: 'qddt-controle-construct',
  moduleId: module.id,
  templateUrl: './controlconstruct.component.html',
  styles: [
    `.noItemFound {
        border: thick solid red;
    }`
  ],
  providers: [ControlConstructService],
})

export class ControlConstructComponent implements OnInit, AfterContentChecked {
  public error: any;
  public selectedQuestionItem: any;
  public questionItems: any[];
  public modalActions = new EventEmitter<string|MaterializeAction>();
  public questionitemActions = new EventEmitter<string|MaterializeAction>();
  public isDetail: boolean;
  public showControlConstructForm = false;
  public showProgressBar = false;
  public controlConstructs: ControlConstruct[];
  public controlConstruct: ControlConstruct;

  private showInstructionForm: boolean;
  private showUniverse = false;
  private editQuestoinItem: boolean;
  private isInstructionAfter: boolean;
  private searchKeys: string;
  private page: any;
  private selectedControlConstruct: ControlConstruct;
  private columns: Column[];
  private files: FileList;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private service: ControlConstructService, private userService: PropertyStoreService) {
    console.log('constructor ');
    this.isDetail = false;
    this.editQuestoinItem = false;
    this.showInstructionForm = false;
    this.searchKeys = '';
    this.page = {};
    this.questionItems = [];
    // this.instructions = [];
    this.controlConstructs = [];
    this.columns =
            [{ name: 'name', label: 'Construct Name', sortable: true,  direction: '' },
            { name: ['questionItem', 'name'], label: 'Question Name', sortable: true, direction: '' },
            { name: ['questionItem', 'question'], label: 'Question Text', sortable: true, direction: '' },
            { name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' }];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.showProgressBar = true;
        const args = name.split(' ');
        console.log('searchKeysSubect ' + args.length);
        this.service.searchControlConstructs(args[0], args[1] ? args[1] : '*', '0', this.getSort())
          .then((result: any) => {
            this.page = result.page;
            this.controlConstructs = result.content;
            this.showProgressBar = false;
        });
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
      this.controlConstruct = new ControlConstruct();
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
    this.service.searchControlConstructs(args[0], args[1] ? args[1] : '%', page, this.getSort()).then(
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
    this.service.create(this.controlConstruct)
      .subscribe((result: any) => {
        if (this.files !== null) {
          this.service.uploadFile(result.id, this.files)
            .subscribe((file: any) => {
              result['otherMaterials'].push(file);
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
