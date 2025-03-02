import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { RoleEnum } from 'app/enum';
import { IRegisterStafftDTO } from 'dashboard/auth/auth.service.interface';
import { IStaffService } from 'dashboard/manager/staff.service.interface';
// import { RULES } from 'app/access.constant';

@Injectable()
export class GlobalSeed implements OnApplicationBootstrap {
  private logger = new Logger();
  constructor(private readonly staffService: IStaffService) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.createAdmin();
  }

  private async createAdmin() {
    try {
      const data: IRegisterStafftDTO = {
        firstname: 'Mateo',
        lastname: 'ADMIN',
        phone: '+22890809080',
        email: 'mateo@nomapp.com',
        password: 'Eba_admin300',
        role: RoleEnum.MANAGEMENT,
      }
      const existed = await this.staffService.search({email: data.email, phone: data.phone});
      if (!existed) {
        await this.staffService.add(data).then((staff) => {
          this.logger.log(`ADMIN::CREATED ==== email: ${staff.email}, password: ${data.password}`, 'CREATE::ADMIN => SEED');
        });
      }
    } catch (error) {
      this.logger.error(error, 'CREATE::ADMIN => SEED');
    }
  }
}
