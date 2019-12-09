import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {ActionKind, ElementKind, Instruction, LANGUAGE_MAP, TemplateService} from '../../lib';

@Component({
  selector: 'qddt-instruction-form',
  templateUrl: './instruction.form.component.html'
})

export class InstructionFormComponent implements OnInit {
  @Input() instruction: Instruction;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<Instruction>();

  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public formId = Math.round( Math.random() * 10000);

  constructor(private instructionService: TemplateService) {
    // this.selectedInstructionIndex = 0;

  }

  ngOnInit() {
    if (!this.instruction) {
      this.instruction = new Instruction();
    }
    this.readonly = !this.instructionService.can(ActionKind.Create, this.INSTRUCTION);
  }


  onSaveItem() {
    this.instructionService.update<Instruction>(this.instruction).subscribe(
      (result) => {
        this.instruction = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
