import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Marca } from './marca.entity';

@Entity('modelo')
export class Modelo {
  @PrimaryColumn()
  modelo: string;

  @ManyToOne(() => Marca)
  @JoinColumn({ name: 'marca' })
  marca: Marca;
}
