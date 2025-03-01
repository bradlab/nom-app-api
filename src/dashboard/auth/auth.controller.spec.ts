import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TestGlobalConfig } from 'test/test-config.spec';
import { AuthService } from './auth.service';
import { IAuthService } from './auth.service.interface';
import { IStaffService } from 'dashboard/manager/staff.service.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [JwtModule],
      providers: [
        { provide: IAuthService, useClass: AuthService },
        {
          provide: IStaffService,
          useClass: jest.fn(() => TestGlobalConfig.mockService()),
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('AuthController should be defined', () => {
    expect(controller).toBeDefined();
  });
});
