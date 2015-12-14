import {Component, View, Host} from 'angular2/core';

@Component({
  selector: 'tabs'
})
@View({
  template: `
    <ul class="tabs z-depth-1">
      <li class="tab col s3"><a href="#test1">Test 1</a></li>
      <li class="tab col s3"><a href="#test1">Test 1</a></li>
      <!--<li class="tab col s3" *ng-for="#tab of tabs" (click)="selectTab(tab)">{{tab.tabTitle}}</li>-->
    </ul>
  `
})
export class Tabs {

  private tabs: any[];

  constructor() {
    this.tabs = [];
  }

  selectTab(tab) {
    this.tabs.forEach((tab) => {
      tab.active = false;
    });
    tab.active = true;
  }

  addTab(tab: Tab) {
    if (this.tabs.length === 0) {
      tab.active = true;
    }
    this.tabs.push(tab);
  }
}


//@Component({
//  selector: 'tab',
//  properties: ['tabTitle: tab-title']
//})
//@View({
//  template: `
//    <div [hidden]="!active">
//      <content></content>
//    </div>
//  `
//})
export class Tab {

  active: boolean;
  tabs: Tabs;

  constructor(@Host() tabs: Tabs) {
    tabs.addTab(this);
  }
}
