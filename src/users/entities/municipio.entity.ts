import { Entity, PrimaryColumn } from 'typeorm';

@Entity('municipio')
export class Municipio {
  @PrimaryColumn()
  nombre_mun: string;
}
