import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { SexEnum } from 'app/enum/global.enum';
import { TestGlobalConfig } from 'test/test-config.spec';
import { StaffService } from './staff.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { IStaffService } from './staff.service.interface';
import { IAuthService } from '../auth/auth.service.interface';
import { IRegisterStafftDTO } from 'dashboard/auth/auth.service.interface';

describe('UserService', () => {
  let service: IStaffService;
  let moduleRef: TestingModule;
  let repository: IDashboardRepository;
  let authService: IAuthService;

  const id = faker.string.uuid();
  const firstname = faker.person.fullName();
  const lastname = faker.person.lastName();
  const email = faker.internet.email();
  const phone = faker.phone.number({ style: 'international' });
  const password = faker.string.alphanumeric(8);

  const data: IRegisterStafftDTO = {
    password,
    firstname: firstname,
    lastname: lastname,
    fullname: lastname,
    email,
    phone,
    sex: faker.helpers.enumValue(SexEnum),
    address: faker.location.streetAddress(),
    country: faker.location.country(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        { provide: IStaffService, useClass: StaffService },
        {
          provide: IAuthService,
          useClass: jest.fn(() => TestGlobalConfig.mockService()),
        },
        {
          provide: IDashboardRepository,
          useClass: jest.fn(() => TestGlobalConfig.mockDataService()),
        },
      ],
    }).compile();
    service = await moduleRef.resolve<IStaffService>(IStaffService);
    authService =
      await moduleRef.resolve<IAuthService>(IAuthService);
    repository = await moduleRef.resolve<IDashboardRepository>(IDashboardRepository);
  });

  afterAll(async () => {
    await moduleRef?.close();
    jest.clearAllMocks();
  });

  it('UserService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('UserDataRepository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('On fetch all users', () => {
    it('Should return empty array', async () => {
      // concurrent
      repository.users.find = jest
        .fn()
        .mockImplementationOnce(() => [])
        .mockImplementationOnce(async () => [
          await TestGlobalConfig.mockRepositoryResponse(data),
        ]);
      const users = await service.fetchAll();
      expect(repository.users.find).toHaveBeenCalled();
      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(0);
    });

    it('Should return an array of one staff', async () => {
      const users = await service.fetchAll();
      expect(users).toHaveLength(1);
    });
  });

  describe('On fetch one staff', () => {
    it('Should return an empty content', async () => {
      repository.users.findOneByID = jest
        .fn()
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(() =>
          TestGlobalConfig.mockRepositoryResponse(data),
        );
      const staff = await service.fetchOne(id);
      expect(repository.users.findOneByID).toHaveBeenCalledWith(
        id,
        expect.any(Object),
      );
      expect(staff).toBeFalsy();
    });

    it('Should return a staff object contain ID', async () => {
      const staff = await service.fetchOne(id);
      expect(staff).toBeTruthy();
      expect(staff).toHaveProperty('id');
      expect(staff).toHaveProperty('createdAt');
    });
  });

  describe('On staff creation', () => {
    it('Should call repository methods', async () => {
      authService.search = jest.fn();
      repository.users.findOne = jest.fn(() => undefined as any);
      // const fact = await StaffFactory.create(data);
      await service.add(data);
      expect(authService.search).toHaveBeenCalledWith({ email });
      expect(authService.search).toHaveBeenCalledWith({ phone });
      expect(repository.users.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });

    it('Should expect correct data', async () => {
      const staff = await service.add(data);
      expect(staff).toBeDefined();
      expect(staff.fullname).toBeTruthy();
      expect({
        firstname: staff?.firstname,
        email: staff.email,
      }).toStrictEqual({ firstname: data.firstname, email: data.email });
      expect(staff.id).toBeDefined();
      expect(staff.id).toBeTruthy();
      expect(staff.id).toEqual(expect.any(String));
    });
  });

  describe('On staff update', () => {
    it('Should call repository methods', async () => {
      repository.users.findOneByID = jest
        .fn()
        .mockImplementation(() =>
          TestGlobalConfig.mockRepositoryResponse(data),
        );
      await service.edit({ ...data, id });
      expect(repository.users.findOneByID).toBeCalled();
      expect(repository.users.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: expect.any(String), ...data }),
      );
    });

    it('Should expect correct data', async () => {
      const email = faker.internet.email({
        firstName: firstname.toLowerCase(),
        lastName: lastname.toLowerCase(),
      });
      const staff = await service.edit({ ...data, email, id });
      expect(staff).toBeDefined();
      expect(staff.email).toEqual(email);
      expect(staff.id).toBeDefined();
      expect(staff.id).toBeTruthy();
      expect(staff.id).toEqual(expect.any(String));
    });
  });

  describe('On remove staff', () => {
    it('Should return false response', async () => {
      repository.users.findOneByID = jest
        .fn()
        .mockImplementationOnce(() => undefined);
      const staff = await service.remove(id);
      expect(repository.users.remove).not.toBeCalled();
      expect(staff).toBeFalsy();
    });

    it('Should return a staff object contain ID', async () => {
      repository.users.findOneByID = jest
        .fn()
        .mockImplementation(() =>
          TestGlobalConfig.mockRepositoryResponse(data),
        );
      const staff = await service.remove(id);
      expect(repository.users.remove).toHaveBeenCalledWith(
        expect.objectContaining(data),
      );
      expect(staff).toBeTruthy();
    });
  });
});
