import { ImgDTO, ImgModel } from 'domain/interface';

export abstract class DataHelper {
  static removeNullish<T>(obj: T): {
    [P in keyof T as Exclude<P, undefined | null>]: T[P];
  } {
    if (!DataHelper.isEmpty(obj)) {
      return Object.fromEntries(
        Object.entries(obj!).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([key, value]) => value !== null && value !== undefined,
        ),
      ) as {
        [P in keyof T as Exclude<P, undefined | null>]: T[P];
      };
    }
    return null as any;
  }

  static getImageNames(links: string[] = [], apiLink: string) {
    if(this.isNotEmptyArray(links) && apiLink) {
      return links.map((link) => link.replace(`${apiLink}/files/`, '') );
    }
    return [];
  }

  static getFullName(firstname: string, lastname: string) {
    return `${firstname} ${lastname}`;
  }

  static getFileLink(file?: string): string {
    if (file) {
      return `${process.env.APP_BASE_URL}/files/${file}`;
    }
    return null as any;
  }

  static getFileLinks(files: string[]): string[] {
    if (DataHelper.isNotEmptyArray(files)) {
      return files.map((f) => this.getFileLink(f)).filter(Boolean);
    }
    return [];
  }

  static getFiles(files: ImgModel[]) {
    if (files && Array.isArray(files)) {
      return files.map((image) => image?.filename);
    }
    return undefined;
  }

  static getFilesWithOriginal(files: ImgModel[]): ImgDTO[] {
    if (files) {
      if (Array.isArray(files))
        return files.map((image) => ({
          filename: image?.filename,
          originalname: image?.originalname,
        }));
      }
      return [];
  }

  static getImageLinks(images: string[]): Partial<string>[] {
    if (this.isNotEmptyArray(images)) {
      return images.map((image) => this.getFileLink(image));
    }
    return [];
  }

  static ramdomly<T>(array: T[]): T {
    if (array?.length > 0) {
      return array[Math.ceil(Math.random() * array.length - 1)];
    }
    return null as any;
  }

  static formatRef(reference: string, size = 5): string {
    if (reference) {
      reference = reference.toString();
      if (reference.length >= size) {
        return reference;
      } else {
        return '0'.repeat(size - reference.length) + reference;
      }
    }
    return null as any;
  }

  static isNotEmptyArray<T>(data: T[]): boolean {
    return Array.isArray(data) && data.length > 0;
  }

  static isEmpty<T>(data: T): boolean {
    if (!data) return true;
    if (typeof data === 'string') return !data ? true : false;
    if (typeof data === 'object') {
      return Object.keys(data).length === 0;
    }
    return true;
  }

  static deburrSpacing(text: string): string {
    return this.deburr(text?.replace(/\s/g, ''));
  }

  static deburr(text: string): string {
    if (text) {
      const replacements = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ú: 'u',
        ç: 'c',
        ñ: 'n',
        ä: 'a',
        ë: 'e',
        ï: 'i',
        ö: 'o',
        ü: 'u',
        ÿ: 'y',
        â: 'a',
        ê: 'e',
        î: 'i',
        ô: 'o',
        û: 'u',
        œ: 'oe',
      };

      return text
        .toLowerCase()
        .replace(
          /[áéíóúçñäëïöüÿâêîôûœç]/g,
          (match: string) => replacements[match],
        );
    }
    return null as any;
  }

  /**
   * @description create interval of dates
   * @param date - date string in format YYYY-MM-DD
   * @returns {from: Date, to: Date}
   */
}
