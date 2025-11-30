import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  @Min(18)
  @Max(120)
  @Type(() => Number)
  age: number;

  @IsNotEmpty()
  @IsString()
  sex: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  municipality: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
