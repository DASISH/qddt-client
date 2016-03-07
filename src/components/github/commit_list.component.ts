import {Component, Inject} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {HTTP_PROVIDERS, Http, Response} from 'angular2/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'commit-list',
  moduleId: module.id,
  template: `
    <div *ngIf="loading">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-red">
          <div class="circle-clipper left">
            <div class="circle">
            </div>
          </div>
          <div class="gap-patch">
            <div class="circle">
            </div>
          </div>
          <div class="circle-clipper right">
          <div class="circle">
          </div>
        </div>
      </div>
      </div>
    </div>

    <div *ngIf="!loading">
      <div *ngFor="#commit of commits">
        <div class="section">
          <b>{{commit.commit.message}}</b><br />
          {{commit.commit.author.date}}<br />
          (<a href="{{commit.html_url}}">{{commit.sha}}</a>)
        </div>
      </div>
    </div>
  `,
  directives: [CORE_DIRECTIVES],
  providers: [HTTP_PROVIDERS]
})
export class CommitListComponent {

  private commits: any;
  private loading: boolean = true;

  constructor(@Inject(Http)private http:Http) {
    this.http = http;
    this.getCommits();
  }

  private getCommits() {
    this.http.get('https://api.github.com/repos/DASISH/qddt-client/commits')
      .map((res:Response) => {
        this.loading = false;
        return res.json();
      }).subscribe(result => this.commits = result);
  }
}
