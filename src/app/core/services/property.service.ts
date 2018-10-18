import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { MenuItem } from '../../menu/menu.component';
import { UserSettings, HIERARCHY_POSITION } from '../classes/UserSettings';



/**
 *
 * In memmory store...
 */
@Injectable()
export class QddtPropertyStoreService {
  private static readonly USER_SETTINGS = 'USER_SETTINGS';
  private static readonly PATH = 'PATH';

  currentChange$: Observable<HIERARCHY_POSITION>;
  // Observable navItem source
  private _newcurrent: BehaviorSubject<HIERARCHY_POSITION>;
  private globalObjects: Map<string, any> = new Map();
  private _path = new Array<MenuItem>(4);
  private _userSettings: UserSettings;


  constructor() {

    this._path = JSON.parse(localStorage.getItem(QddtPropertyStoreService.PATH)) || this._path;
    this._userSettings = new UserSettings(JSON.parse(localStorage.getItem(QddtPropertyStoreService.USER_SETTINGS))) ;
    const pos = this._userSettings.hierarchyPosition || HIERARCHY_POSITION.Survey;

    this._newcurrent = new BehaviorSubject<HIERARCHY_POSITION>(pos);
    this.currentChange$ = this._newcurrent.asObservable();
  }


  set(key: string, value: any) {
    this.globalObjects.set(key, value);
  }

  get(key: string): any {
    return this.globalObjects.get(key) || '';
  }

  get userSetting(): UserSettings {
    return this._userSettings;
  }

  get currentMenu(): MenuItem {
    return this.menuPath[this._newcurrent.getValue()];
  }

  get menuPath(): Array<MenuItem> {
    return this._path;
  }

  public pathClear(pos: HIERARCHY_POSITION) {
     this._path = this._path.filter( (f, i) => i < pos);
     localStorage.setItem(QddtPropertyStoreService.PATH, JSON.stringify(this.menuPath));
     this.userSetting.hierarchyPosition = pos;
     this._newcurrent.next(pos);
    }

  public setCurrentMenu(pos: HIERARCHY_POSITION, item: MenuItem) {
    this.menuPath[pos - 1] = item;
    localStorage.setItem(QddtPropertyStoreService.PATH, JSON.stringify(this.menuPath));
    this.userSetting.hierarchyPosition = pos;
    this.userSetting.save();
    this._newcurrent.next(pos);
  }


}
