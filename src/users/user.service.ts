//import necesarias
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const queryRunner =
      this.usuarioRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nuevoUsuario = this.usuarioRepository.create({
        usuario: createUserDto.username,
        contrasenya: hashedPassword,
      });

      const usuarioGuardado = await queryRunner.manager.save(nuevoUsuario);

      // Crear cliente
      const cliente = this.clienteRepository.create({
        carnet: createUserDto.CI,
        nombre: createUserDto.firstName,
        apellidos: createUserDto.lastName,
        edad: createUserDto.age,
        sexo: createUserDto.sex,
        telef_contacto: createUserDto.phoneNumber,
        nombre_mun: createUserDto.municipality,
        correo: createUserDto.email,
        usuario: { id_generated: usuarioGuardado.id_generated } as Usuario,
      });

      const clienteGuardado = await queryRunner.manager.save(cliente);

      await queryRunner.commitTransaction();

      console.log(`Usuario creado: ${usuarioGuardado.usuario}`);
      return {
        cliente: clienteGuardado,
        usuario: usuarioGuardado,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error en createNewUser:', error);
      throw new Error(
        'No se pudo completar el registro. Por favor, intente nuevamente.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  //autenticacion
  async findByUsername(nombre_usuario: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({
      where: { usuario: nombre_usuario },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
