import { Test, TestingModule } from '@nestjs/testing';
import { StatisticService } from './statistic.service';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { TestGlobalConfig } from '../../../test/test-config.spec';
import { ConfigModule } from '@nestjs/config';

describe('StatisticService', () => {
  let service: StatisticService;
  let dashboardRepository: IDashboardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        StatisticService,
        {
          provide: IDashboardRepository,
          useValue: TestGlobalConfig.mockDataService,
        },
      ],
    }).compile();

    service = module.get<StatisticService>(StatisticService);
    dashboardRepository = module.get<IDashboardRepository>(IDashboardRepository);
  });

  it('should be defined', async () => {
    await expect(service).toBeDefined();
  })
});
