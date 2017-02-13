import { Component, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'qddt-commit-list',
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
      <div *ngFor="let commit of commits">
        <div class="section">
          <b>{{commit?.commit?.message}}</b><br />
          {{commit?.commit?.author?.date}}<br />
          (<a href="{{commit?.html_url}}">{{commit?.sha}}</a>)
        </div>
      </div>
    </div>
  `,
})
export class CommitListComponent {

  private commits: any;
  private loading: boolean = true;

  constructor(private http:Http) {
    this.getCommits();
  }

  private getCommits() {
    this.http.get('https://api.github.com/repos/DASISH/qddt-client/commits')
      .map((res:Response) => {
        this.loading = false;
        return res.json();
      }).subscribe(result => this.commits = result,
      error => console.log(error));
  }
}
