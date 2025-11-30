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
  async onModuleInit() {
    await this.cargarMunicipiosPorDefecto();
  }

  async cargarMunicipiosPorDefecto(): Promise<void> {
    const municipios = [
      { nombre_mun: 'La Habana Vieja' },
      { nombre_mun: 'Centro Habana' },
      { nombre_mun: 'Plaza de la Revolución' },
      { nombre_mun: 'Cerro' },
      { nombre_mun: 'Diez de Octubre' },
      { nombre_mun: 'Marianao' },
      { nombre_mun: 'Playa' },
      { nombre_mun: 'Boyeros' },
      { nombre_mun: 'Arroyo Naranjo' },
      { nombre_mun: 'Cotorro' },
      { nombre_mun: 'Regla' },
      { nombre_mun: 'Guanabacoa' },
      { nombre_mun: 'San Miguel del Padrón' },
      { nombre_mun: 'Lisa' },
      { nombre_mun: 'Habana del Este' },
    ];

    for (const municipioData of municipios) {
      const municipioExiste = await this.municipioRepository.findOne({
        where: { nombre_mun: municipioData.nombre_mun },
      });

      if (!municipioExiste) {
        await this.municipioRepository.save(municipioData);
      }
    }
  }

  async obtenerTodosLosMunicipios(): Promise<Municipio[]> {
    return await this.municipioRepository.find({
      order: {
        nombre_mun: 'ASC',
      },
    });
  }
}
