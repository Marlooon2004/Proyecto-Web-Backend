import { Entity, PrimaryColumn } from 'typeorm';

@Entity('marca')
export class Marca {
  @PrimaryColumn()
  marca: string;
}
