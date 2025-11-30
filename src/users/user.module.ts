import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//Service - Controller
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
//entities
import { Municipio } from './entities/municipio.entity';
import { Usuario } from './entities/usuario.entity';
import { Cliente } from './entities/cliente.entity';
import { Rol } from './entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol, Cliente, Municipio])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
