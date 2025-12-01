import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Modelo } from './modelo.entity';

@Entity('moto')
export class Moto {
  @PrimaryColumn()
  id_generated: string;

  @Column()
  matricula: string;

  @Column()
  color: string;

  @Column()
  cantd_km: number;

  @OneToOne(() => Modelo)
  @JoinColumn({ name: 'modelo' })
  modelo: Modelo;

  @Column()
  situacion: string;

  @Column()
  ruta_imagen: string;

  @Column()
  descripcion: string;
}
