import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { SupportService } from './support.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ICreateSupportDTO } from './support.service.interface';
import { TestGlobalConfig } from '../../../test/test-config.spec';
import { Staff } from '../_shared/model/staff.model';
import { ConfigModule } from '@nestjs/config';
import { faker } from '@faker-js/faker/.';
import { SupportTypeEnum } from 'dashboard/_shared/model/support.model';

describe('SupportService', () => {
  let service: SupportService;
  let dashboardRepository: IDashboardRepository;

  const data: ICreateSupportDTO = {
    clientID: faker.string.uuid(),
    message: faker.lorem.sentence(),
    type: faker.helpers.enumValue(SupportTypeEnum)
  };
  const user: Staff = {} as Staff;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        SupportService,
        {
          provide: IDashboardRepository,
          useValue: TestGlobalConfig.mockDataService,
        },
      ],
    }).compile();

    service = module.get<SupportService>(SupportService);
    dashboardRepository = module.get<IDashboardRepository>(IDashboardRepository);
  });

  it('should throw conflict exception if duplicate support exists', async () => {
    dashboardRepository.supports.findOne = jest.fn().mockResolvedValueOnce({} as any);

    await expect(service.add(user, data)).rejects.toThrow(ConflictException);
  });

  it('should add a new support if no duplicate exists and client exists', async () => {
    jest.spyOn(dashboardRepository.supports, 'findOne').mockResolvedValueOnce(null as any);
    expect(dashboardRepository.supports.create).toHaveBeenCalledWith(
      expect.any(Object),
    );
  });
});
