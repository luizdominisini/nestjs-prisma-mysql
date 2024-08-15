import { IsJWT, IsString, IsStrongPassword } from 'class-validator';

export class AuthResetDto {
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 0,
    minSymbols: 0,
    minLowercase: 0,
    minNumbers: 0,
  })
  password: string;

  @IsJWT()
  token: string;
}
