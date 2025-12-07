import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsDateString,
} from 'class-validator';

export class CreateContractDTO {
  @IsString()
  @IsNotEmpty()
  idCliente: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFin: string;

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
