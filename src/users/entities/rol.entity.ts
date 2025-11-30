import { Entity, PrimaryColumn } from 'typeorm';

@Entity('rol')
export class Rol {
  @PrimaryColumn()
  rol: string;
}
