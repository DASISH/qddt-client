import { ElementKind} from '../../classes';
import { User} from '../core/classes';


export class ChangeLogJson {
  // changeFeedKey?: {};
  elementId?: string;
  elementKind?: ElementKind;
  elementRevision?: number;
  modifiedBy?: User;
  modified?: any;
  name: String;
  refChangeKind?: any;
  refKind?: String;

  public constructor(init?: Partial<ChangeLogJson>) {
    Object.assign(this, init);
  }

}
