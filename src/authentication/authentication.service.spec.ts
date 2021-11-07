import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import User from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthenticationService } from './authentication.service';

describe('The AuthenticationService', () => {
  const authenticationService = new AuthenticationService(
    new UserService(new Repository<User>()),
    new JwtService({
      secretOrPrivateKey: 'Secret key',
    }),
    new ConfigService(),
  );

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual('string');
    });
  });
});
