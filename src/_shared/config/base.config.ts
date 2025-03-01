/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

export abstract class BaseConfig {
  private static logger = new Logger();
  static imageFileType: string | RegExp;
  static checkFile(filename: string, content: any): void {
    try {
      if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, JSON.stringify(content));
      }
    } catch (error) {
      this.logger.error(error, 'ERROR::BaseConfig.checkFile');
    }
  }

  static checkFolders(paths: string[]): void {
    try {
      if (paths.length > 0) {
        paths.map((pathname) => {
          const existed = fs.existsSync(pathname);
          if (!existed) {
            fs.mkdirSync(pathname);
          }
        });
      }
    } catch (error) {
      this.logger.error(error, 'ERROR::BaseConfig.checkFolders');
    }
  }

  static createUpload() {
    const upload = path.resolve(__dirname, '../../upload');
    const documents = path.resolve(__dirname, '../../upload/documents');
    const images = path.resolve(__dirname, '../../upload/images');
    const videos = path.resolve(__dirname, '../../upload/videos');
    const audios = path.resolve(__dirname, '../../upload/audios');

    this.checkFolders([upload, documents, images, videos, audios]);
  }

  static fileFilter = (_, file: any, callback: any): void => {
    if (
      !file.originalname.match(
        /\.(jpg|jpeg|png|gif|jfif|svg|avif|webp|docx|txt|doc|xls|xlsx|pdf|csv|mp3|wav|bwf|ogg|flac|avi|mp4|mkv|mov|flv)$/,
      )
    ) {
      callback(new Error('Only authorized extension are allowed!'), false);
    }
    callback(null, true);
  };

  static imageFileFilter = (_, file: any, callback: any): void => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif|svg|avif|webp)$/)) {
      callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  };

  static docFileFilter = (_, file: any, callback: any): void => {
    if (!file.originalname.match(/\.(docx|txt|doc|xls|xlsx|pdf|csv)$/)) {
      callback(new Error('Only doc files are allowed!'), false);
    }
    callback(null, true);
  };

  static getFilePath = (filename: string): string => {
    if (filename) {
      if (filename.match(/\.(docx|txt|doc|xls|xlsx|pdf|csv)$/))
        return './upload/documents';
      if (filename.match(/\.(jpg|jpeg|png|gif|jfif|svg|avif|webp)$/))
        return './upload/images';
      if (filename.match(/\.(avi|mp4|mkv|mov|flv)$/)) return './upload/videos';
      if (filename.match(/\.(mp3|wav|bwf|ogg|flac)$/)) return './upload/audios';
    }
    return null as any;
  };

  static setFilePath = (_, file: any, callback: any): void => {
    if (file) {
      const upload = path.resolve(__dirname, '../../upload');
      const documents = path.resolve(__dirname, '../../upload/documents');
      const images = path.resolve(__dirname, '../../upload/images');
      const videos = path.resolve(__dirname, '../../upload/videos');
      const audios = path.resolve(__dirname, '../../upload/audios');

      this.checkFolders([upload, documents, images, videos, audios]);
      if (file.originalname.match(/\.(docx|txt|doc|xls|xlsx|pdf|csv)$/))
        callback(null, './upload/documents');
      if (file.originalname.match(/\.(jpg|jpeg|png|gif|jfif|svg|avif|webp)$/))
        callback(null, './upload/images');
      if (file.originalname.match(/\.(avi|mp4|mkv|mov|flv)$/))
        callback(null, './upload/videos');
      if (file.originalname.match(/\.(mp3|wav|bwf|ogg|flac)$/))
        callback(null, './upload/audios');
    }
  };

  static editFileName = (_, file: any, callback: any): void => {
    if (file) {
      const oname: string = file.originalname.split('.')[0];
      const name = oname.length < 11 ? oname : oname.slice(0, 10);
      const fileExtName = extname(file.originalname);
      const randomName = Array(10)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      callback(null, `${name}__${randomName}${fileExtName}`);
    }
  };
}
