import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('tarifa')
export class Tarifa {
  @PrimaryColumn()
  id_generated: string;

  @Column()
  tarifa_contrato: number;

  @Column()
  tarifa_prorroga: number;

  @BeforeInsert()
  generateId() {
    if (!this.id_generated) {
      this.id_generated = uuidv4();
    }
  }
}
