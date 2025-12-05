import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  Length,
} from 'class-validator';

export class CreateContractDTO {
  @IsString()
  @IsNotEmpty()
  idCliente: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaInicio: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaFin: Date;

  @IsNotEmpty()
  @IsString()
  @Length(1)
  formaPago: string;

  @IsNotEmpty()
  @IsString()
  @Length(1)
  seguro: string;

  @IsString()
  @IsNotEmpty()
  idMoto: string;

  @IsNumber()
  costoTotal: number;
}
