import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { PropertyStoreService, MessageService, TemplateService, IOtherMaterial, saveAs } from 'src/app/lib';

@Component({
  selector: 'qddt-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {

  constructor(public property: PropertyStoreService, private service: TemplateService,
    private msgService: MessageService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.gotoUUID(this.route.snapshot.params['id'], this.route.snapshot.params['revision']);
  }


  private gotoUUID(uuid: string, revision?: string) {
    this.service.searchByUuid(uuid).then((result) => {
      if (revision) {
        if (isNaN(+revision)) {   // I.E. FILENAME
          const filename = revision.substring(0, revision.length - 2).replace('_', '.').toLowerCase();
          this.downloadFile({ fileName: revision, originalName: filename, originalOwner: uuid, fileType: 'application/pdf' })
          // TODO filedownload
          // console.log('filedownload ' + revision);
        } else {
          this.msgService.sendMessage({
            elementId: result.id,
            elementRevision: +revision,
            elementKind: result.elementKind
          });
        }
      } else {
        this.router.navigate([result.url]);
      }
    },
      (error) => { throw error; });
  }

  private downloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data) => { saveAs(data, fileName, o.fileType); },
      (error) => { throw error; });
  }
}
