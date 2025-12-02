import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTarifaDTO {
  @IsNotEmpty()
  @IsString()
  idTarifa: string;

  @Min(0)
  @IsNumber()
  tarifaContrato: number;

  @Min(0)
  @IsNumber()
  tarifaProrroga: number;
}
