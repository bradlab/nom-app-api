import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  Body,
  Patch,
  Post,
  ParseArrayPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ISubscriptionService } from './subscription.service.interface';
import { IDsParamDTO } from 'adapter/param.dto';
import { DocSubscriptionDTO } from './doc.subscription.dto';
import { SubscriptionFactory } from 'dashboard/_shared/factory/subscription.factory';
import { ISubscription, OSubscription } from 'dashboard/_shared/model/subscription.model';
import { CreateSubscriptionDTO, SubscriptionQueryDTO } from './subscription.input.dto';
import { GetUser } from 'dashboard/_shared/decorator';
import { Staff } from 'dashboard/_shared/model/staff.model';
import { StaffGuard } from 'dashboard/_shared/guard/auth.guard';
import { Roles } from 'adapter/decorator';
import { RoleEnum } from 'app/enum';

@ApiTags("Service subscription's management")
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: ISubscriptionService) {}


    /**
     * @method POST
     */
  
    @Roles([RoleEnum.MANAGEMENT, RoleEnum.COMMERCIAL])
    @Post()
    @ApiOperation({
      summary: 'Subscribe client',
      description:
        'Créé un abonnement pour le client',
    })
    async create(@GetUser() user: Staff, @Body() data: CreateSubscriptionDTO): Promise<OSubscription> {
      const client = await this.subscriptionService.add(user, data);
      return SubscriptionFactory.getSubscription(client);
    }
  
    @Roles([RoleEnum.MANAGEMENT, RoleEnum.COMMERCIAL])
    @Post('bulk') // Cette fonctionnalité sera plus utiles pour les imports
    @ApiOperation({ summary: 'Create a list of subscriptions' })
    @ApiBody({type: CreateSubscriptionDTO, isArray: true})
    @ApiResponse({
      status: 200,
      description: "Abonnement créés avec succès",
      type: DocSubscriptionDTO,
    })
    async bulk(
      @GetUser() client: Staff,
      @Body(new ParseArrayPipe({ items: CreateSubscriptionDTO })) datas: CreateSubscriptionDTO[],
    ) {
      const prestations = await this.subscriptionService.bulk(client, datas);
      return prestations?.map((prestation) => SubscriptionFactory.getSubscription(prestation));
    }

  /**
   * Récupère toutes les abonnements et les filtrer selon les paramètres
   * @param param Paramètres de filtrage
   * @returns Une liste des abonnement groupés par mois et année
   */
  @Roles([RoleEnum.MANAGEMENT, RoleEnum.COMMERCIAL])
  @ApiOperation({ summary: 'Retrieve subscriptions list' })
  @ApiResponse({type: DocSubscriptionDTO, isArray: true})
  @Get()
  async getAll( @Query() param: SubscriptionQueryDTO): Promise<OSubscription[]> {
    const subs = await this.subscriptionService.fetchAll(param);
    return subs.map(sub => SubscriptionFactory.getSubscription(sub));
  }

  @Roles([RoleEnum.MANAGEMENT, RoleEnum.COMMERCIAL])
  @ApiOperation({ summary: 'Group subscriptions list' })
  @ApiResponse({type: DocSubscriptionDTO, isArray: true})
  @Get('group')
  async groupAll(@Query() param: SubscriptionQueryDTO) {
    const subs = await this.subscriptionService.fetchAll(param);
    return this.groupByMonthYear(subs);
  }

  groupByMonthYear(data: ISubscription[]): { [key: string]: ISubscription[] } {
    const grouped: { [key: string]: ISubscription[] } = {};
    const monthNames = ["Janv.", "Fév.", "Mars", "Avr.", "Mai", "Juin",
                        "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
  
    for (const item of data) {
      const createdAt = new Date(item.createdAt);
      const month = monthNames[createdAt.getMonth()];
      const year = createdAt.getFullYear();
      const key = `${month} ${year}`;
  
      if (grouped[key]) {
        grouped[key].push(item);
      } else {
        grouped[key] = [item];
      }
    }
  
    return grouped;
  }

  /**
   * Récupère un abonnement par son ID
   * @param id ID de l'abonnement
   * @returns L'abonnement correspondante
   */
  @ApiOperation({ summary: 'Fetch one subscription by its ID' })
  @ApiResponse({type: DocSubscriptionDTO})
  @Get(':id')
  async show(@Param('id', ParseUUIDPipe) id: string) {
    return SubscriptionFactory.getSubscription(await this.subscriptionService.fetchOne(id));
  }

  @Roles([RoleEnum.MANAGEMENT, RoleEnum.COMMERCIAL])
  @Patch('state')
  @ApiOperation({ summary: "Change subscription state", description: "Activer ou désactiver un ou plusieurs abonnements" })
  @ApiBody({
    type: IDsParamDTO,
    description: 'Id des abonnements concernés',
  })
  @ApiResponse({ type: Boolean })
  async setState(@Body() { ids }: IDsParamDTO): Promise<boolean> {
    if (ids) {
      if (ids && typeof ids === 'string') ids = [ids];
      return await this.subscriptionService.setState(ids);
    }
    return false;
  }
}
