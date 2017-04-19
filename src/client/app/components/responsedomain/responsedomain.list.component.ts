import { Component, Input } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';

@Component({
  selector: 'qddt-responsedomain-list',
  moduleId: module.id,
  templateUrl: './responsedomain.list.component.html',
  styles: [],
  providers: [ResponseDomainService],
})

export class ResponsedomainListComponent {
  public domainTypeDef = DomainType;
  @Input() responseDomains: ResponseDomain[];
  private editIsVisible: boolean;
  private domainType: DomainType;
  private selectedDomainId: string;

  constructor(private responseDomainService: ResponseDomainService) {
    this.domainType = DomainType.SCALE;
    this.editIsVisible = false;
    this.selectedDomainId = '';
  }

  onEdit(responseDomain: any) {
    this.domainType = DomainTypeDescription.find((e: any) =>e.name === responseDomain['responseKind']).id;
    this.editIsVisible = !this.editIsVisible;
    this.selectedDomainId = responseDomain.id;
  }

  formChange(responseDomain: any) {
    this.editIsVisible = false;
    this.selectedDomainId = '';
    this.responseDomainService.update(responseDomain).subscribe((result: any) => {responseDomain = result;});
  }
}
