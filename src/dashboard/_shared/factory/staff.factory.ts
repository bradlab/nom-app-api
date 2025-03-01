import { IRegisterStafftDTO } from 'dashboard/auth/auth.service.interface';
import { HashFactory } from 'adapter/hash.factory';
import { Staff, OStaff } from '../model/staff.model';
import { DataHelper } from 'adapter/helper/data.helper';
import { IUpdateStaffDTO } from 'dashboard/manager/staff.service.interface';

export abstract class StaffFactory {
  static async create(data: IRegisterStafftDTO): Promise<Staff> {
    const user = new Staff();
    user.email = data.email;
    user.phone = data.phone;
    user.maritalStatus = data.maritalStatus;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.avatar = data.avatar;
    user.fullname =
      data.fullname ?? DataHelper.getFullName(data.firstname, data.lastname);
    user.address = data.address;
    user.sex = data.sex;
    user.country = data.country;
    user.password = await HashFactory.hashPwd(data.password);
    return user;
  }

  static update(user: Staff, data: IUpdateStaffDTO, all = false): Staff {
    user.maritalStatus = data.maritalStatus ?? user.maritalStatus;
    user.firstname = data.firstname ?? user.firstname;
    user.lastname = data.lastname ?? user.lastname;
    user.address = data.address ?? user.address;
    user.country = data.country ?? user.country;
    user.avatar = data.avatar ?? user.avatar;
    user.username = data.username ?? user.username;
    if (data.firstname || data.lastname) {
      user.fullname = DataHelper.getFullName(
        user.firstname!,
        user.lastname!,
      );
    }
    user.sex = data.sex ?? user.sex;
    if (all) {
      user.email = data.email ?? user.email;
      user.phone = data.phone ?? data.phone;
    }

    return user;
  }
  static updateUsername(user: Staff, data: IUpdateStaffDTO): Staff {
    user.email = data.email ?? user.email;
    user.phone = data.phone ?? data.phone;

    return user;
  }

  static getUser(user: Staff): OStaff {
    if (user) {
      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstname: user.firstname,
        lastname: user.lastname,
        fullname: user.fullname,
        address: user.address,
        avatar: DataHelper.getFileLink(user.avatar!),
        sex: user.sex,
        isActivated: user.isActivated,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
    return null as any;
  }
}
