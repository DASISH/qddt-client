import {Component, Input} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';
import {LocalDatePipe} from '../../common/date_pipe';
import {CommentListComponent} from '../comment/comment_list.component';
import {DomainType, DomainTypeDescription} from './responsedomain.constant';
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
    this.domainType = DomainTypeDescription.find(e=>e.name === responseDomain['responseKind']).id;
    this.editIsVisible = !this.editIsVisible;
    this.selectedDomainId = responseDomain.id;
  }

  formChange(responseDomain) {
    this.editIsVisible = false;
    this.selectedDomainId = '';
    this.responseDomainService.update(responseDomain).subscribe(result => {responseDomain = result;});
  }
}
