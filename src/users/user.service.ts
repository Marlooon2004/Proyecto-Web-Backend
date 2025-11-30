//import necesarias
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//entities
import { Municipio } from './entities/municipio.entity';
import { Cliente } from './entities/cliente.entity';
import { Rol } from './entities/rol.entity';
import { Usuario } from './entities/usuario.entity';
//dto
//import { CreateUserDTO } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
//import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,

    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,

    @InjectRepository(Municipio)
    private municipioRepository: Repository<Municipio>,
  ) {}

  //mostrar municipios
  async obtenerTodosLosMunicipios(): Promise<Municipio[]> {
    return await this.municipioRepository.find({
      order: {
        nombre_mun: 'ASC',
      },
    });
  }
}
