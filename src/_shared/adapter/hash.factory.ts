import * as bcrypt from 'bcrypt';

export abstract class HashFactory {
  static async hashPwd(password: string): Promise<string> {
    if (password) {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(password, salt);
    }
    return null as any;
  }

  static async isRightPwd(password: string, pass: string): Promise<boolean> {
    return password && pass && (await bcrypt.compare(password, pass)) ? true : false;
  }
}
