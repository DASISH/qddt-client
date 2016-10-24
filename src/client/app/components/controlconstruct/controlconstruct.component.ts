import { Component, OnInit, EventEmitter } from '@angular/core';

import { ControlConstructService, ControlConstruct, Instruction } from './controlconstruct.service';

@Component({
  selector: 'qddt-controle-construct',
  moduleId: module.id,
  templateUrl: './controlconstruct.component.html',
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

  constructor(private service: ControlConstructService) {
    this.isDetail = false;
    this.controlConstructs = [];
    this.searchKeys = '';
    this.page = {};
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true }];
    this.questionItems = [];
    this.selectedQuestionItemIndex = -1;
    this.showInstructionForm = false;
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
      this.questionItemRevisions = [];
    }
  }

  onToggleInstructionForm() {
    this.showInstructionForm = !this.showInstructionForm;
    if (this.showInstructionForm) {
      this.instruction = new Instruction();
      this.instruction.isAfter = false;
    }
  }

  onAddInstruction() {
    if (this.instruction.isAfter) {
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
    this.service.save(this.controlConstruct)
      .subscribe((result: any) => {
        this.controlConstructs.push(result);
      }, (error: any) => {
        this.popupModal(error);
      });
    this.isDetail = false;
  }

  searchControlConstructs(key: string) {
    console.log(key);
  }

  searchQuestionItems(key: string) {
    this.service.searchQuestionItems(key).subscribe((result: any) => {
      this.questionItems = result.content;
    },
      (error: any) => { this.popupModal(error); });
  }

  onSelectCreateQuestionItem(questionItem: any) {
    this.controlConstruct.questionItem = questionItem;
    this.service.getQuestionItemsRevisions(questionItem.id).subscribe((result: any) => {
      this.questionItemRevisions = result.content.filter((e: any) => e.entity.changeKind !== 'IN_DEVELOPMENT');
    },
      (error: any) => { this.popupModal(error); });
  }

  onSelectQuestionItem(questionItem: any) {
    this.selectedQuestionItem = questionItem;
    this.service.getControlConstructsByQuestionItem(questionItem.id).subscribe((result: any) => {
      this.controlConstructs = result;
    },
      (error: any) => { this.popupModal(error); });
  }

  onUploadFile(filename: string) {
    console.log(filename);
  }

  onClickQuestionItem() {
    this.questionitemActions.emit('openModal');
  }

  private popupModal(error: any) {
    this.error = error;
    this.actions.emit('openModal');
  }
}
