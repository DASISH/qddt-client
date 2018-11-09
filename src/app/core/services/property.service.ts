import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  currentChange$: BehaviorSubject<HIERARCHY_POSITION>;

  private globalObjects: Map<string, any> = new Map();
  private path = new Array<MenuItem>(4);
  private readonly userSettings: UserSettings;


  constructor() {
    try {
      this.path = JSON.parse(localStorage.getItem(QddtPropertyStoreService.PATH)) || this.path;
      this.userSettings = new UserSettings(JSON.parse(localStorage.getItem(QddtPropertyStoreService.USER_SETTINGS)));
      const pos = this.userSettings.hierarchyPosition || HIERARCHY_POSITION.Survey;
      this.currentChange$ = new BehaviorSubject<HIERARCHY_POSITION>(pos);
    } catch (e) {
      console.log(e);
    }
  }


  set(key: string, value: any) {
    this.globalObjects.set(key, value);
  }

  get(key: string): any {
    return this.globalObjects.get(key) || '';
  }

  has(key: string): boolean {
    return this.globalObjects.has(key);
  }

  get userSetting(): UserSettings {
    return this.userSettings;
  }

  get parentMenu(): MenuItem {
    return this.menuPath[this.currentChange$.getValue() - 1];
  }


  get menuPath(): Array<MenuItem> {
    return this.path;
  }

  public pathClear(pos: HIERARCHY_POSITION) {
     this.path = this.path.filter( (f, i) => i < pos);
     localStorage.setItem(QddtPropertyStoreService.PATH, JSON.stringify(this.menuPath));
     this.userSetting.hierarchyPosition = pos;
     this.currentChange$.next(pos);
    }

  public setCurrentMenu(pos: HIERARCHY_POSITION, item: MenuItem) {
    this.menuPath[pos] = item;
    localStorage.setItem(QddtPropertyStoreService.PATH, JSON.stringify(this.menuPath));
    this.userSetting.hierarchyPosition = pos;
    this.userSetting.save();
    this.currentChange$.next(pos);
  }


}
