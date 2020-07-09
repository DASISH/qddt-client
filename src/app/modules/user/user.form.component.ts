import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Agency, IAuthority, UserJson, UserService } from '../../lib';
import { SelectItem } from '../../lib/classes/selecteditem.classes';

@Component({
  selector: 'qddt-user-form',
  templateUrl: './user.form.component.html'
})

export class UserFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() user: UserJson;
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
        if (this.user.agency) {
          this.onSelectChange(this.user.agency.id);
        } else {
          this.getFirstAgency().then(agent => this.onSelectChange(agent.id));
        }
      }
      // console.log('agency set');
    }
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('select')
      .forEach(select => M.FormSelect.init(select));
    M.updateTextFields();
  }

  onSelectChange(id: string) {
    this.selectedAgencyId = id;
    this.getAgencies().then(result => {
      this.user.agency = result.find(f => f.id === this.selectedAgencyId);
    });
  }

  onSelectRadio(authority: IAuthority) {
    this.user.authorities = [authority];
  }

  onSave() {
    this.userService.saveUser(this.user).subscribe(
      (result) => {
        this.modifiedEvent.emit(this.user = result);
      },
      (error) => { throw error; });
  }


  private async getFirstAgency() {
    return await this.getAgencies().then(result => result[0]);
  }

  private async getAgencies() {
    return await this.userService.getAgencies();
  }

}
