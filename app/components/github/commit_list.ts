import {Component} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';


@Component({
  selector: 'commit-list',
  template: `
    <div *ng-if="loading">
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

    <div *ng-if="!loading">
      <div *ng-for="#commit of commits">
        <div class="section">
          <b>{{commit.commit.message}}</b><br />
          {{commit.commit.author.date}}<br />
          (<a href="{{commit.html_url}}">{{commit.sha}}</a>)
        </div>
      </div>
    </div>
  `
})
export class CommitListComponent {

  private commits: any;
  private loading: boolean = true;

  constructor(private http: Http) {
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
