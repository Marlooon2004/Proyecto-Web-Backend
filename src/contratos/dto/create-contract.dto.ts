import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  Length,
  IsBoolean,
} from 'class-validator';

export class CreateContractDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

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

  @IsNumber()
  @Type(() => Number)
  diasProrroga: number;

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
  idTarifa: string;

  @IsString()
  @IsNotEmpty()
  idMoto: string;

  @IsBoolean()
  contratoActivo: boolean;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaCancelacion: Date;
}
