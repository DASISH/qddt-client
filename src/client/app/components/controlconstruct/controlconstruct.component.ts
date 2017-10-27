import { Component, EventEmitter, OnInit, AfterContentChecked } from '@angular/core';

import { ControlConstructService, ControlConstruct, Instruction, Universe } from './controlconstruct.service';
import { UserService } from '../../shared/user/user.service';
import { Subject }          from 'rxjs/Subject';
import { Column } from '../../shared/table/table.service';
import { MaterializeAction } from 'angular2-materialize';

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

  private showControlConstructForm: boolean = false;
  private showProgressBar: boolean = false;
  private editQuestoinItem: boolean;
  private isDetail: boolean;
  private isInstructionAfter: boolean;
  private isInstructionNew: boolean;
  private showInstructionForm: boolean;
  private instruction: any;
  private instructions: any[];
  private showUniverse: boolean = false;
  private searchKeys: string;
  private page: any;
  private controlConstruct: ControlConstruct;
  private selectedControlConstruct: ControlConstruct;
  private controlConstructs: ControlConstruct[];
  private columns: Column[];
  private files: FileList;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private service: ControlConstructService, private userService: UserService) {
    console.log('constructor ');
    this.isDetail = false;
    this.editQuestoinItem = false;
    this.showInstructionForm = false;
    this.searchKeys = '';
    this.page = {};
    this.questionItems = [];
    this.instructions = [];
    this.controlConstructs = [];
    this.columns =
            [{ name:'name', label:'Construct Name', sortable: true,  direction: '' ,width:'15%'},
            { name:['questionItem', 'name'], label:'Question Name', sortable:true, direction: '' ,width:'15%'},
            { name:['questionItem','question','question'], label:'Question Text', sortable:true, direction: '' ,width:'50%'},
            { name: 'modified',  label: 'Modified', sortable: true, direction: 'desc' ,width:'8%'}];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.showProgressBar = true;
        let args = name.split(' ');
        console.log('searchKeysSubect ' + args.length);
        this.service.searchControlConstructs(args[0], args[1]?args[1]:'%','0', this.getSort()).subscribe((result: any) => {
          this.page = result.page;
          this.controlConstructs = result.content;
          this.showProgressBar = false;
        });
      });
  }

  ngOnInit() {
    let config = this.userService.getGlobalObject('constructs');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.controlConstructs = config.collection;
      this.selectedControlConstruct = config.item;
      this.isDetail = true;
    } else {
      console.log('ngOnInit');
      this.searchControlConstructs('');
    }
  }

  ngAfterContentChecked() {
    let config = this.userService.getGlobalObject('constructs');
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
      this.instruction = new Instruction();
      this.isInstructionAfter = false;
      this.isInstructionNew = false;
      this.instruction.description = '';
    }
  }

  onAddInstruction() {
    if (this.isInstructionAfter) {
      this.controlConstruct.postInstructions.push(this.instruction);
    } else {
      this.controlConstruct.preInstructions.push(this.instruction);
    }
    this.showInstructionForm = false;
  }

  onSelectInstruction(instruction: any) {
    this.instruction = instruction;
  }

  onAddUniverse(universe:Universe) {
    console.log(universe);
    this.controlConstruct.universe.push(universe);
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
    this.userService.setGlobalObject('constructs',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': this.selectedControlConstruct,
        'collection': this.controlConstructs});
  }



  hideDetail() {
    this.isDetail = false;
    this.userService.setGlobalObject('constructs', {'current': 'list', 'key': this.searchKeys});
  }

  onPage(page: string) {
    this.showProgressBar = true;
    let args = this.searchKeys.split(', ');
    console.log('onPage' + args);
    this.service.searchControlConstructs(args[0], args[1]?args[1]:'%', page, this.getSort()).subscribe(
      (result: any) => {
        this.page = result.page;
        this.controlConstructs = result.content;
        this.showProgressBar = false;
      },
      (error: any) =>this.showProgressBar = false);
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
            }, (error: any) => {
              this.popupModal(error);
            });
        } else {
          this.controlConstructs = [result].concat(this.controlConstructs);
        }
      }, (error: any) => {
        this.popupModal(error);
      });
    this.isDetail = false;
  }

  searchControlConstructs(key: string) {
    console.log('searchControlConstructs' + key);
    this.searchKeys = key;
    this.searchKeysSubect.next(key);
  }

  searchQuestionItems(key: string) {
    this.service.searchQuestionItemsByNameAndQuestion(key).subscribe((result: any) => {
      this.questionItems = result.content;
    },
      (error: any) => { this.popupModal(error); });
  }

  onRemoveQuestoinItem() {
    this.controlConstruct.questionItem = null;
    this.editQuestoinItem = false;
  }

  onUploadFile(filename: any) {
    this.files = filename.target.files;
  }

  onClickQuestionItem() {
    this.questionitemActions.emit({action:'modal', params:['open']});
  }

  onSearchInstructions(key: string) {
    this.instruction.description = key;
    this.service.searchInstructions(key).subscribe((result: any) => {
      this.instructions = result.content;
      this.isInstructionNew = this.instructions.length === 0;
    },
      (error: any) => { this.popupModal(error); });
  }



  popupModal(error: any) {
    this.error = error;
    this.modalActions.emit({action:'modal', params:['open']});
  }

  private getSort() {
    let i = this.columns.findIndex((e: any) => e.sortable && e.direction !== undefined && e.direction !== '');
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
