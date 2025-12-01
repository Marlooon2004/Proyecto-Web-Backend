import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Cliente } from 'src/users/entities/cliente.entity';
import { Tarifa } from './tarifa.entity';
import { Moto } from './moto.entity';

@Entity('contrato')
export class Contrato {
  @PrimaryColumn()
  id_generated: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @Column()
  fecha_inicio: Date;

  @Column()
  fecha_fin: Date;

  @Column()
  dias_prorroga: number;

  @Column({ length: 1 })
  forma_pago: string;

  @Column({ length: 1 })
  seguro: string;

  @ManyToOne(() => Tarifa)
  @JoinColumn({ name: 'cod_tarifa' })
  tarifa: Tarifa;

  @OneToOne(() => Moto)
  @JoinColumn({ name: 'id_moto' })
  moto: Moto;

  @Column()
  contrato_activo: boolean;

  @Column()
  fecha_cancelacion: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id_generated) {
      this.id_generated = uuidv4();
    }
  }
}
