import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit} from '@angular/core';
import { IAuthority, UserJson} from './user.classes';
import {Agency} from '../core/classes';
import {UserService} from '../core/services';

// declare var Materialize: any;

@Component({
  selector: 'qddt-user-form',
  templateUrl: './user.form.component.html'
})

export class UserFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() user: UserJson;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

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
          this.getFirstAgency().then( agent => this.onSelectChange(agent.id) );
        }
      }
      // try { Materialize.updateTextFields(); } catch (Exception) { }
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

  onSave() {
    this.userService.save(this.user).subscribe(
      (result) => {
        this.modifiedEvent.emit(this.user = result);
      },
      (error) => { throw error; });
  }


  private async getFirstAgency() {
    return await this.getAgencies().then( result => result[0]);
  }

  private async getAgencies() {
    return await this.userService.getAgencies();
  }

  private async getAuthorities() {
    return await this.userService.getAuthorities();
    // .then((result) => {
    //   return result;
    // });
  }

  ngAfterViewInit(): void {
    // Materialize.updateTextFields();
  }
}
