import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tarifa')
export class Tarifa {
  @PrimaryColumn()
  id_generated: string;

  @Column()
  tarifa_contrato: number;

  @Column()
  tarifa_prorroga: number;
}
