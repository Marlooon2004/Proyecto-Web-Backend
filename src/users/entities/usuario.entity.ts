import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
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

  @OneToOne(() => Rol)
  @JoinColumn({ name: 'rol', referencedColumnName: 'rol' })
  rolInfo: Rol;

  @Column()
  rol: string;

  @BeforeInsert()
  generateId() {
    if (!this.id_generated) {
      this.id_generated = uuidv4();
    }
  }
}
