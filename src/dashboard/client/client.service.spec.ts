import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { TestGlobalConfig } from 'test/test-config.spec';
import { ClientService } from './client.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { IClientService, ICreateClientDTO } from './client.service.interface';
import { IClientAuthService } from './auth/auth.service.interface';

describe('UserService', () => {
  let service: IClientService;
  let moduleRef: TestingModule;
  let repository: IDashboardRepository;
  let authService: IClientAuthService;

  const id = faker.string.uuid();
  const firstname = faker.person.fullName();
  const lastname = faker.person.lastName();
  const email = faker.internet.email();
  const phone = faker.phone.number({ style: 'international' });

  const data: ICreateClientDTO = {
    firstname,
    lastname,
    email,
    phone,
    address: faker.location.streetAddress(),
    country: faker.location.country(),
    password: faker.string.alphanumeric(10)
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        { provide: IClientService, useClass: ClientService },
        {
          provide: IClientAuthService,
          useClass: jest.fn(() => TestGlobalConfig.mockService()),
        },
        {
          provide: IDashboardRepository,
          useClass: jest.fn(() => TestGlobalConfig.mockDataService()),
        },
      ],
    }).compile();
    service = await moduleRef.resolve<IClientService>(IClientService);
    authService =
      await moduleRef.resolve<IClientAuthService>(IClientAuthService);
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
      expect(staff.firstname).toBeTruthy();
      expect({
        fullname: staff?.firstname,
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
