import { Module } from '@nestjs/common';
import { ContratoService } from './contrato.service';
import { ContratoController } from './contrato.controller';
//bd
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contrato } from './entities/contrato.entity';
import { Cliente } from 'src/users/entities/cliente.entity';
import { Moto } from './entities/moto.entity';
import { Marca } from './entities/marca.entity';
import { Modelo } from './entities/modelo.entity';
import { Tarifa } from './entities/tarifa.entity';
import { Usuario } from 'src/users/entities/usuario.entity';
import { Municipio } from 'src/users/entities/municipio.entity';
import { Rol } from 'src/users/entities/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contrato,
      Moto,
      Cliente,
      Marca,
      Modelo,
      Usuario,
      Rol,
      Municipio,
      Tarifa,
    ]),
  ],
  controllers: [ContratoController],
  providers: [ContratoService],
  exports: [ContratoService],
})
export class ContratoModule {}
