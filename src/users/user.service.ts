/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
//import necesarias
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
//entities
import { Municipio } from './entities/municipio.entity';
import { Cliente } from './entities/cliente.entity';
import { Rol } from './entities/rol.entity';
import { Usuario } from './entities/usuario.entity';
//dto
import { CreateUserDTO } from './dto/create-user.dto';
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

  //crear cliente - usuario
  async createNewUser(
    createUserDto: CreateUserDTO,
  ): Promise<{ cliente: Cliente; usuario: Usuario }> {
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { usuario: createUserDto.username },
    });
    if (usuarioExistente) {
      throw new ConflictException('Ya existe el nombre de usuario');
    }

    const existeCarnet = await this.clienteRepository.findOne({
      where: { carnet: createUserDto.CI },
    });
    if (existeCarnet) {
      throw new ConflictException(
        'Ya existe un usuario registrado con este carnet de identidad',
      );
    }

    const existeCorreo = await this.clienteRepository.findOne({
      where: { correo: createUserDto.email },
    });
    if (existeCorreo) {
      throw new ConflictException(
        'Ya existe un usuario registrado con este correo electronico',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    //creacion usuario
    const nuevoUsuario = this.usuarioRepository.create({
      usuario: createUserDto.username,
      contrasenya: hashedPassword,
      rol: 'Cliente',
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    const cliente = new Cliente();
    cliente.carnet = createUserDto.CI;
    cliente.nombre = createUserDto.firstName;
    cliente.apellidos = createUserDto.lastName;
    cliente.edad = createUserDto.age;
    cliente.sexo = createUserDto.sex;
    cliente.telef_contacto = createUserDto.phoneNumber;
    cliente.nombre_mun = createUserDto.municipality;
    cliente.correo = createUserDto.email;
    cliente.id_usuario = usuarioGuardado.id_generated;

    const clienteGuardado = await this.clienteRepository.save(cliente);

    console.log(`Usuario creado: ${usuarioGuardado.usuario}`);
    return {
      cliente: clienteGuardado,
      usuario: usuarioGuardado,
    };
  }
}
