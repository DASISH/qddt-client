import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ElementKind } from '../../shared/classes/enums';
import { TemplateService } from '../../template/template.service';
import { RegisterUser } from './register.classes';


@Component({
  selector: 'qddt-register-form',
  moduleId: module.id,
  templateUrl: './register.form.component.html'
})

export class RegisterFormComponent implements OnInit {

  @Input() register: RegisterUser;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public readonly CATEGORY = ElementKind.CATEGORY;


  constructor(private service: TemplateService) {
  }

  ngOnInit() {

  }

  onSave() {
    this.service.update(this.user).subscribe(
      (result) => {
        this.user = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
