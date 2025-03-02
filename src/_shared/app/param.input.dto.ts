export interface IIDParamDTO {
  id: string;
}
export interface IIDsParamDTO {
  ids?: string[];
}
export interface IPhoneParamDTO {
  phone: string;
}

export interface IUserParamDTO {
  ids?: string[];
  email?: string;
  phone?: string;
}

export interface IGlobalSearch {
  id?: string;
  from?: Date;
  to?: Date;
  date?: Date;
  userID?: string;
  clientID?: string;
  reference?: string;
}
