import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Marca } from './marca.entity';

@Entity('modelo')
export class Modelo {
  @PrimaryColumn()
  modelo: string;

  @OneToOne(() => Marca)
  @JoinColumn({ name: 'marca' })
  marca: Marca;
}
