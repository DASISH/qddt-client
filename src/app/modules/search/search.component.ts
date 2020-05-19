import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { PropertyStoreService, MessageService, TemplateService } from 'src/app/lib';

@Component({
  selector: 'qddt-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {

  constructor(public property: PropertyStoreService, private service: TemplateService,
    private msgService: MessageService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.gotoUUID(this.route.snapshot.params['id'], +this.route.snapshot.params['revision']);
  }


  private gotoUUID(uuid: string, revision?: number) {
    this.service.searchByUuid(uuid).then((result) => {
      if (revision) {

        this.msgService.sendMessage({
          elementId: result.id,
          elementRevision: revision,
          elementKind: result.elementKind
        });
      } else {
        this.router.navigate([result.url]);
      }
    },
      (error) => { throw error; });
  }
}
