import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { HashFactory } from 'adapter/hash.factory';
import { TestGlobalConfig } from 'test/test-config.spec';
import { Staff } from 'dashboard/_shared/model/staff.model';
import { IAuthService, ISigninAccoutDTO } from './auth.service.interface';
import { RoleEnum } from 'app/enum';

describe('AuthService', () => {
  let service: IAuthService;
  let moduleRef: TestingModule;

  const password = faker.string.alphanumeric(8);
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const signinData: ISigninAccoutDTO = {
    email: faker.internet.email(),
    password,
  };
  const userData: Staff = {
    id: faker.string.uuid(),
    fullname: `${firstName} ${lastName}`,
    phone: faker.phone.number({ style: 'international' }),
    email: faker.internet.email({ firstName, lastName }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    role: faker.helpers.enumValue(RoleEnum),
    password,
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        { provide: IAuthService, useClass: AuthService },
        {
          provide: JwtService,
          useClass: jest.fn(() => ({
            sign: () => faker.string.alphanumeric(50),
            verifyAsync: () => Promise.resolve({}),
            verify: () => ({}),
          })),
        },
      ],
    }).compile();

    service = moduleRef.get<IAuthService>(IAuthService);
    userData.password = await HashFactory.hashPwd(password);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('AuthService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('On signin account', () => {
    it('Should throw unauthorized', async () => {
      service.search = jest.fn().mockImplementationOnce(() => undefined);
      const mockSignin = async () => {
        await service.signin(signinData);
      };
      void expect(mockSignin).rejects.toThrow(UnauthorizedException);
      expect(service.search).toBeCalled();
    });

    it('Should return a user object of the email', async () => {
      service.search = jest
        .fn()
        .mockImplementationOnce(() =>
          TestGlobalConfig.mockRepositoryResponse(userData),
        );
      const login = await service.signin(signinData);
      expect(login).toBeTruthy();
      expect(login).toHaveProperty('accessToken');
      expect(login.accessToken).toEqual(expect.any(String));
    });
  });
});
