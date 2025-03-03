import { Erole } from '../../common/enum/role.enum';

export interface Iuser {
  id: string;
  email: string;
  password: string;
  role: Erole;
  createdAt: Date;
  updatedAt: Date;
}
