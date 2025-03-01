import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdatePwdDTO {
  @ApiProperty({
    type: String,
    name: 'oldPassword',
    description: 'The old password of the user',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({ type: String, name: 'newPassword' })
  @IsString()
  newPassword: string;
}
export class SigninAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'email',
    description: 'The email address if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    name: 'phone',
    description: 'The phone number if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ type: String, name: 'password' })
  @IsString()
  password: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    type: String,
    name: 'email',
    description: 'The email address if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    name: 'phone',
    description: 'The phone number if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}

export class ResetPasswordDTO extends SigninAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'otpCode',
    description: 'The otp validation code for reseting',
  })
  @IsOptional() // TODO: this is required
  @IsNotEmpty()
  otpCode: string;
}
