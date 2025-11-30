//import necesarias
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
//entities
import { Municipio } from './entities/municipio.entity';
import { Cliente } from './entities/cliente.entity';
import { Rol } from './entities/rol.entity';
import { Usuario } from './entities/usuario.entity';
//dto
import { CreateUserDTO } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    const existeTelefono = await this.clienteRepository.findOne({
      where: { telef_contacto: createUserDto.phoneNumber },
    });
    if (existeTelefono) {
      throw new ConflictException(
        'Ya existe un usuario registrado con este numero de telefono',
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

  async findByUsuarioId(usuarioId: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { usuario: { id_generated: usuarioId } },
      relations: ['usuario'],
    });

    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    return cliente;
  }

  async changePassword(
    usuarioId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const cliente = await this.findByUsuarioId(usuarioId);
    if (!cliente) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const esContrasenyaActualCorrecta = await bcrypt.compare(
      changePasswordDto.currentPassword,
      cliente.usuario.contrasenya,
    );

    if (!esContrasenyaActualCorrecta) {
      throw new ConflictException('La contraseña actual es incorrecta');
    }

    if (changePasswordDto.newPassword.length < 8) {
      throw new ConflictException(
        'La nueva contraseña debe tener al menos 8 caracteres',
      );
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    cliente.usuario.contrasenya = hashedPassword;
    await this.usuarioRepository.save(cliente.usuario);
    return { message: 'Contraseña cambiada exitosamente' };
  }

  async update(
    usuarioId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: any }> {
    const cliente = await this.findByUsuarioId(usuarioId);
    if (!cliente) {
      throw new NotFoundException('Usuario no encontrado');
    }
    //verificar que el ci no coincidan con los de otros usuarios
    if (updateUserDto.CI && updateUserDto.CI !== cliente.carnet) {
      const existeCarnet = await this.clienteRepository.findOne({
        where: {
          carnet: updateUserDto.CI,
          id_generated: Not(cliente.id_generated),
        },
      });
      if (existeCarnet) {
        throw new ConflictException(
          'Ya existe un usuario con este carnet de identidad',
        );
      }
    }
    //verificar que no este registrado el correo a nombre de otro usuario
    if (updateUserDto.email && updateUserDto.email !== cliente.correo) {
      const existeCorreo = await this.clienteRepository.findOne({
        where: {
          correo: updateUserDto.email,
          id_generated: Not(cliente.id_generated),
        },
      });
      if (existeCorreo) {
        throw new ConflictException(
          'Ya existe un usuario con este correo electrónico',
        );
      }
    }
    //verificar que el nuevo nombre de usuario no este registrado ya
    if (
      updateUserDto.username &&
      updateUserDto.username !== cliente.usuario.usuario
    ) {
      const existeUsuario = await this.usuarioRepository.findOne({
        where: {
          usuario: updateUserDto.username,
          id_generated: Not(cliente.usuario.id_generated),
        },
      });
      if (existeUsuario) {
        throw new ConflictException(
          'Ya existe un usuario con este nombre de usuario',
        );
      }
    }
    //verificar que el nuevo telefono no este registrado
    if (
      updateUserDto.phoneNumber &&
      updateUserDto.phoneNumber !== cliente.telef_contacto
    ) {
      const existeTelefono = await this.clienteRepository.findOne({
        where: {
          telef_contacto: updateUserDto.phoneNumber,
          id_generated: Not(cliente.id_generated),
        },
      });
      if (existeTelefono) {
        throw new ConflictException(
          'Ya existe un usuario con este número de teléfono',
        );
      }
    }
    //Actualizar
    if (updateUserDto.firstName !== undefined)
      cliente.nombre = updateUserDto.firstName;
    if (updateUserDto.lastName !== undefined)
      cliente.apellidos = updateUserDto.lastName;
    if (updateUserDto.age !== undefined) cliente.edad = updateUserDto.age;
    if (updateUserDto.sex) {
      cliente.sexo = updateUserDto.sex === 'Male' ? 'M' : 'F';
    }
    if (updateUserDto.phoneNumber !== undefined)
      cliente.telef_contacto = updateUserDto.phoneNumber;
    if (updateUserDto.municipality !== undefined)
      cliente.nombre_mun = updateUserDto.municipality;
    if (updateUserDto.email !== undefined) cliente.correo = updateUserDto.email;
    if (updateUserDto.CI !== undefined) cliente.carnet = updateUserDto.CI;

    if (
      updateUserDto.username &&
      updateUserDto.username !== cliente.usuario.usuario
    ) {
      cliente.usuario.usuario = updateUserDto.username;
      await this.usuarioRepository.save(cliente.usuario);
    }
    //Guardar cliente modificado
    await this.clienteRepository.save(cliente);
    return {
      message: 'Perfil actualizado exitosamente',
      user: {
        id_generated: cliente.usuario.id_generated,
        usuario: cliente.usuario.usuario,
      },
    };
  }
}
