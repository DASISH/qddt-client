import { Instruction } from './../../lib/classes/controlconstruct.classes';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  ActionKind,
  ElementKind,
  IElement,
  IElementRef,
  IRevisionRef,
  LANGUAGE_MAP,
  MessageService,
  QuestionConstruct,
  TemplateService,
  QuestionItem, ElementRevisionRefImpl, hasChanges
} from '../../lib';

@Component({
  selector: 'qddt-question-construct-form',
  styles: [
    '.card-panel:hover > ul.dropleft { display:block; }',
  ],
  templateUrl: 'question-construct.form.component.html',
})

export class QuestionConstructFormComponent implements OnChanges {
  @Input() controlConstruct: QuestionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionConstruct>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly formId = Math.round(Math.random() * 10000);
  public SOURCE: IElement | IRevisionRef | null;

  public showUploadFileForm: boolean;
  public showProgressBar = false;
  public showButton = false;
  public fileStore: File[] = [];

  public preInstructions: Instruction[] = [];
  public postInstructions: Instruction[] = [];

  private readonly filterInstructions = (rank: string) => this.controlConstruct.controlConstructInstructions
    .filter(f => f.instructionRank === rank)
    .map(ci => ci.instruction);

  constructor(private service: TemplateService, private router: Router, private message: MessageService,) {
    this.showUploadFileForm = false;
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.CONTROL_CONSTRUCT);

  }
  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.controlConstruct)) {
      this.preInstructions = this.filterInstructions('PRE');
      this.postInstructions = this.filterInstructions('POST');
    }
  }

  public onAddUniverse(item: IElement) {
    this.controlConstruct.universe.push(item.element);
  }

  public onAddPreInstruction(item: IElement) {
    console.log('break here');
    this.controlConstruct.controlConstructInstructions.push({ instruction: item.element, instructionRank: 'PRE' });
    this.preInstructions = this.filterInstructions('PRE');
  }

  public onAddPostInstruction(item: IElement) {
    this.controlConstruct.controlConstructInstructions.push({ instruction: item.element, instructionRank: 'POST' });
    this.preInstructions = this.filterInstructions('POST');
  }

  public onRemoveUniverse(item: IElementRef) {
    this.controlConstruct.universe = this.controlConstruct.universe.filter(u => u.id !== item.elementId);
  }

  public onRemovePreInstruction(item: IElementRef) {
    this.controlConstruct.controlConstructInstructions =
      this.controlConstruct.controlConstructInstructions.filter(u => u.instruction.id !== item.elementId);
    this.preInstructions = this.filterInstructions('PRE');
  }

  public onRemovePostInstruction(item: IElementRef) {
    this.controlConstruct.controlConstructInstructions =
      this.controlConstruct.controlConstructInstructions.filter(u => u.instruction.id !== item.elementId);
    this.preInstructions = this.filterInstructions('POST');
  }

  public onQuestionEdit() {
    this.service.searchByUuid(this.controlConstruct.questionItemRef.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }

  public onQuestionRemove() {
    this.controlConstruct.questionItemRef = null;
  }

  public onQuestionSync() {
    this.SOURCE = this.controlConstruct.questionItemRef
  }

  public onQuestionSearch() {
    this.SOURCE = { elementKind: ElementKind.QUESTION_ITEM, element: '' } as IElement;
  }

  public onRevisionSelect(rev: ElementRevisionRefImpl<QuestionItem>) {
    rev.name = rev.element.name;
    rev.text = rev.element.question;
    this.controlConstruct.questionItemRef = rev;
    this.SOURCE = null;
  }

  public onQuestionPreview() {
    this.message.sendMessage(this.controlConstruct.questionItemRef);
  }

  async onSave() {

    const formData = new FormData();
    formData.append('controlconstruct', JSON.stringify(this.controlConstruct));
    this.fileStore.forEach((file) => { formData.append('files', file); });

    this.modifiedEvent.emit(
      this.controlConstruct =
      await this.service.updateWithFiles(ElementKind.QUESTION_CONSTRUCT, formData).toPromise());
  }

}
