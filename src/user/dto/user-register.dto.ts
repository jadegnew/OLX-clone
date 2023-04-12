import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// TODO add validation
