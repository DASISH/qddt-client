import { Component, Input, Output, EventEmitter, AfterContentChecked, OnChanges, SimpleChanges } from '@angular/core';
import { ControlConstructService } from '../controlconstruct.service';
import { Observable } from 'rxjs/Observable';
import { QuestionItem } from '../../question/question.classes';
import { Instruction, QuestionConstruct, Universe } from '../controlconstruct.classes';
import { ElementKind } from '../../shared/classes/enums';
import { IOtherMaterial } from '../../shared/classes/interfaces';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-question-construct-form',
  moduleId: module.id,
  templateUrl: 'questionconstruct.form.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class QuestionConstructFormComponent implements OnChanges , AfterContentChecked {
  @Input() controlConstruct: QuestionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionConstruct>();

  public formId = Math.round( Math.random() * 10000);
  public savedQuestionItem: any;
  public instructions: any[];
  public universes: any[];

  private editQuestionItem: boolean;
  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private showbutton = false;

  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];

  constructor(private service: ControlConstructService) {
    this.editQuestionItem = false;
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;

    this.fileStore = [];
    this.toDeleteFiles = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
   // try { Materialize.updateTextFields(); } catch (Exception) { }
  }


  ngAfterContentChecked(): void {
    try { Materialize.updateTextFields(); } catch (Exception) { }
  }

  onAddUniverse(item: Universe) {
    this.controlConstruct.universe.push(item);
  }

  onInstructionSearch(key: string) {
    this.service.searchByKind(ElementKind.INSTRUCTION, key).then(
      (result) => {
        this.instructions = result.content;
      });
  }

  onUniverseSearch(key: string) {
    this.service.searchByKind(ElementKind.UNIVERSE, key).then(
      (result) => {
        this.universes = result.content;
      });
  }
  onDeletePreInstruction(id: number) {
    this.controlConstruct.preInstructions.splice(id, 1);
  }

  onAddPreInstruction(instruction: Instruction) {
    this.controlConstruct.preInstructions.push(instruction);
  }

  onAddPostInstruction(instruction: Instruction) {
    this.controlConstruct.postInstructions.push(instruction);
  }


  onSelectQuestionItem(element: QuestionItem) {
    this.controlConstruct.questionItem = element;
    this.controlConstruct.questionItemRevision = element['questionItemRevision'];
    this.editQuestionItem = false;
  }

  onRemoveQuestoinItem() {
    this.controlConstruct.questionItem = null;
    this.editQuestionItem = false;
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


  onSaveControlConstruct() {
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
            return this.service.uploadFile(controlConstruct.id, file);
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
        service.updateQuestion(controlConstruct).subscribe(
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
