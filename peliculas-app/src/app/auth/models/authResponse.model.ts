import { User } from './user.model';

export interface authResponse {
  user?: User;
  errors?: string[];
  expirationTime?: Date;
  result: boolean;
}
