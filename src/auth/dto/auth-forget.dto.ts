import { IsEmail } from 'class-validator';

export class AuthForgetDto {
  @IsEmail()
  email: string;
}
