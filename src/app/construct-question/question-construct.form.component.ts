import { Component, Input, Output, EventEmitter,  OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { QuestionItem } from '../question/question.classes';
import { ElementKind } from '../shared/classes/enums';
import {ElementRevisionRef, Page} from '../shared/classes/classes';
import { QuestionConstruct } from './question-construct.classes';
import { Instruction, Universe } from '../controlconstruct/controlconstruct.classes';
import { TemplateService } from '../template/template.service';
import { IRevisionResult, IElement, IRevisionRef, IOtherMaterial } from '../shared/classes/interfaces';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-question-construct-form',
  moduleId: module.id,
  templateUrl: 'question-construct.form.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class QuestionConstructFormComponent implements OnChanges  {
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

  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private showbutton = false;
  private showProgressBar = false;

  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];

  constructor(private service: TemplateService) {
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;

    this.fileStore = [];
    this.toDeleteFiles = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    try { Materialize.updateTextFields(); } catch (Exception) { }
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

  onRevisonSearch(item: IRevisionRef) {
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
//    this.editQuestionItem = false;

  }


  onRemoveQuestoinItem() {
    this.controlConstruct.questionItem = null;
//    this.editQuestionItem = false;
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data) => { filesaver.saveAs(data, fileName); },
      (error) => { throw error; });
  }


  onSelectFile(filename: any) {
    this.files = filename.target.files;
  }

  onDeleteFile(idx: number) {
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

  onUploadFile() {
    this.fileStore.push(this.files);
    this.showUploadFileForm = false;
    this.files = null;
  }

  OnSave() {
/*     this.fileStore.forEach(
      (file) => formData.append(file)
    )

    const formData: FormData = new FormData();
    if (picture !== null || picture !== undefined) {
      formData.append('files', picture, picture.name);
    }
    formData.append('article', JSON.stringify(article)); */

  }


  onSaveQuestionConstruct() {
    const controlConstruct = this.controlConstruct;
    const files = this.fileStore;
    const len = files.length;
    let source = Observable.of({});
    const toDeleteFiles = this.toDeleteFiles;
    if (len > 0 || this.toDeleteFiles.length > 0) {
      source = Observable.range(0, len + this.toDeleteFiles.length)
        .flatMap((x: any) => {
          if (x < len) {
            const file = files[x];
            return this.service.uploadFile(controlConstruct.id, '/CC', file);
          } else {
            const file = toDeleteFiles[x - len];
            return this.service.deleteFile(file.id);
          }
        });
    }
    const service = this.service;
    const elementEvent = this.modifiedEvent;
    source.subscribe(
      function () {
        service.update(controlConstruct).subscribe(
          (result) => {
            this.controlConstruct = result;
            elementEvent.emit(result); },
          (error: any) => {
          throw error;
        });
      },
      function (error: any) {
        throw error;
      });
  }


}
