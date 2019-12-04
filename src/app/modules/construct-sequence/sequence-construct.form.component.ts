import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LanguageKind } from '../../lib/enums/language-kind';
import {
  ActionKind,
  ElementKind,
  EnumItem, getElementKind,
  IElement,
  IEntityEditAudit,
  IRevisionRef, Page, SequenceConstruct, SequenceKind, StringIsNumber, TemplateService, enumLANGUAGES
} from '../../lib';

@Component({
  selector: 'qddt-sequence-form',

  templateUrl: './sequence-construct.form.component.html',
  styles: [ ]
})

export class SequenceFormComponent implements OnChanges {
  @Input() sequence: SequenceConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<SequenceConstruct>();

  public readonly QUESTION = ElementKind.QUESTION_CONSTRUCT;
  public readonly LANGUAGES = LanguageKind;

  // public selectedElement: IEntityEditAudit;
  public entityEditAudits: IEntityEditAudit[];
  public revisionList = [];
  public showProgressBar = false;
  public readonly formId = Math.round( Math.random() * 10000);

  public currentSequenceKind: SequenceKind = SequenceKind.SECTION;
  // public sequenceKinds: EnumItem<SequenceKind>[];
  public sequenceKinds: string[];

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.SEQUENCE_CONSTRUCT);
    // this.sequenceKinds = Object.keys( SequenceKind )
    //                   .filter(StringIsNumber)
    //                   .filter(f => f !== '0')
    //                   .map(key => ({ id: +key, name: SequenceKind[key] } as EnumItem<SequenceKind>));
    this.sequenceKinds = Object.keys( SequenceKind )
                      .filter(StringIsNumber)
                      .filter(f => f !== '0')
                      .map(key => (SequenceKind[key] as string));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sequence) {
      this.currentSequenceKind = SequenceKind[this.sequence.sequenceKind];
    }
  }

  public onSave() {
    this.service.update<SequenceConstruct>(this.sequence).subscribe(
      (result) => {
          this.sequence = result;
          this.modifiedEvent.emit(result); },
      (error) => { throw error; }
    );
  }

  public onSearchElements(search: IElement) {
    const kind = getElementKind(search.elementKind);
    this.service.searchByKind( { kind, key: search.element, page: new Page( { size: 15 } ) } ).then(
      (result) => { this.entityEditAudits = result.content; },
      (error) => { throw error; } );
  }

  public onRevisonSearch(search: IRevisionRef) {
    const kind = getElementKind(search.elementKind);
    this.service.getByKindRevisions(kind, search.elementId).then(
      (result) => {
        this.revisionList = result.content;
      }
    );
  }

  public onSelectChange(event) {
    this.currentSequenceKind = event;

  }

  // public onRevisionSelected(ref: ElementRevisionRef) {
  //   this.sequence.sequence.push(ref);
  // }
  //
  // public onSelectCanceled(value) {
  //   this.selectedElement = null;
  // }


}

