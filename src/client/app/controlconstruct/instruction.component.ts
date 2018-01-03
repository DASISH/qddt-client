import { Component, EventEmitter, Output } from '@angular/core';

import { ControlConstructService, Instruction } from './controlconstruct.service';
import { ElementKind, QddtElementTypes } from '../shared/preview/preview.service';

@Component({
  selector: 'qddt-instruction-create',
  moduleId: module.id,
  templateUrl: 'instruction.component.html',
  styles: [
    `.noItemFound {
        border: thick solid orange;
    }`
  ],
  providers: [ControlConstructService],
})

export class InstructionComponent {
  @Output() createInstructionEvent = new EventEmitter<any>();

  instruction: any;
  instructions: any[];
  isInstructionNew: boolean;
  private readonly INSTRUCTION = QddtElementTypes[ElementKind.INSTRUCTION];

  constructor(private service: ControlConstructService) {
    this.instruction = new Instruction();
    this.instructions = [];
    this.instruction.description = '';
  }

  onAddInstruction() {
    this.createInstructionEvent.emit(this.instruction);
    this.instruction = new Instruction();
  }

  onSearchInstructions(key: string) {
    this.instruction.description = key;
    this.service.searchInstructions(key).subscribe((result: any) => {
      this.instructions = result.content;
      this.isInstructionNew = this.instructions.length === 0;
    },
      (error: any) => { console.log(error); });
  }

  onSelectInstruction(instruction: any) {
    this.instruction = instruction;
  }

}
