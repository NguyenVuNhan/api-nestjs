import { Request } from 'express';
import User from '../user/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

export interface TokenPayload {
  userId: number;
}
