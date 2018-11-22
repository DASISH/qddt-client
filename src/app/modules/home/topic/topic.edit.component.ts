import { Component, Input, EventEmitter, Output, AfterContentChecked } from '@angular/core';
import { HomeService } from '../home.service';
import { Topic} from '../../../classes';

declare var $: any;

@Component({
  selector: 'qddt-topic-edit',
  providers: [ {provide: 'elementKind', useValue: 'TOPIC_GROUP'}, ],
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable { margin-bottom:0px;}',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  templateUrl: 'topic.edit.component.html'
})

export class TopicEditComponent  implements AfterContentChecked {
  @Input() topic: Topic;
  @Input() readonly = false;
  @Input() isVisible = false;
  @Output() savedEvent = new EventEmitter<any>();

  public readonly formId = Math.round( Math.random() * 10000);
  private fileStore: File[] = [];

  constructor(private service: HomeService<Topic>) { }

  ngAfterContentChecked() {
    $('#' + this.formId + '-desc').trigger('autoresize');
  }

  public async onSave() {
    const formData = new FormData();

    formData.append('topicgroup', JSON.stringify(this.topic));
    this.fileStore.forEach( (file) => { formData.append('files', file); });

    this.savedEvent.emit(
      this.topic = await this.service.updateWithFiles(formData).toPromise()
    );
  }

}
