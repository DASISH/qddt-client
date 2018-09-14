import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IAuthority, UserJson } from './user.classes';
import { UserService, Agency } from '../core/user/user.service';

declare var Materialize: any;

@Component({
  selector: 'qddt-user-form',
  moduleId: module.id,
  templateUrl: './user.form.component.html'
})

export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: UserJson;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public agencies: Agency[];
  public authorities: IAuthority[];
  public selectedAgencyId: string;
  public formId = Math.round( Math.random() * 10000);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getAgencies();
    this.getAuthorites();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'].currentValue) {
      if (this.user && this.user.agency) {
        this.onSelectChange(this.user.agency.id);
        Materialize.updateTextFields();
      }
    }
  }

  onSelectChange(id: string) {
    this.selectedAgencyId = id;
    if (this.agencies) {
      this.user.agency = this.agencies.find( (f) => f.id === id );
    }
  }

  onSelectRadio(authorityId: string) {
    this.user.authorities = [this.authorities.find( q => q.id === authorityId)];
  }


  onSave() {
    this.userService.save(this.user).subscribe(
      (result) => {
        this.user = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

  private async getAgencies() {
    return await this.userService.getAgencies().then((result) => this.agencies = result);
  }

  private async getAuthorites() {
    return await this.userService.getAuthorites().then((result) => this.authorities = result);
  }
}
