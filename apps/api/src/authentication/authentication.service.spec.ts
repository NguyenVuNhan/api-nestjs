import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import mockedConfigService from '../utils/mocks/config.service';
import mockedJwtService from '../utils/mocks/jwt.service';
import User from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthenticationService } from './authentication.service';

const mockedUser = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  },
};

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userService: UserService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();
    authenticationService = await module.get(AuthenticationService);
    userService = await module.get(UserService);
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual('string');
    });
  });

  describe('when accessing the data of authenticating user', () => {
    it('should attempt to get the user by email', async () => {
      const getByEmailSpy = jest.spyOn(userService, 'getByEmail');
      getByEmailSpy.mockResolvedValue(mockedUser as User);
      const verifyPasswordSpy = jest.spyOn(
        AuthenticationService.prototype as any,
        'verifyPassword',
      );
      verifyPasswordSpy.mockResolvedValue({});
      await authenticationService.getAuthenticatedUser(
        'user@email.com',
        'strongPassword',
      );
      expect(getByEmailSpy).toBeCalledTimes(1);
    });
  });
});
