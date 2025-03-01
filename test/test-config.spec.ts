/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { faker } from '@faker-js/faker';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { IAppModule } from '../src/app.module';
import {
  CanActivate,
  INestApplication,
  Module,
  ValidationPipe,
} from '@nestjs/common';

export const getBool = () => faker.datatype.boolean();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.test.env', //.dev.env, .prod.env
      expandVariables: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: +(process.env.TEST_DB_PORT || 5432),
      host: process.env.TEST_DB_HOST,
      database: process.env.TEST_DB_NAME,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      logger: 'advanced-console',
      logging: ['error'],
      synchronize: true,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    IAppModule,
  ],
})
export class TestAppModule {}

export abstract class TestGlobalConfig {
  static _apiKey: string;
  static _accountToken: string;
  static _app: INestApplication;

  static mockAuthGuard: CanActivate = {
    canActivate: (ctx) => {
      const request = ctx.switchToHttp().getRequest();
      request['user'] = { id: faker.string.uuid() };
      return true;
    },
  };
  static mainTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      providers: [],
    }).compile();

    this._app = moduleFixture.createNestApplication();
    this._app.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: true,
        whitelist: true,
        transform: true,
      }),
    );
    this._app.setGlobalPrefix('/api/v1');
    await this._app.init();
    return this._app;
  };

  static mainTestAppWithoutGuard = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideGuard('StaffGuard')
      .useValue(this.mockAuthGuard)
      .compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: true,
        whitelist: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('/api/v1');
    await app.init();
    return app;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static mockRepositoryResponse = async (x: any): Promise<any> => {
    return Promise.resolve({
      ...x,
      isActivated: x.isActivated ?? true,
      id: x?.id ?? faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  private static mockInRepository = () => ({
    findBy: jest.fn((x) => Promise.resolve(x)),
    find: jest.fn((x) => Promise.resolve([x])),
    findOneByID: jest.fn((x) => Promise.resolve(x)),
    findByIds: jest.fn((x) => Promise.resolve([x])),
    findOneBy: jest.fn((x) => Promise.resolve(x)),
    findForLogin: jest.fn((x) => Promise.resolve(x)),
    findOne: jest.fn((x) => Promise.resolve(x)),
    create: jest.fn().mockImplementation(this.mockRepositoryResponse),
    createMany: jest.fn((x) => Promise.resolve(x)),
    updateMany: jest.fn((x) => Promise.resolve(x)),
    update: jest.fn().mockImplementation(this.mockRepositoryResponse),
    clean: jest.fn((x) => x).mockResolvedValue(true),
    removeMany: jest.fn((x) => x).mockResolvedValue(true),
    remove: jest.fn().mockResolvedValue(true),
  });

  static mockDataService = () => ({
    products: this.mockInRepository(),
  });

  static mockService = () => ({
    add: jest.fn().mockImplementation(this.mockRepositoryResponse),
    edit: jest.fn().mockImplementation(this.mockRepositoryResponse),
    fetchOne: jest.fn((x) => Promise.resolve(x)),
    findOneBy: jest.fn((x) => Promise.resolve(x)),
    fetchAll: jest.fn((x) => Promise.resolve([x])),
    fetchByIds: jest.fn((x) => Promise.resolve([x])),
    setState: jest.fn(() => Promise.resolve(true)),
    setAvaillability: jest.fn(() => Promise.resolve(true)),
    search: jest.fn((x) => Promise.resolve(x)),
    remove: jest.fn().mockResolvedValue(true),
    fetchOneInsurer: jest.fn((x) => Promise.resolve(x)),
  });
}
