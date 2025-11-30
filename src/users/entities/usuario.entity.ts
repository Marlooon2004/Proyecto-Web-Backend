import {
  Entity,
  PrimaryColumn,
  Column,
  JoinColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Rol } from './rol.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryColumn()
  id_generated: string;

  @Column()
  usuario: string;

  @Column()
  contrasenya: string;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'rol', referencedColumnName: 'rol' })
  rolInfo: Rol;

  @BeforeInsert()
  generateId() {
    if (!this.id_generated) {
      this.id_generated = uuidv4();
    }
    if (!this.rolInfo) {
      this.rolInfo = { rol: 'Cliente' } as Rol;
    }
  }
}
