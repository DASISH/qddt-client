import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {IAuthority, UserJson} from './user.classes';
import { UserService, Agency } from '../core/services/user.service';
import index from '@angular/cli/lib/cli';

// declare var Materialize: any;

@Component({
  selector: 'qddt-user-form',

  templateUrl: './user.form.component.html'
})

export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: UserJson;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  // public agencies: Agency[];
  // public authorities: IAuthority[];
  public selectedAgencyId: string;
  public formId = Math.round( Math.random() * 10000);

  public agencies$: Promise<Agency[]>;
  public authorities$: Promise<IAuthority[]>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.agencies$ = this.getAgencies();
    this.authorities$ = this.getAuthorities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'].currentValue) {
      if (this.user) {
        if (this.user.agency) {
          this.onSelectChange(this.user.agency.id);
        } else {
          this.onSelectChange(this.getFirstAgency().id);
        }
        // Materialize.updateTextFields();
      }
    }
  }

  onSelectChange(id: string) {
    this.selectedAgencyId = id;
    this.getAgencies().then( result => {
      this.user.agency = result.find( f => f.id === id);
    });
  }

  onSelectRadio(authority: IAuthority) {
    this.user.authorities  = [authority];
  }


  private async getFirstAgency(): any {
    return await this.getAgencies().then( result => result.find((value, _index) => _index === 0  ));
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
    return await this.userService.getAgencies();
  }

  private async getAuthorities() {
    return await this.userService.getAuthorities().then((result) => {
      // console.log(JSON.stringify(result));
      return result;
    });
  }
}
