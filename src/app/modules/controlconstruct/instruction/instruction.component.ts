import { Component, EventEmitter, Output } from '@angular/core';
import { ElementKind, Instruction } from '../../../lib';
import { TemplateService } from '../../../components/template';

@Component({
  selector: 'qddt-instruction-create',

  templateUrl: 'instruction.component.html',
  styles: [],
})

export class InstructionComponent {
  @Output() createInstructionEvent = new EventEmitter<any>();

  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public instruction: any;
  public instructionList: any[];
  public isInstructionNew: boolean;

  constructor(private service: TemplateService) {
    this.instruction = new Instruction();
    this.instructionList = [];
    this.instruction.description = '';
  }

  onAddInstruction() {
    this.createInstructionEvent.emit(this.instruction);
    this.instruction = new Instruction();
  }

  onSearchInstructions(key: string) {
    this.instruction.description = key;
    this.service.searchByKind({ kind: this.INSTRUCTION, key: key }).then(
      (result: any) => {
        this.instructionList = result.content;
        this.isInstructionNew = this.instructionList.length === 0;
      });
  }

  onSelectInstruction(instruction: any) {
    this.instruction = instruction;
  }

}
