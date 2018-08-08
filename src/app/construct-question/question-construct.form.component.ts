import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionItem } from '../question/question.classes';
import {ActionKind, ElementKind} from '../shared/classes/enums';
import { ElementRevisionRef, Page } from '../shared/classes/classes';
import { QuestionConstruct } from './question-construct.classes';
import { Instruction, Universe } from '../controlconstruct/controlconstruct.classes';
import { TemplateService } from '../template/template.service';
import { IRevisionResult, IElement, IRevisionRef, IOtherMaterial } from '../shared/classes/interfaces';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-question-construct-form',
  moduleId: module.id,
  templateUrl: 'question-construct.form.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class QuestionConstructFormComponent   {
  @Input() controlConstruct: QuestionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionConstruct>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public readonly QUESTION = ElementKind.QUESTION_ITEM;

  public readonly formId = Math.round( Math.random() * 10000);

  /* public savedQuestionItem: any; */
  public instructionList: Instruction[];
  public universeList: Universe[];
  public questionList: QuestionItem[];
  public revisionResults: IRevisionResult<QuestionItem>[];

  public showUploadFileForm: boolean;
  public showProgressBar = false;

  public fileStore: File[] = [];
  private toDeleteFiles: IOtherMaterial[] = [];


  constructor(private service: TemplateService) {
    this.showUploadFileForm = false;
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.CONTROL_CONSTRUCT);

  }

  onAddUniverse(item: IElement) {
    this.controlConstruct.universe.push(item.element);
  }

  onAddPreInstruction(item: IElement) {
    this.controlConstruct.preInstructions.push(item.element);
  }

  onAddPostInstruction(item: IElement) {
    this.controlConstruct.postInstructions.push(item.element);
  }

  onInstructionSearch(key: string) {
    this.service.searchByKind<Instruction>( {kind: this.INSTRUCTION, key: key , page: new Page() }).then(
      (result) => {
        this.instructionList = result.content;
      });
  }

  onUniverseSearch(key: string) {
    this.service.searchByKind<Universe>(  {kind: this.UNIVERSE, key: key, page: new Page() }).then(
      (result) => {
        this.universeList = result.content;
      });
  }

  onQuestionSearch(key: IElement) {
    this.service.searchByKind<QuestionItem>( {kind: this.QUESTION, key: key.element, page: new Page() } ).then(
      (result) => {
        this.questionList = result.content;
      });
  }

  public onDismiss() {
    this.revisionResults = null;
    this.questionList = null;
  }

  onRevisionSearch(item: IRevisionRef) {
    this.service.getRevisionsByKind<QuestionItem>(this.QUESTION, item.elementId ).then(
      (result) => {
        this.revisionResults = result.content;
      });

  }

  onRevisionSelect(ref: ElementRevisionRef ) {
    this.controlConstruct.questionItem = ref.element;
    this.controlConstruct.questionItemRevision = ref.elementRevision;
    this.questionList = [];
    this.revisionResults = [];
  }

  onRemoveQuestionItem() {
    this.controlConstruct.questionItem = null;
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data) => { filesaver.saveAs(data, fileName); },
      (error) => { throw error; });
  }

  onSelectFile(filename: any) {
    const list = filename.target.files as FileList;
    for (let i = 0; i < list.length; i++) {
      this.fileStore.push(list.item(i));
    }
    this.showUploadFileForm = false;
  }

  onMarkForDeletion(idx: number) {
    if (this.controlConstruct.otherMaterials
      && this.controlConstruct.otherMaterials.length > idx) {
      const items = this.controlConstruct.otherMaterials.splice(idx, 1);
      if (items.length > 0) {
        this.toDeleteFiles.push(items[0]);
      }
    }
  }

  onDeleteFileFromLocal(idx: number) {
    if (this.fileStore && this.fileStore.length > idx) {
      this.fileStore.splice(idx, 1);
    }
  }

  async onSaveForm() {

    const formData: FormData = new FormData();
    const qc = this.controlConstruct;
    formData.append('controlconstruct', JSON.stringify(qc));
    this.fileStore.forEach( (file) => { formData.append('files', file); });

    const result = await this.service.updateWithfiles(ElementKind.QUESTION_CONSTRUCT, formData).toPromise();
    this.controlConstruct = result;
      this.modifiedEvent.emit(this.controlConstruct);

  }

}
