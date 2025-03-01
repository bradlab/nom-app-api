export class ImgDTO {
  originalname?: string;
  filename: string;
  fileLink?: string;
}

export interface ImgModel {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype?: string;
  destination?: string;
  filename: string;
  path?: string;
  size?: number;
}
