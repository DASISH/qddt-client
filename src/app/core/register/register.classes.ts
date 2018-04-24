import { IComment, IEntityAudit } from '../../shared/classes/interfaces';
import { Agency } from '../user/user.service';

export class RegisterUser implements IEntityAudit {
  id: string;
  name: string;
  classKind: string;
  username: string;
  password?: string;
  email: string;
  agency: Agency;
  isEnabled?: boolean;
  authorities?: any[];
  comments: IComment[];
}
