import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from './usuario.entity';
import { Municipio } from './municipio.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryColumn()
  id_generated: string;

  @Column()
  carnet: string;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  edad: number;

  @Column({ length: 1 })
  sexo: string;

  @Column()
  telef_contacto: string;

  @OneToOne(() => Municipio)
  @JoinColumn({ name: 'nombre_mun' })
  municipio: Municipio;

  @Column()
  correo: string;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @BeforeInsert()
  generateId() {
    if (!this.id_generated) {
      this.id_generated = uuidv4();
    }
  }
}
