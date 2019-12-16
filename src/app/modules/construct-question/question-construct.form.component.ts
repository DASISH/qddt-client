import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  ActionKind,
  ElementKind,
  ElementRevisionRef,
  IElement, IElementRef,
  IRevisionResult, LANGUAGE_MAP,
  Page,
  QuestionConstruct, QuestionItem, TemplateService
} from '../../lib';
import {Router} from '@angular/router';



@Component({
  selector: 'qddt-question-construct-form',
  templateUrl: 'question-construct.form.component.html',
  styles: [
    '.collection-item:hover > ul.dropleft { display:block; } ',
    'ul.dropleft { position: absolute; display: none; margin-top: 0px; margin-bottom: 0px; z-index: 1;}',
    'ul.dropleft li { display:inline-flex; }'
  ],
})

export class QuestionConstructFormComponent {
  @Input() controlConstruct: QuestionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionConstruct>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public readonly QUESTION = ElementKind.QUESTION_ITEM;
  public readonly LANGUAGES = LANGUAGE_MAP;

  public readonly formId = Math.round(Math.random() * 10000);

  /* public savedQuestionItem: any; */
  public questionList: QuestionItem[];
  public revisionResults: IRevisionResult<QuestionItem>[];

  public showUploadFileForm: boolean;
  public showProgressBar = false;

  public fileStore: File[] = [];


  constructor(private service: TemplateService, private router: Router) {
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

  onDelete(item: IElementRef) {
    this.controlConstruct.universe = this.controlConstruct.universe.filter( u => u.id !== item.elementId);
  }

  onQuestionSearch(key: IElement) {
    this.service.searchByKind<QuestionItem>({ kind: this.QUESTION, key: key.element, page: new Page() }).then(
      (result) => {
        this.questionList = result.content;
      });
  }

  onQuestionEdit(event: Event, item: QuestionItem) {
    event.stopPropagation();
    this.service.searchByUuid(item.id).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }

  onQuestionRemove(event: Event) {
    this.controlConstruct.questionItem = null;
  }

  public onDismiss() {
    this.revisionResults = null;
    this.questionList = null;
  }


  onRevisionSelect(ref: ElementRevisionRef) {
    this.controlConstruct.questionItem = ref.element;
    this.controlConstruct.questionItemRevision = ref.elementRevision;
    this.questionList = [];
    this.revisionResults = [];
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
