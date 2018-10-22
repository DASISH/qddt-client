import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {IAuthority, UserJson} from './user.classes';
import { UserService } from '../core/services/user.service';

// declare var Materialize: any;

@Component({
  selector: 'qddt-user-form',
  moduleId: module.id,
  templateUrl: './user.form.component.html'
})

export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: UserJson;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public agencies$: any;
  public authorities$: any;
  public selectedAgencyId: string;
  public formId = Math.round( Math.random() * 10000);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.agencies$ = this.fetchAgencies();
    this.authorities$ = this.fetchAuthorities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'].currentValue) {
      if (this.user) {
        if (this.user.agency) {
          this.onSelectChange(this.user.agency.id);
        } else {
          this.onSelectChange(this.agencies[0].id);
        }
        // Materialize.updateTextFields();
      }
    }
  }

  onSelectChange(id: string) {
    this.selectedAgencyId = id;
    this.user.agency = this.fetchAgencies().then( value => value.find( (f) => f.id === id );
  }

  onSelectRadio(authorityId: string) {
    this.user.authority = this.authorities.find( f.id === authorityId);
  }


  onSave() {
    this.userService.save(this.user).subscribe(
      (result) => {
        this.user = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

  public fetchAuthorities() {
    console.log('fetchAuthorities');
    return this.userService.getAuthorities().then(data => {
      // console.log(JSON.stringify(data));
      return data; });
  }

  private async fetchAgencies() {
    console.log('fetchAgencies');
    return await this.userService.getAgencies().then(data => {
      return data; });
  }


}
