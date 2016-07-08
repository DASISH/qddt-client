import {Component, Input} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';
import {LocalDatePipe} from '../../common/date_pipe';
import {CommentListComponent} from '../comment/comment_list.component';
import {DomainType} from './responsedomain.constant';
import {ResponseDomainService} from './responsedomain.service';
import {ResponsedomainFormComponent} from './responsedomain.form.component';
import {RevisionComponent} from '../revision/revision.component';
import {PreviewComponent} from './responsedomain.preview.component';

@Component({
  selector: 'responsedomain-list',
  moduleId: module.id,
  templateUrl: './responsedomain.list.component.html',
  styles: [],
  pipes: [LocalDatePipe],
  providers: [ResponseDomainService],
  directives: [CommentListComponent, ResponsedomainFormComponent,
    RevisionComponent, PreviewComponent]
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

  onEdit(responseDomain) {
    let types = { 'SCALE': DomainType.SCALE, 'LIST': DomainType.LIST,
     'MIXED': DomainType.MIXED, 'DATETIME': DomainType.DATETIME,
     'NUMERIC': DomainType.NUMERIC, 'TEXT': DomainType.TEXT};
    this.domainType = types[responseDomain['responseKind']];
    this.editIsVisible = !this.editIsVisible;
    this.selectedDomainId = responseDomain.id;
  }

  formChange(responseDomain) {
    this.editIsVisible = false;
    this.selectedDomainId = '';
    this.responseDomainService.update(responseDomain).subscribe(result => {responseDomain = result;});
  }
}
