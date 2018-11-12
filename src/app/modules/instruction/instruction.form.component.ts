import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Instruction } from '../../controlconstruct/controlconstruct.classes';
import { ActionKind, ElementKind} from '../../classes';
import { TemplateService} from '../../components/template';


@Component({
  selector: 'qddt-instruction-form',
  templateUrl: './instruction.form.component.html'
})

export class InstructionFormComponent implements OnInit {

  @Input() instruction: Instruction;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public readonly INSTRUCTION = ElementKind.INSTRUCTION;

  // public isTemplate: boolean;
  // private selectedInstructionIndex: number;


  constructor(private instructionService: TemplateService) {
    // this.selectedInstructionIndex = 0;

  }

  ngOnInit() {
    if (!this.instruction) {
      this.instruction = new Instruction();
    }
    this.readonly = !this.instructionService.can(ActionKind.Create, this.INSTRUCTION);
   }


  onSave() {
    this.instructionService.update(this.instruction).subscribe(
      (result) => {
        this.instruction = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
