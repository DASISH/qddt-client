import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Agency, IAuthority, UserService, delay, SelectItem, User } from '../../lib';

@Component({
  selector: 'qddt-user-form',
  templateUrl: './user.form.component.html'
})

export class UserFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() user: User;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<string>();

  public selectedAgencyId: string;
  public formId = Math.round(Math.random() * 10000);

  public agencies: Agency[];
  public authorities: IAuthority[];
  public AGENCY_LIST: SelectItem[];

  constructor(private userService: UserService) {
  }

  async ngOnInit() {
    this.agencies = await this.userService.getAgencies();
    this.authorities = await this.userService.getAuthorities();
    this.AGENCY_LIST = this.agencies.map(item => new SelectItem({ label: item.name, value: item.id }));

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user.currentValue) {
      if (this.user) {
        if (this.user.agencyId) {
          this.onSelectChange(this.user.agencyId);
        } else {
          this.getFirstAgency().then(agent => this.onSelectChange(agent.id));
        }
      }
      // console.debug('agency set');
    }
  }

  ngAfterViewInit(): void {
    delay(30).then(() => {
      M.updateTextFields();
    });
    // document.querySelectorAll('select')
    //   .forEach(select => M.FormSelect.init(select));
  }

  onSelectChange(id: string) {
    this.user.agencyId = this.selectedAgencyId = id;
  }

  onSelectRadio(authority: string) {
    this.user.authority = [authority];
  }

  onSave() {
    this.userService.saveUser(this.user).subscribe(
      (result) => {
        this.modifiedEvent.emit(this.user = result);
      },
      (error) => { throw error; });
  }


  private async getFirstAgency() {
    return this.getAgencies().then(result => result[0]);
  }

  private async getAgencies() {
    return this.userService.getAgencies();
  }

}
