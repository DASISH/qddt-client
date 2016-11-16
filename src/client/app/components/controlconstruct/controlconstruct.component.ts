import { Component, OnInit, EventEmitter } from '@angular/core';

import { ControlConstructService, ControlConstruct, Instruction } from './controlconstruct.service';

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
export class ControlConstructComponent implements OnInit {

  showControlConstructForm: boolean = false;
  actions = new EventEmitter<string>();
  questionitemActions = new EventEmitter<string>();
  error: any;

  private controlConstructs: any[];
  private page: any;
  private controlConstruct: any;
  private instruction: any;
  private searchKeys: string;
  private selectedControlConstruct: any;
  private isDetail: boolean;
  private columns: any[];
  private questionItems: any[];
  private selectedQuestionItemIndex: number;
  private showInstructionForm: boolean;
  private questionItemRevisions: any[];
  private selectedQuestionItem: any;
  private instructions: any[];
  private isInstructionAfter: boolean;
  private isInstructionNew: boolean;
  private useCurrentQuestionItem: boolean;
  private concepts: any[];
  private files: FileList;

  constructor(private service: ControlConstructService) {
    this.isDetail = false;
    this.controlConstructs = [];
    this.searchKeys = '';
    this.page = {};
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true },
      { 'label': 'Question Text', 'name': ['questionItem', 'question', 'question'], 'sortable': false }];
    this.questionItems = [];
    this.selectedQuestionItemIndex = -1;
    this.showInstructionForm = false;
    this.instructions = [];
    this.useCurrentQuestionItem = true;
    this.concepts = [];
  }

  ngOnInit() {
    this.searchQuestionItems('');
  }

  onToggleControlConstructForm() {
    this.showControlConstructForm = !this.showControlConstructForm;
    if (this.showControlConstructForm) {
      this.controlConstruct = new ControlConstruct();
      this.controlConstruct.preInstructions = [];
      this.controlConstruct.postInstructions = [];
      this.controlConstruct.revisionNumber = 0;
      this.questionItemRevisions = [];
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

  onDeletePreInstruction(id: number) {
    this.controlConstruct.preInstructions.splice(id, 1);
  }

  onDeletePostInstruction(id: number) {
    this.controlConstruct.postInstructions.splice(id, 1);
  }

  onDetail(category: any) {
    this.selectedControlConstruct = category;
    this.isDetail = true;
  }

  hideDetail() {
    this.isDetail = false;
  }

  onPage(page: string) {
    console.log(page);
  }

  onCreateControlConstruct() {
    this.showControlConstructForm = false;
    this.service.create(this.controlConstruct)
      .subscribe((result: any) => {
        this.controlConstructs.push(result);
        this.service.uploadFile(result.id, this.files)
          .subscribe((result: any) => {
            console.log(result);
          }, (error: any) => {
            this.popupModal(error);
          });
      }, (error: any) => {
        this.popupModal(error);
      });
    this.isDetail = false;
  }

  searchControlConstructs(key: string) {
    console.log(key);
  }

  searchQuestionItems(key: string) {
    this.service.searchQuestionItemsByNameAndQuestion(key).subscribe((result: any) => {
      this.questionItems = result.content;
    },
      (error: any) => { this.popupModal(error); });
  }

  onSelectCreateQuestionItem(questionItem: any) {
    this.controlConstruct.questionItem = questionItem;
    this.useCurrentQuestionItem = true;
    this.service.getQuestionItemsRevisions(questionItem.id).subscribe((result: any) => {
      this.questionItemRevisions = result.content.filter((e: any) =>
      e.entity.changeKind !== 'IN_DEVELOPMENT'
      && e.entity.changeKind !== 'UPDATED_HIERARCY_RELATION');
    },
      (error: any) => { this.popupModal(error); });
    this.concepts = [];
    this.service.getConceptsByQuestionitemId(questionItem.id)
      .subscribe(
        (result: any) => { this.concepts = result; },
        (error: any) => { this.popupModal(error); });
  }

  onSelectQuestionItem(questionItem: any) {
    this.selectedQuestionItem = questionItem;
    this.service.getControlConstructsByQuestionItem(questionItem.id).subscribe((result: any) => {
      this.controlConstructs = result;
    },
      (error: any) => { this.popupModal(error); });
  }

  onUploadFile(filename: any) {
    this.files = filename.target.files;
  }

  onClickQuestionItem() {
    this.questionitemActions.emit('openModal');
  }

  onSearchInstructions(key: string) {
    this.instruction.description = key;
    this.service.searchInstructions(key).subscribe((result: any) => {
      this.instructions = result.content;
      this.isInstructionNew = this.instructions.length === 0;
    },
      (error: any) => { this.popupModal(error); });
  }

  onSelectInstruction(instruction: any) {
    this.instruction = instruction;
  }

  private popupModal(error: any) {
    this.error = error;
    this.actions.emit('openModal');
  }
}
