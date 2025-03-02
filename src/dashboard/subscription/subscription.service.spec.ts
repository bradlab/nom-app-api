import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ICreateSubscriptionDTO, ISubscriptionQuery, IUpdateSubscriptionDTO } from './subscription.service.interface';
import { getBool, TestGlobalConfig } from '../../../test/test-config.spec';
import { Staff } from '../_shared/model/staff.model';
import { ISubscription, SubscriptionTypeEnum } from 'dashboard/_shared/model/subscription.model';
import { faker } from '@faker-js/faker/.';
import { Client } from 'dashboard/_shared/model/client.model';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let dashboardRepository: IDashboardRepository;

  const id = faker.string.uuid();
  const data: ICreateSubscriptionDTO = { 
    clientID: id, 
    type: faker.helpers.enumValue(SubscriptionTypeEnum),
    startDate: getBool() ? faker.date.recent() : undefined,
    value: faker.number.int(),
    duration: faker.number.int(),
    price: faker.number.float(),
  }

  const client: Client = { 
    id,
    labelName: faker.company.buzzNoun(),
    address: faker.address.streetAddress(),
    phone: faker.phone.number({ style: 'international'} ),
    email: faker.internet.email(),
  } as Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: IDashboardRepository,
          useValue: TestGlobalConfig.mockDataService,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    dashboardRepository = module.get<IDashboardRepository>(IDashboardRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('editManySubscriptions', () => {
    it('should update many subscriptions if subs array is not empty', async () => {
      const subs: ISubscription[] = [{ id } as ISubscription];
      await service.editManySubscriptions(subs);
      expect(dashboardRepository.subscriptions.updateMany).toHaveBeenCalledWith(subs);
    });

    it('should not call updateMany if subs array is empty', async () => {
      await service.editManySubscriptions([]);
      expect(dashboardRepository.subscriptions.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('fetchAll', () => {
    it('should fetch all subscriptions with given query params', async () => {
      dashboardRepository.subscriptions.find = jest.fn().mockResolvedValueOnce([{}]);
      const param: ISubscriptionQuery = { type: SubscriptionTypeEnum.PACKAGE };
      const rep = await service.fetchAll(param);
      expect(dashboardRepository.subscriptions.find).toHaveBeenCalled();
      expect(rep).toBeDefined();
      expect(rep.length).toBeGreaterThan(0);
    });

    it('should fetch all subscriptions without query params', async () => {
      await service.fetchAll({});
      expect(dashboardRepository.subscriptions.find).toHaveBeenCalled();
    });
  });

  describe('add', () => {
    it('should add a subscription successfully', async () => {
      dashboardRepository.clients.findOne = jest.fn().mockResolvedValueOnce(client);
      await service.add({} as Staff, data);
      expect(dashboardRepository.clients.findOne).toHaveBeenCalled();
      expect(dashboardRepository.subscriptions.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if client is not found', async () => {
      dashboardRepository.clients.findOne = jest.fn().mockResolvedValueOnce(null);
      await expect(service.add({} as Staff, data)).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchOne', () => {
    it('should fetch one subscription by id', async () => {
      dashboardRepository.subscriptions.findOne = jest.fn().mockResolvedValueOnce({ id });
      const rep = await service.fetchOne(id);
      expect(dashboardRepository.subscriptions.findOne).toHaveBeenCalled();
      expect(rep).toBeDefined();
    });

    it('should log error if an exception occurs', async () => {
      const error = new Error('Test error');
      dashboardRepository.subscriptions.findOne = jest.fn().mockResolvedValueOnce(error);
      await expect(service.fetchOne(id)).rejects.toThrow(error);
    });
  });

  describe('edit', () => {
    it('should edit a subscription successfully', async () => {
      dashboardRepository.subscriptions.findOne = jest.fn().mockResolvedValueOnce({ id });
      await service.edit({...data, id});
      expect(dashboardRepository.subscriptions.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if subscription is not found', async () => {
      const data: IUpdateSubscriptionDTO = { id } as IUpdateSubscriptionDTO;
      dashboardRepository.subscriptions.findOne = jest.fn().mockResolvedValueOnce(null);
      await expect(service.edit(data)).rejects.toThrow(NotFoundException);
    });

    it('should log error if an exception occurs', async () => {
      const error = new Error('Test error');
      dashboardRepository.subscriptions.findOne = jest.fn().mockResolvedValueOnce(error);
      await expect(service.edit({...data, id})).rejects.toThrow(error);
    });
  });
});
