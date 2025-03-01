export abstract class DataGenerator {
  static randomString(size = 8): string {
    let str = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < size; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }
  static randomNumber(size = 6): string {
    let str = '';
    const chars = '0123456789';
    for (let i = 0; i < size; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }
}
